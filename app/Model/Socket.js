'use strict'

const Socket = module.exports = exports = {}

Socket.EVENTS = {
  JOIN_ROOM: 'thread:join',
  LEAVE_ROOM: 'thread:leave',
  MESSAGE: 'message',
  NOTIFICATION: 'notification',
  TYPING: 'typing',
  MANAGER_READ: 'manager:read',
  STAFF_READ: 'staff:read',
  STAFF_REPLY: 'staff:reply'
}
