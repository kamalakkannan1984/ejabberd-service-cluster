/**
 * @createdBy Kamal
 * @createdOn 05th May 2020
 */

import { config } from '../config/app';
import { userModel } from '../models/user';
import MessageService from '../services/message.service';
import TeamService from '../services/team.service';

const teamHandler: any = {};

/**
 *
 * @param {Object} req - request object
 * @param {Object} reply - response object
 * @description - Create team function
 */

teamHandler.createTeam = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    data.company_id = req.body.company_id;
    data.team_id = 0;
    data.team_name = req.body.team_name;
    data.team_type = req.body.team_type;
    data.description = req.body.description;
    data.created_by = req.body.created_by;
    data.resource_id = req.body.resource_id;
    data.processtype = 1;
    data.except_guest = req.body.except_guest;
    data.post_msg = req.body.post_msg;
    data.mention = req.body.mention;
    data.integration = req.body.integration;
    data.pin_post = req.body.pin_post;
    data.add_members = req.body.add_members;
    data.team_guid = req.body.team_guid;
    data.photo_info = req.body.photo_info;
    data.team_id_prefix = 'con';
    const teamService = new TeamService();
    const messageService = new MessageService();
    const record = await userModel.getUserById(data.created_by);
    if (record.length === 1) {
      const recordsets = await userModel.saveCreateTeam(data);
      console.log(recordsets);
      if (recordsets.errcode === 0) {
        const teamData: any = {};
        teamData.name = data.team_id_prefix + recordsets.team_id;
        teamData.service = 'conference.im01.unifiedring.co.uk';
        teamData.host = 'im01.unifiedring.co.uk';
        teamData.options = [
          {
            name: 'members_only',
            value: 'true',
          },
          {
            name: 'title',
            value: data.team_name,
          },
          {
            name: 'description',
            value: data.description,
          },
          {
            name: 'allow_change_subj',
            value: 'false',
          },
          {
            name: 'public',
            value: data.team_type === 1 ? 'true' : 'false',
          },
          {
            name: 'persistent',
            value: 'true',
          },
          {
            name: 'anonymous',
            value: 'false',
          },
          {
            name: 'vcard',
            value: `<vCard xmlns='vcard-temp'><PHOTO><BINVAL>${data.photo_info}</BINVAL><TYPE>image/jpeg</TYPE></PHOTO></vCard>`,
          },
        ];
        const createTeamResult = await teamService.createTeamWithOpts(teamData);
        if (createTeamResult === 0) {
          const members = data.add_members;
          const memberArr = members.split(',');
          const userIdArr = [];
          for (let i = 0; i < memberArr.length; i++) {
            teamData.jid = memberArr[i] + '@im01.unifiedring.co.uk';
            teamData.affiliation = 'member';
            await teamService.setRoomAffiliation(teamData);
            userIdArr.push(teamData.jid);
          }
          teamData.jid = data.created_by + '@im01.unifiedring.co.uk';
          userIdArr.push(teamData.jid);
          teamData.affiliation = 'owner';
          await teamService.setRoomAffiliation(teamData);
          teamData.password = '';
          teamData.reason = data.team_name;
          teamData.users = userIdArr.join(':');
          await messageService.sendDirectInvitation(teamData);

          // send message used to send status message
          /*const messageData: any = {};
          messageData.type = 'groupchat';
          messageData.from = data.created_by + '@im01.unifiedring.co.uk';
          messageData.to = teamData.name + '@' + teamData.service;
          messageData.subject = '';
          messageData.body = record[0].caller_id + ' created group ' + data.team_name;
          console.log(messageData);
          const resl = await messageService.sendMessage(messageData);
          console.log(resl);*/

          // send message used to send status message
          // stanza used to send status message
          const stanzaData: any = {};
          stanzaData.from = `${data.created_by}@im01.unifiedring.co.uk/${data.resource_id}`;
          stanzaData.to = `${teamData.name}@${teamData.service}`;
          stanzaData.body = `${record[0].caller_id} created group ${data.team_name}`;
          stanzaData.name = data.team_name;
          stanzaData.stanza = `<message to='${stanzaData.to}' type='groupchat' from='${stanzaData.from}'><body> ${stanzaData.body} </body><markable xmlns='urn:xmpp:chat-markers:0'/><broadcast name='${stanzaData.name}' xmlns='urn:xmpp:message-correct:0'/><message-type  value='CREATE' xmlns='urn:xmpp:message-correct:0'/><active xmlns='http://jabber.org/protocol/chatstates'/></message>`;
          console.log(stanzaData);
          await messageService.sendStanza(stanzaData);
          //broadcastMessage(stanzaData);
          stanzaData.to = `${teamData.name}@${teamData.service}/${data.created_by}`;
          stanzaData.body = `You created group ${data.team_name}`;
          stanzaData.stanza = `<message to='${stanzaData.to}' type='groupchat' from='${stanzaData.from}'><body> ${stanzaData.body} </body><markable xmlns='urn:xmpp:chat-markers:0'/><broadcast name='${stanzaData.name}' xmlns='urn:xmpp:message-correct:0'/><message-type  value='CREATE' xmlns='urn:xmpp:message-correct:0'/><active xmlns='http://jabber.org/protocol/chatstates'/></message>`;
          console.log(stanzaData);
          await messageService.sendStanza(stanzaData);
          //broadcastMessage(stanzaData);
          // stanza used to send status message

          res.send({ status_code: 200, team_id: teamData.name, message: recordsets.errmsg });
        } else {
          res.send({ status_code: 200, message: 'Team create failed' });
        }
      } else {
        // failed case
        res.send({ status_code: 404, message: recordsets.errmsg });
      }
    } else {
      res.send({ status_code: 404, message: 'User not found' });
    }
  } catch (err) {
    console.log('ERROR');
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

// updateTeam
teamHandler.updateTeam = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    data.company_id = req.body.company_id;
    data.team_name = req.body.team_name;
    data.team_type = req.body.team_type;
    data.description = req.body.description;
    data.created_by = req.body.created_by;
    data.resource_id = req.body.resource_id;
    data.processtype = 2;
    data.except_guest = req.body.except_guest;
    data.post_msg = req.body.post_msg;
    data.mention = req.body.mention;
    data.integration = req.body.integration;
    data.pin_post = req.body.pin_post;
    data.add_members = req.body.add_members;
    data.team_guid = req.body.team_guid;
    data.photo_info = req.body.photo_info;
    data.team_id_prefix = 'con';
    const teamService = new TeamService();
    const messageService = new MessageService();
    const record = await userModel.getUserById(data.created_by);
    console.log(record);
    const team_id = req.params.team_id;
    const team = team_id.match(/\d+/g);
    data.team_id = team[0];
    const recordTeam = await userModel.getTeamInfo(data.company_id, team[0], data.created_by);
    console.log(recordTeam);
    if (record.length === 1 && recordTeam.length === 1) {
      const recordsets = await userModel.saveCreateTeam(data);
      console.log(recordsets);
      if (recordsets.errcode === 0) {
        const teamOptionData: any = {};
        teamOptionData.name = team_id;
        teamOptionData.service = 'conference.im01.unifiedring.co.uk';
        teamOptionData.option = 'title';
        teamOptionData.value = data.team_name;
        await teamService.changeRoomOption(teamOptionData);
        teamOptionData.option = 'description';
        teamOptionData.value = data.description;
        await teamService.changeRoomOption(teamOptionData);
        teamOptionData.option = 'vcard';
        teamOptionData.value = `<vCard xmlns='vcard-temp'><PHOTO><BINVAL>${data.photo_info}</BINVAL><TYPE>image/jpeg</TYPE></PHOTO></vCard>`;

        await teamService.changeRoomOption(teamOptionData);
        teamOptionData.option = 'public';
        teamOptionData.value = data.team_type === 1 ? 'true' : 'false';
        await teamService.changeRoomOption(teamOptionData);

        /*const messageData: any = {};
        messageData.type = 'groupchat';
        messageData.from = data.created_by + '@im01.unifiedring.co.uk';
        messageData.to = `${teamOptionData.name}@${teamOptionData.service}`;
        messageData.subject = '';
        messageData.body = `${record[0].caller_id} changed the title from  ${recordTeam[0].team_name} to ${data.team_name}`;
        await messageService.sendMessage(messageData);

        messageData.to = `${teamOptionData.name}@${teamOptionData.service}/${data.created_by}`;
        messageData.body = `You changed title to ${data.team_name}`;
        console.log(messageData);
        await messageService.sendMessage(messageData); */

        ///
        const stanzaData: any = {};
        stanzaData.from = `${data.created_by}@im01.unifiedring.co.uk/${data.resource_id}`;
        stanzaData.to = `${teamOptionData.name}@${teamOptionData.service}`;
        stanzaData.body = `${record[0].caller_id} changed the title from  ${recordTeam[0].team_name} to ${data.team_name}`;
        stanzaData.name = data.team_name;
        stanzaData.stanza = `<message to='${stanzaData.to}' type='groupchat' from='${stanzaData.from}'><body> ${stanzaData.body} </body><markable xmlns='urn:xmpp:chat-markers:0'/><broadcast name='${stanzaData.name}' xmlns='urn:xmpp:message-correct:0'/><message-type  value='UPDATE' xmlns='urn:xmpp:message-correct:0'/><active xmlns='http://jabber.org/protocol/chatstates'/></message>`;
        console.log(stanzaData);
        await messageService.sendStanza(stanzaData);
        //broadcastMessage(stanzaData);
        stanzaData.to = `${teamOptionData.name}@${teamOptionData.service}/${data.created_by}`;
        stanzaData.body = `You changed title to ${data.team_name}`;
        stanzaData.stanza = `<message to='${stanzaData.to}' type='groupchat' from='${stanzaData.from}'><body> ${stanzaData.body} </body><markable xmlns='urn:xmpp:chat-markers:0'/><broadcast name='${stanzaData.name}' xmlns='urn:xmpp:message-correct:0'/><message-type  value='UPDATE' xmlns='urn:xmpp:message-correct:0'/><active xmlns='http://jabber.org/protocol/chatstates'/></message>`;
        console.log(stanzaData);
        await messageService.sendStanza(stanzaData);
        //broadcastMessage(stanzaData);
        ///

        res.send({ status_code: 200, message: 'Team updated successfully' });
      } else {
        // failed case
        res.send({ status_code: 404, message: recordsets.errmsg });
      }
    } else {
      res.send({ status_code: 404, message: 'Team or User not found' });
    }
  } catch (err) {
    console.log('ERROR');
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

// createTeamWithOpts
teamHandler.createTeamWithOpts = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    data.name = req.body.name;
    data.service = req.body.service;
    data.host = req.body.host;
    data.options = req.body.options;
    const teamService = new TeamService();
    const sendMessageResult = await teamService.createTeamWithOpts(data);
    console.log(sendMessageResult);
    if (sendMessageResult === 0) {
      res.send({ status_code: 200, message: 'Team created successfully' });
    } else {
      res.send({ status_code: 200, message: 'Team create failed' });
    }
  } catch (err) {
    console.log('ERROR');
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

// unsubscribeRoom
teamHandler.unsubscribeRoom = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    data.user = req.body.user;
    data.room = req.body.room;
    const teamService = new TeamService();
    const unsubscribeRoomResult = await teamService.unsubscribeRoom(data);
    console.log(unsubscribeRoomResult);
    if (unsubscribeRoomResult === 0) {
      res.send({ status_code: 200, message: 'User unsubscribed successfully' });
    } else {
      res.send({ status_code: 200, message: 'Unsubscribe failed' });
    }
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

teamHandler.getTeamInfo = async function (req: any, res: any, done: any) {
  try {
    const company_id = req.body.company_id;
    const team_id = req.body.team_id;
    const SIPID = req.body.sipid;
    const team = team_id.match(/\d+/g);
    const result = await userModel.getTeamInfo(company_id, team[0], SIPID);
    console.log(result);
    res.send({ status_code: 200, result: result });
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

// destroyRoom
teamHandler.destroyRoom = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    data.name = req.body.name;
    data.service = req.body.service;
    data.company_id = req.body.company_id;
    const team = data.name.match(/\d+/g);
    if (team !== null) {
      data.team = team[0];
      const resTeam = await userModel.deleteTeam(data);
      if (resTeam[0].errcode === 0) {
        const teamService = new TeamService();
        const destroyRoomResult = await teamService.destroyRoom(data);
        console.log(destroyRoomResult);
        if (destroyRoomResult === 0) {
          res.send({ status_code: 200, message: 'Team deleted successfully' });
        } else {
          res.send({ status_code: 200, message: 'Team delete failed' });
        }
      } else {
        res.send({ status_code: 404, message: 'Team not found' });
      }
    } else {
      res.send({ status_code: 404, message: 'Team not found' });
    }
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

// subscribeRoom
teamHandler.subscribeRoom = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    data.user = req.body.user;
    data.nick = req.body.nick;
    data.room = req.body.room;
    data.nodes = req.body.nodes;
    const teamService = new TeamService();
    const subscribeRoomResult = await teamService.subscribeRoom(data);
    console.log(subscribeRoomResult);
    res.send({ status_code: 200, result: subscribeRoomResult });
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

// getRoomAffiliations
teamHandler.getRoomAffiliations = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    data.name = req.body.name;
    data.service = req.body.service;
    const teamService = new TeamService();
    const getRoomAffiliationsResult = await teamService.getRoomAffiliations(data);
    console.log(getRoomAffiliationsResult);
    res.send({ status_code: 200, result: getRoomAffiliationsResult });
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

// setRoomAffiliation || leaveTeam
teamHandler.leaveTeam = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    data.name = req.body.name;
    data.resource_id = req.body.resource_id;
    data.service = req.body.service;
    data.jid = req.body.jid;
    data.affiliation = 'none';
    data.company_id = req.body.company_id;
    const teamMember = data.jid.split('@');
    data.SIPID = parseInt(teamMember[0], undefined);
    const messageService = new MessageService();
    const teamService = new TeamService();
    const record = await userModel.getUserById(teamMember[0]);
    if (record.length === 1) {
      /*const messageData: any = {};
      messageData.type = 'groupchat';
      messageData.from = data.jid;
      messageData.to = data.name + '@' + data.service;
      messageData.subject = '';
      messageData.body = record[0].caller_id + ' has left'; */

      //
      const stanzaData: any = {};
      stanzaData.from = `${data.jid}/${data.resource_id}`;
      stanzaData.to = `${data.name}@${data.service}`;
      stanzaData.name = data.name;
      stanzaData.body = record[0].caller_id + ' has left';
      stanzaData.stanza = `<message to='${stanzaData.to}' type='groupchat' from='${stanzaData.from}'><body> ${stanzaData.body} </body><markable xmlns='urn:xmpp:chat-markers:0'/><broadcast name='${record[0].caller_id}' jid='${data.jid}' created_by='${record[0].caller_id}' xmlns='urn:xmpp:message-correct:0'/><message-type  value='LEAVE' xmlns='urn:xmpp:message-correct:0'/><active xmlns='http://jabber.org/protocol/chatstates'/></message>`;

      //broadcastMessage(stanzaData);
      //
      const team = data.name.match(/\d+/g);
      if (team !== null) {
        data.team = team[0];
        const resTeam = await userModel.leaveTeam(data);
        if (resTeam[0].errcode !== -1) {
          // await messageService.sendMessage(messageData);
          await messageService.sendStanza(stanzaData);
          const setRoomAffiliationsResult = await teamService.setRoomAffiliation(data);
          if (setRoomAffiliationsResult === 0) {
            res.send({ status_code: 200, message: 'User left successfully' });
          } else {
            res.send({ status_code: 200, message: 'User left failed' });
          }
        } else {
          res.send({ status_code: 404, message: 'Team not found' });
        }
      } else {
        res.send({ status_code: 404, message: 'Team not found' });
      }
    } else {
      res.send({ status_code: 404, message: 'User not found' });
    }
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

// getRoomOptions
teamHandler.getRoomOptions = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    data.name = req.body.name;
    data.service = req.body.service;
    const teamService = new TeamService();
    const getRoomOptionsResult = await teamService.getRoomOptions(data);
    console.log(getRoomOptionsResult);
    res.send({ status_code: 200, result: getRoomOptionsResult });
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

// roleChange
teamHandler.roleChange = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    data.name = req.body.name;
    data.service = req.body.service;
    data.jid = req.body.jid;
    data.affiliation = req.body.role;
    const teamData: any = {};
    const team = data.name.match(/\d+/g);
    const teamMember = data.jid.split('@');
    teamData.team_id = team[0];
    teamData.SIPID = teamMember[0];
    teamData.make_admin = data.affiliation === 'member' ? 0 : 1;
    await userModel.roleChange(teamData);
    const teamService = new TeamService();
    const setRoomAffiliationsResult = await teamService.setRoomAffiliation(data);
    console.log(setRoomAffiliationsResult);
    if (setRoomAffiliationsResult === 0) {
      res.send({ status_code: 200, message: 'Role changed successfully' });
    } else {
      res.send({ status_code: 200, message: 'Role change failed' });
    }
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

// getUserRooms
teamHandler.getUserRooms = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    let userRooms: any = {};
    data.user = req.body.userId;
    data.host = config.ejabberdHost;
    const teamService = new TeamService();
    userRooms = await teamService.getUserRooms(data);
    /*for(let i=0; i < userRooms.length; i++){
      const data: any = {};
    data.name = req.body.name;
    data.service = req.body.service;
    }*/
    res.send({ status_code: 200, result: userRooms });
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

// add member
teamHandler.addMember = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    const memberData: any = {};
    const addMember: any = {};
    const teamData: any = {};
    data.company_id = req.body.company_id;
    data.name = req.body.name;
    data.resource_id = req.body.resource_id;
    data.service = req.body.service;
    data.fromJid = req.body.fromJid;
    data.toJid = req.body.toJid;
    const teamMemberFrom = data.fromJid.split('@');
    const recordFrom = await userModel.getUserById(teamMemberFrom[0]);

    if (recordFrom.length === 1) {
      const team = data.name.match(/\d+/g);
      const memberDataArr = data.toJid.split(',');

      let teamMemberTo = '';
      for (let i = 0; i < memberDataArr.length; i++) {
        teamMemberTo = memberDataArr[i].split('@');
        memberData.team_id = team[0];
        memberData.SIPID = teamMemberTo[0];
        memberData.processtype = 1;
        await userModel.addRemoveMember(memberData);
      }
      //if (addResult[0].errcode !== -1) {
      const teamService = new TeamService();
      addMember.name = req.body.name;
      addMember.service = req.body.service;
      //
      const members = data.toJid;
      const memberArr = members.split(',');
      const userIdArr = [];
      for (let i = 0; i < memberArr.length; i++) {
        addMember.jid = memberArr[i];
        addMember.affiliation = 'member';
        await teamService.setRoomAffiliation(addMember);
        userIdArr.push(addMember.jid);
      }
      //
      teamData.name = data.name;
      teamData.service = data.service;
      teamData.password = '';
      teamData.reason = data.name;
      teamData.users = userIdArr.join(':');
      const messageService = new MessageService();
      await messageService.sendDirectInvitation(teamData);

      /*const messageData: any = {};
      messageData.type = 'groupchat';
      messageData.from = data.fromJid;
      messageData.to = teamData.name + '@' + teamData.service;
      messageData.subject = ''; */
      const stanzaData: any = {};
      stanzaData.from = `${data.fromJid}/${data.resource_id}`;
      stanzaData.to = `${teamData.name}@${teamData.service}`;
      stanzaData.name = teamData.name;
      for (let i = 0; i < memberDataArr.length; i++) {
        teamMemberTo = memberDataArr[i].split('@');
        const recordTo = await userModel.getUserById(teamMemberTo[0]);
        stanzaData.body = recordFrom[0].caller_id + ' Added ' + recordTo[0].caller_id;
        stanzaData.stanza = `<message to='${stanzaData.to}' type='groupchat' from='${stanzaData.from}'><body> ${stanzaData.body} </body><markable xmlns='urn:xmpp:chat-markers:0'/><broadcast name='${recordTo[0].caller_id}' jid='${memberDataArr[i]}' created_by='${recordFrom[0].caller_id}' xmlns='urn:xmpp:message-correct:0'/><message-type  value='ADD' xmlns='urn:xmpp:message-correct:0'/><active xmlns='http://jabber.org/protocol/chatstates'/></message>`;
        console.log(stanzaData);
        await messageService.sendStanza(stanzaData);
        //broadcastMessage(stanzaData);
      }
      res.send({ status_code: 200, message: 'Member added successfully' });
      /*} else {
        res.send({ status_code: 404, message: addResult[0].errmsg });
      }*/
    } else {
      res.send({ status_code: 404, message: 'User not found' });
    }
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

// remove member
teamHandler.removeMember = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    const memberData: any = {};
    const removeMember: any = {};
    data.company_id = req.body.company_id;
    data.name = req.body.name;
    data.resource_id = req.body.resource_id;
    data.service = req.body.service;
    data.fromJid = req.body.fromJid;
    data.toJid = req.body.toJid;
    const teamMemberFrom = data.fromJid.split('@');
    const teamMemberTo = data.toJid.split('@');
    const recordFrom = await userModel.getUserById(teamMemberFrom[0]);
    const recordTo = await userModel.getUserById(teamMemberTo[0]);
    if (recordFrom.length === 1 && recordTo.length === 1) {
      const team = data.name.match(/\d+/g);
      memberData.team_id = team[0];
      memberData.SIPID = teamMemberTo[0];
      memberData.processtype = 2;
      const removeResult = await userModel.addRemoveMember(memberData);
      if (removeResult[0].errcode !== -1) {
        const messageService = new MessageService();
        /*const messageData: any = {};
        messageData.type = 'groupchat';
        messageData.from = data.fromJid;
        messageData.to = data.name + '@' + data.service;
        messageData.subject = '';
        messageData.body = recordFrom[0].caller_id + ' Removed ' + recordTo[0].caller_id;
        console.log(messageData);
        const l = await messageService.sendMessage(messageData);
        console.log(l); */
        //
        const stanzaData: any = {};
        stanzaData.from = `${data.fromJid}/${data.resource_id}`;
        stanzaData.to = `${data.name}@${data.service}`;
        stanzaData.name = data.name;
        stanzaData.body = recordFrom[0].caller_id + ' Removed ' + recordTo[0].caller_id;
        stanzaData.stanza = `<message to='${stanzaData.to}' type='groupchat' from='${stanzaData.from}'><body> ${stanzaData.body} </body><markable xmlns='urn:xmpp:chat-markers:0'/><broadcast name='${recordTo[0].caller_id}' jid='${data.toJid}' created_by='${recordFrom[0].caller_id}'  xmlns='urn:xmpp:message-correct:0'/><message-type  value='REMOVE' xmlns='urn:xmpp:message-correct:0'/><active xmlns='http://jabber.org/protocol/chatstates'/></message>`;
        console.log(stanzaData);
        await messageService.sendStanza(stanzaData);
        //broadcastMessage(stanzaData);
        //
        removeMember.name = req.body.name;
        removeMember.service = req.body.service;
        removeMember.jid = data.toJid;
        removeMember.affiliation = 'none';
        const teamService = new TeamService();
        const setRoomAffiliationsResult = await teamService.setRoomAffiliation(removeMember);
        res.send({ status_code: 200, message: 'Member removed successfully' });
      } else {
        res.send({ status_code: 404, message: removeResult[0].errmsg });
      }
    } else {
      res.send({ status_code: 404, message: 'User not found' });
    }
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

/**
 * Join public team
 *
 */
teamHandler.joinPublicTeam = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    const memberData: any = {};
    const addMember: any = {};
    const teamData: any = {};
    data.company_id = req.body.company_id;
    data.name = req.body.name;
    data.resource_id = req.body.resource_id;
    data.service = req.body.service;
    data.jid = req.body.jid;
    const team = data.name.match(/\d+/g);
    const teamMemberTo = data.jid.split('@');
    const recordTo = await userModel.getUserById(teamMemberTo[0]);
    if (recordTo.length === 1) {
      memberData.team_id = team[0];
      memberData.SIPID = teamMemberTo[0];
      memberData.processtype = 1;
      const addResult = await userModel.addRemoveMember(memberData);
      if (addResult[0].errcode !== -1) {
        // set Room Affiliation
        const teamService = new TeamService();
        addMember.name = req.body.name;
        addMember.service = req.body.service;
        addMember.jid = data.jid;
        addMember.affiliation = 'member';
        await teamService.setRoomAffiliation(addMember);
        //send Direct invitation
        teamData.name = data.name;
        teamData.service = data.service;
        teamData.password = '';
        teamData.reason = data.name;
        teamData.users = addMember.jid;
        const messageService = new MessageService();
        await messageService.sendDirectInvitation(teamData);

        const stanzaData: any = {};
        stanzaData.from = `${data.jid}/${data.resource_id}`;
        stanzaData.to = `${teamData.name}@${teamData.service}`;
        stanzaData.name = teamData.name;
        stanzaData.body = recordTo[0].caller_id + ' Joined ';
        stanzaData.stanza = `<message to='${stanzaData.to}' type='groupchat' from='${stanzaData.from}'><body> ${stanzaData.body} </body><markable xmlns='urn:xmpp:chat-markers:0'/><broadcast name='${recordTo[0].caller_id}' jid='${addMember.jid}' created_by='${recordTo[0].caller_id}' xmlns='urn:xmpp:message-correct:0'/><message-type  value='ADD' xmlns='urn:xmpp:message-correct:0'/><active xmlns='http://jabber.org/protocol/chatstates'/></message>`;
        console.log(stanzaData);
        await messageService.sendStanza(stanzaData);
        //broadcastMessage(stanzaData);
        res.send({ status_code: 200, message: 'Member added successfully' });
      } else {
        res.send({ status_code: 404, message: addResult[0].errmsg });
      }
    } else {
      res.send({ status_code: 404, message: 'User not found' });
    }
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

async function broadcastMessage(stanzaData: any) {
  const messageService = new MessageService();
  stanzaData.stanza = `<message to='${stanzaData.to}' type='groupchat' from='${stanzaData.from}'><body> ${stanzaData.body} </body><markable xmlns='urn:xmpp:chat-markers:0'/><broadcast name='${stanzaData.name}' xmlns='urn:xmpp:message-correct:0'/><message-type  value='BROADCAST' xmlns='urn:xmpp:message-correct:0'/><active xmlns='http://jabber.org/protocol/chatstates'/></message>`;
  console.log(stanzaData);
  await messageService.sendStanza(stanzaData);
  return 1;
}

export const teamHandlers: any = teamHandler;
