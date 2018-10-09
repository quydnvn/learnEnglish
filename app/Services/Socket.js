'use strict'

const Antl = use('Antl')
const Exceptions = use('App/Exceptions')

const Socket = use('App/Model/Socket')
const ProducerService = use('App/Services/Producer')

const SocketService = module.exports = exports = {}

SocketService.getRoomId = function (roomName) {
  try {
    return parseInt(roomName.match(Socket.ROOM_PATTERN)[1])
  } catch (e) {
    throw new Exceptions.ApplicationException(
      Antl.formatMessage('common.errors.not_found', { name: Antl.get('common.room') }),
      404
    )
  }
}

SocketService.emitToRoom = function (payload) {
  ProducerService.publishMessage(payload)
}
