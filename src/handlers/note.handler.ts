/**
 * @createdBy Kamal
 * @createdOn 05th May 2020
 */

import { noteModel } from '../models/note.model';
import MessageService from '../services/message.service';
import { userModel } from '../models/user';
const noteHandler: any = {};

/**
 *
 * @param {Object} req - request object
 * @param {Object} reply - response object
 * @description - create note function
 */
noteHandler.createNote = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    data.description = req.body.description;
    data.summary = req.body.summary;
    data.uid = req.body.uid;
    data.dtstart = req.body.dtstart;
    data.sender = req.body.sender;
    data.msgid = req.body.msgid;
    data.receiver = req.body.receiver;
    data.conv_id = req.body.conv_id;
    data.group_id = req.body.group_id;
    data.owner_id = req.body.owner_id;
    data.company_id = req.body.company_id;
    data.thread_id = req.body.thread_id;
    data.event_id = req.body.event_id;
    data.sip_id = req.body.sip_id;
    const chatType = data.group_id ? 'groupchat' : 'chat';

    const noteCollection = await this.mongo.MONGO1.db.collection('Note');
    const result = await noteModel.getNoteByUid(data.uid, noteCollection);
    if (result === null) {
      const body = JSON.stringify(data);
      const messageService = new MessageService();
      let sendMessageResult;
      const msgdata: any = {};
      if (chatType === 'groupchat') {
        //save group members
        const team = data.group_id.match(/\d+/g);
        const getTeamResult = await userModel.getTeamInfo(data.company_id, team[0], data.sip_id);
        const teamMember = getTeamResult[0].team_members;
        const teamMembers = teamMember.split(',');
        for (let i = 0; i < teamMembers.length; i++) {
          data.sip_id = teamMembers[i].trim();
          delete data._id;
          await noteModel.createNote(data, noteCollection);
        }
        //save group members
        const stanzaData: any = {};
        stanzaData.from = data.owner_id;
        stanzaData.to = data.receiver;
        stanzaData.stanza = `<message type='${chatType}' id='${data.msgid}' from='${data.owner_id}' to='${data.receiver}'><body>${body}</body><markable xmlns="urn:xmpp:chat-markers:0"/><origin-id id='${data.msgid}' xmlns="urn:xmpp:sid:0"/><message-type value="NOTE" xmlns="urn:xmpp:message-correct:0"/><thread parent="">${data.thread_id}</thread><active xmlns="http://jabber.org/protocol/chatstates"/></message>`;
        sendMessageResult = await messageService.sendStanza(stanzaData);
      } else {
        await noteModel.createNote(data, noteCollection);
        msgdata.type = chatType;
        msgdata.from = data.owner_id;
        msgdata.to = data.receiver;
        msgdata.subject = 'NOTE';
        msgdata.body = body;
        sendMessageResult = await messageService.sendMessage(msgdata);
      }
      console.log(sendMessageResult);
      if (sendMessageResult === 0) {
        res.send({ status_code: 200, message: 'Note sent successfully' });
      } else {
        res.send({ status_code: 200, message: 'Note sent failed' });
      }
    } else {
      res.send({ status_code: 200, message: `Note uid: [${data.uid}] Already exists !` });
    }
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

/**
 *
 * @param {Object} req - request object
 * @param {Object} reply - response object
 * @description - update note function
 */
