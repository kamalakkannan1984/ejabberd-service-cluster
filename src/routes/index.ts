/**
 * @createdBy kamal
 * @createdOn 05th Mar 2020
 */

import { userSchema } from '../schema/user.schema';
import { healthSchema } from '../schema/health.schema';
import { teamSchema } from '../schema/team.schema';
import { messageSchema } from '../schema/message.schema';

import { eventSchema } from '../schema/event.schema';
import { tasksSchema } from '../schema/tasks.schema';
import { noteSchema } from '../schema/note.schema';

import { callHistorySchema } from '../schema/callHistory.schema';

import { userHandlers } from '../handlers/user.handler';
import { healthHandlers } from '../handlers/health.handler';
import { teamHandlers } from '../handlers/team.handler';
import { messageHandlers } from '../handlers/message.handler';

import { eventHandlers } from '../handlers/event.handler';
import { tasksHandlers } from '../handlers/tasks.handler';
import { noteHandlers } from '../handlers/note.handler';

import { callHistoryHandlers } from '../handlers/callHistory.handler';

import { ejabberdConfigHandlers } from '../handlers/ejabbredConfig.handler';
import { ejabbredConfigSchema } from '../schema/ejabbredConfig.schema';

import { chatHistoryHandlers } from '../handlers/chatHistory.handler';
import { chatHistorySchema } from '../schema/chatHistory.schema';

const AUTH = 'validateSession';

/**
 * @param {Object} fastify - fastify
 */