noteHandler.updateNote = async function (req: any, res: any, done: any) {
  try {
    const uid = req.params.uid;
    const data: any = {};
    data.uid = uid;
    data.description = req.body.description;
    data.summary = req.body.summary;
    data.dtdtart = req.body.dtstart;
    data.sender = req.body.sender;
    data.msgid = req.body.msgid;
    data.receiver = req.body.receiver;
    data.conv_id = req.body.conv_id;
    data.group_id = req.body.group_id;
    data.owner_id = req.body.owner_id;
    data.company_id = req.body.company_id;
    data.thread_id = req.body.thread_id;
    data.event_id = req.body.event_id;
    // data.sip_id = req.body.sip_id;
    const chatType = data.group_id ? 'groupchat' : 'chat';
    const noteCollection = await this.mongo.MONGO1.db.collection('Note');
    const result = await noteModel.getNoteByUid(uid, noteCollection);
    if (result !== null) {
      await noteModel.updateNote(uid, data, noteCollection);
      const body = JSON.stringify(data);
      data.replace_id = result.msgid;
      const messageService = new MessageService();
      let sendMessageResult;
      const msgdata: any = {};
      if (chatType === 'groupchat') {
        const stanzaData: any = {};
        stanzaData.from = data.owner_id;
        stanzaData.to = data.receiver;
        stanzaData.stanza = `<message type='${chatType}' id='${data.msgid}' from='${data.owner_id}' to='${data.receiver}'><body>${body}</body><markable xmlns="urn:xmpp:chat-markers:0"/><origin-id id='${data.msgid}' xmlns="urn:xmpp:sid:0"/><replace id="${result.msgid}" xmlns="urn:xmpp:message-correct:0"/><message-type value="NOTE" xmlns="urn:xmpp:message-correct:0"/><thread parent="">${data.thread_id}</thread><active xmlns="http://jabber.org/protocol/chatstates"/></message>`;
        console.log(stanzaData);
        sendMessageResult = await messageService.sendStanza(stanzaData);
      } else {
        msgdata.type = chatType;
        msgdata.from = data.owner_id;
        msgdata.to = data.receiver;
        msgdata.subject = 'NOTE';
        msgdata.body = body;
        console.log(msgdata);
        sendMessageResult = await messageService.sendMessage(msgdata);
      }
      if (sendMessageResult === 0) {
        res.send({ status_code: 200, message: 'Note sent successfully' });
      } else {
        res.send({ status_code: 200, message: 'Note sent failed' });
      }
    } else {
      res.send({ status_code: 200, message: `Note uid: [${uid}] not found !` });
    }
    //
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

/**
 *
 * @param {Object} req - request object
 * @param {Object} reply - response object
 * @description - delete note function
 */
noteHandler.deleteNote = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    //
    const uid = req.body.uid;
    data.owner_id = req.body.owner_id;
    data.sender = req.body.sender;
    data.group_id = req.body.group_id;
    data.receiver = req.body.receiver;
    data.msgid = req.body.msgid;
    data.thread_id = req.body.thread_id;
    data.event_id = req.body.event_id;
    data.sip_id = req.body.sip_id;
    const chatType = data.group_id ? 'groupchat' : 'chat';
    const noteCollection = await this.mongo.MONGO1.db.collection('Note');
    const result = await noteModel.getNoteByUid(uid, noteCollection);
    if (result !== null) {
      const deleteRes = await noteModel.deleteNote(uid, noteCollection);
      const messageService = new MessageService();
      let sendMessageResult;
      const msgdata: any = {};
      if (chatType === 'groupchat') {
        const stanzaData: any = {};
        stanzaData.from = data.owner_id;
        stanzaData.to = data.receiver;
        stanzaData.stanza = `<message type='${chatType}' id='${data.msgid}' from='${data.owner_id}' to='${data.receiver}'><body>The Message has been deleted</body><markable xmlns="urn:xmpp:chat-markers:0"/><origin-id id='${data.msgid}' xmlns="urn:xmpp:sid:0"/><replace id="${result.msgid}" xmlns="urn:xmpp:message-correct:0"/><deleted id="${result.msgid}" xmlns="urn:xmpp:message-correct:0"/><message-type value="NOTE" xmlns="urn:xmpp:message-correct:0"/><thread parent="">${data.thread_id}</thread><active xmlns="http://jabber.org/protocol/chatstates"/></message>`;
        console.log(stanzaData);
        sendMessageResult = await messageService.sendStanza(stanzaData);
      } else {
        const body = JSON.stringify({
          isDeleted: true,
          msg: 'The Message has been deleted',
          uid: uid,
          deletedId: result.msgid,
        });
        msgdata.type = chatType;
        msgdata.from = data.owner_id;
        msgdata.to = data.receiver;
        msgdata.subject = 'NOTE';
        msgdata.body = body;
        console.log(msgdata);
        sendMessageResult = await messageService.sendMessage(msgdata);
      }
      if (deleteRes.deletedCount > 0) {
        res.send({ status_code: 200, message: 'Note deleted successfully' });
      } else {
        res.send({ status_code: 200, message: 'Note delete failed' });
      }
    } else {
      res.send({ status_code: 200, message: `Note uid: [${uid}] not found !` });
    }
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};

//getNote
noteHandler.getNote = async function (req: any, res: any, done: any) {
  try {
    const data: any = {};
    data.sip_id = req.params.sip_id;
    const noteCollection = await this.mongo.MONGO1.db.collection('Note');
    const result = await noteModel.getNote(data, noteCollection);
    res.send({ status_code: 200, result: result });
  } catch (err) {
    console.log(err);
    res.send({ status_code: 500, message: 'internal server error' });
  }
};
export const noteHandlers: any = noteHandler;