export const configureRoutes = (fastify: any, options: any, done: any) => {
  fastify.post(
    '/api/login',
    {
      schema: {
        description: 'Login api',
        tags: ['user'],
        body: userSchema.loginReq.body,
        response: userSchema.loginRes,
      },
    },
    userHandlers.login,
  );

  fastify.get(
    '/api/status',
    {
      //preValidation: [fastify.validateSession],
      schema: {
        description: 'Status api',
        tags: ['health'],
        response: healthSchema.statusRes,
      },
    },
    healthHandlers.getStatus,
  );

  fastify.get(
    '/api/registered_users',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Get registered users api',
        tags: ['user'],
        // body: userSchema.registeredUsersReq.body,
        response: userSchema.registeredUsersRes,
      },
    },
    userHandlers.getRegisteredUsers,
  );

  fastify.post(
    '/api/get_presence',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Get presence status api',
        tags: ['user'],
        body: userSchema.getPresenceReq.body,
        response: userSchema.getPresenceRes,
      },
    },
    userHandlers.getPresence,
  );

  fastify.get(
    '/api/connected_users',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Get connected users api',
        tags: ['user'],
        response: userSchema.connectedUsersRes,
      },
    },
    userHandlers.getConnectedUsers,
  );

  fastify.get(
    '/api/connected_users_number',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Get connected users number api',
        tags: ['user'],
        response: userSchema.connectedUsersNumberRes,
      },
    },
    userHandlers.getConnectedUsersNumber,
  );

  fastify.post(
    '/api/register',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Register api',
        tags: ['user'],
        body: userSchema.registerReq.body,
        response: userSchema.registerRes,
      },
    },
    userHandlers.register,
  );

  fastify.post(
    '/api/create_team',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Create team api',
        tags: ['team'],
        body: teamSchema.createTeamReq.body,
        // response: userSchema.createTeamRes
      },
    },
    teamHandlers.createTeam,
  );

  fastify.put(
    '/api/update_team/:team_id',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Update team api',
        tags: ['team'],
        params: teamSchema.updateTeamReq.params,
        body: teamSchema.updateTeamReq.body,
        // response: userSchema.createTeamRes
      },
    },
    teamHandlers.updateTeam,
  );

  fastify.post(
    '/api/create_room_with_opts',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Create team with options api',
        tags: ['team'],
        body: teamSchema.createTeamWithOptsReq.body,
        // response: userSchema.createTeamRes
      },
    },
    teamHandlers.createTeamWithOpts,
  );

  fastify.post(
    '/api/unsubscribe_room',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Unsubscribe room or team api',
        tags: ['team'],
        body: teamSchema.unsubscribeRoomReq.body,
        // response: userSchema.createTeamRes
      },
    },
    teamHandlers.unsubscribeRoom,
  );

  fastify.post(
    '/api/get_team_info',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Get team info api',
        tags: ['team'],
        body: teamSchema.getTeamInfo.body,
        // response: userSchema.createTeamRes
      },
    },
    teamHandlers.getTeamInfo,
  );

  fastify.post(
    '/api/send_message',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Send message api',
        tags: ['message'],
        body: messageSchema.sendMessage.body,
        // response: userSchema.createTeamRes
      },
    },
    messageHandlers.sendMessage,
  );

  fastify.post(
    '/api/send_stanza',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Send stanza api',
        tags: ['message'],
        body: messageSchema.sendStanza.body,
        // response: userSchema.createTeamRes
      },
    },
    messageHandlers.sendStanza,
  );

  fastify.post('/api/get_room_options', teamHandlers.getRoomOptions);
  fastify.post('/api/get_room_affiliations', teamHandlers.getRoomAffiliations);

  fastify.post(
    '/api/delete_team',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Delete team or destroy room api',
        tags: ['team'],
        body: teamSchema.destroyRoom.body,
        // response: userSchema.createTeamRes
      },
    },
    teamHandlers.destroyRoom,
  );

  fastify.post(
    '/api/leave_team',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Leave team api',
        tags: ['team'],
        body: teamSchema.leaveTeam.body,
        // response: userSchema.createTeamRes
      },
    },
    teamHandlers.leaveTeam,
  );

  fastify.post(
    '/api/role_change',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Team role change api',
        tags: ['team'],
        body: teamSchema.roleChange.body,
        // response: userSchema.createTeamRes
      },
    },
    teamHandlers.roleChange,
  );

  fastify.post(
    '/api/get_user_rooms',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Get user rooms details api',
        tags: ['team'],
        body: teamSchema.getUserRooms.body,
        // response: userSchema.createTeamRes
      },
    },
    teamHandlers.getUserRooms,
  );

  fastify.post(
    '/api/change_password',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Change password api',
        tags: ['user'],
        body: userSchema.changePassword.body,
        // response: userSchema.createTeamRes
      },
    },
    userHandlers.changePassword,
  );

  fastify.post(
    '/api/user_sessions_info',
    {
      //preValidation: [fastify.validateSession],
      schema: {
        description: 'Get user session or presence information api',
        tags: ['user'],
        body: userSchema.userSessionInfo.body,
        // response: userSchema.createTeamRes
      },
    },
    userHandlers.userSessionInfo,
  );

  fastify.post(
    '/api/event',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Create event api',
        tags: ['event'],
        body: eventSchema.createEvent.body,
        // response: userSchema.createTeamRes
      },
    },
    eventHandlers.createEvent,
  );

  fastify.get(
    '/api/event/:sip_id',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Get event api',
        tags: ['event'],
        params: eventSchema.getEvent.params,
        // response: userSchema.createTeamRes
      },
    },
    eventHandlers.getEvent,
  );

  fastify.put(
    '/api/event/:uid',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Update event api',
        tags: ['event'],
        params: eventSchema.updateEvent.params,
        body: eventSchema.updateEvent.body,
        // response: userSchema.createTeamRes
      },
    },
    eventHandlers.updateEvent,
  );

  fastify.post(
    '/api/delete_event',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Delete event api',
        tags: ['event'],
        body: eventSchema.deleteEvent.body,
        // response: userSchema.createTeamRes
      },
    },
    eventHandlers.deleteEvent,
  );

  fastify.post(
    '/api/tasks',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Create tasks api',
        tags: ['tasks'],
        body: tasksSchema.createTasks.body,
        // response: userSchema.createTeamRes
      },
    },
    tasksHandlers.createTasks,
  );

  fastify.get(
    '/api/tasks/:sip_id',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Get tasks api',
        tags: ['tasks'],
        params: tasksSchema.getTasks.params,
        // response: userSchema.createTeamRes
      },
    },
    tasksHandlers.getTasks,
  );

  fastify.put(
    '/api/tasks/:uid',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Update tasks api',
        tags: ['tasks'],
        params: tasksSchema.updateTasks.params,
        body: tasksSchema.updateTasks.body,
        // response: userSchema.createTeamRes
      },
    },
    tasksHandlers.updateTasks,
  );

  fastify.post(
    '/api/delete_tasks',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Delete tasks api',
        tags: ['tasks'],
        body: tasksSchema.deleteTasks.body,
        // response: userSchema.createTeamRes
      },
    },
    tasksHandlers.deleteTasks,
  );

  fastify.post(
    '/api/note',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Create note api',
        tags: ['note'],
        body: noteSchema.createNote.body,
        // response: userSchema.createTeamRes
      },
    },
    noteHandlers.createNote,
  );

  fastify.get(
    '/api/note/:sip_id',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Get note api',
        tags: ['note'],
        params: noteSchema.getNote.params,
        // response: userSchema.createTeamRes
      },
    },
    noteHandlers.getNote,
  );

  fastify.put(
    '/api/note/:uid',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Update note api',
        tags: ['note'],
        params: noteSchema.updateNote.params,
        body: noteSchema.updateNote.body,
        // response: userSchema.createTeamRes
      },
    },
    noteHandlers.updateNote,
  );

  fastify.post(
    '/api/delete_note',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Delete note api',
        tags: ['note'],
        body: noteSchema.deleteNote.body,
        // response: userSchema.createTeamRes
      },
    },
    noteHandlers.deleteNote,
  );

  fastify.post(
    '/api/delete_old_messages',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Delete offline messages older than DAYS',
        tags: ['message'],
        //params: noteSchema.deleteNote.params,
        // response: userSchema.createTeamRes
      },
    },
    messageHandlers.deleteOldMessage,
  );

  fastify.post(
    '/api/delete_old_mam_messages',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Delete MAM messages older than DAYS',
        tags: ['message'],
        //params: noteSchema.deleteNote.params,
        // response: userSchema.createTeamRes
      },
    },
    messageHandlers.deleteOldMamMessage,
  );

  fastify.get(
    '/api/delete_expired_messages',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Delete expired offline messages from database',
        tags: ['message'],
        //params: noteSchema.deleteNote.params,
        // response: userSchema.createTeamRes
      },
    },
    messageHandlers.deleteExpiredMessage,
  );

  fastify.get(
    '/api/clear_cache',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Clear database cache on all nodes',
        tags: ['message'],
        //params: noteSchema.deleteNote.params,
        // response: userSchema.createTeamRes
      },
    },
    messageHandlers.clearCache,
  );

  //add member
  fastify.post(
    '/api/add_member',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Add member Api',
        tags: ['team'],
        body: teamSchema.addMember.body,
        // response: userSchema.createTeamRes
      },
    },
    teamHandlers.addMember,
  );

  // remove member
  fastify.post(
    '/api/remove_member',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'remove member Api',
        tags: ['team'],
        body: teamSchema.removeMember.body,
        // response: userSchema.createTeamRes
      },
    },
    teamHandlers.removeMember,
  );

  fastify.post(
    '/api/send_stanza_c2s',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'send_stanza_c2s Api',
        tags: ['message'],
        body: messageSchema.sendStanzaC2s.body,
        // response: userSchema.createTeamRes
      },
    },
    messageHandlers.sendStanzaC2s,
  );

  //start Call histroy routes
  fastify.post(
    '/api/call_history',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'save call history Api',
        tags: ['call'],
        body: callHistorySchema.saveCallHistory.body,
        // response: userSchema.createTeamRes
      },
    },
    callHistoryHandlers.saveCallHistory,
  );

  fastify.put(
    '/api/call_history/:uuid',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'update call history Api',
        tags: ['call'],
        params: callHistorySchema.updateCallHistory.params,
        body: callHistorySchema.updateCallHistory.body,
        // response: userSchema.createTeamRes
      },
    },
    callHistoryHandlers.updateCallHistory,
  );

  fastify.get(
    '/api/call_history/:ext',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Get by caller Api',
        tags: ['call'],
        //body: callHistorySchema.updateCallHistroy.body,
        params: callHistorySchema.getCallHistory.params,
        // response: userSchema.createTeamRes
      },
    },
    callHistoryHandlers.getCallHistory,
  );

  fastify.post(
    '/api/delete_call_history',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Call history delete by uuid Api',
        tags: ['call'],
        body: callHistorySchema.deleteCallHistory.body,
        //params: callHistorySchema.deleteCallHistory.params,
        // response: userSchema.createTeamRes
      },
    },
    callHistoryHandlers.deleteCallHistory,
  );

  //end Call histroy routes
  fastify.post(
    '/api/vhost',
    {
      //preValidation: [fastify.validateSession],
      schema: {
        description: ' Virtual host add Api',
        tags: ['host'],
        body: ejabbredConfigSchema.addVhost.body,
        // response: userSchema.createTeamRes
      },
    },
    ejabberdConfigHandlers.addVhost,
  );

  fastify.delete(
    '/api/vhost/:vhost',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Virtual host delete Api',
        tags: ['host'],
        params: ejabbredConfigSchema.deleteVhost.params,
        // response: userSchema.createTeamRes
      },
    },
    ejabberdConfigHandlers.deleteVhost,
  );

  fastify.put(
    '/api/vhost/:vhost',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Virtual host update Api',
        tags: ['host'],
        params: ejabbredConfigSchema.updateVhost.params,
        body: ejabbredConfigSchema.updateVhost.body,
        // response: userSchema.createTeamRes
      },
    },
    ejabberdConfigHandlers.updateVhost,
  );

  fastify.get(
    '/api/vhost',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Virtual host update Api',
        tags: ['host'],
        //params: ejabbredConfigSchema.updateVhost.params,
        //body: ejabbredConfigSchema.updateVhost.body,
        response: ejabbredConfigSchema.getRes,
      },
    },
    ejabberdConfigHandlers.getVhost,
  );

  /**
   * Ejabberd chat back up history / recent message
   */
  fastify.post(
    '/api/get_last_messages_paginated',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'Get last message with paginated',
        tags: ['chat'],
        body: chatHistorySchema.getLastMessages.body,
        // response: userSchema.createTeamRes
      },
    },
    chatHistoryHandlers.getLastMessages,
  );

  /**
   * join public team member
   */
  fastify.post(
    '/api/join_public_team',
    {
      preValidation: [fastify.validateSession],
      schema: {
        description: 'join public member Api',
        tags: ['team'],
        body: teamSchema.publicMember.body,
        // response: userSchema.createTeamRes
      },
    },
    teamHandlers.joinPublicTeam,
  );

  done();
};
