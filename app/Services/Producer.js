'use strict'

const Redis = use('Redis')

const CatLog = require('cat-log')
const Logger = new CatLog('producer')

const ProducerService = module.exports = exports = {}

ProducerService.publish = function (channel, data) {
  const message = typeof data === 'string' ? data : JSON.stringify(data)
  Logger.info('publish:', channel, message)
  Redis.publish(channel, message)
}

ProducerService.publishMessage = function (data) {
  return this.publish('chat', data)
}

ProducerService.publishNotification = function (data) {
  return this.publish('notification', data)
}

ProducerService.publishGuest = function (data) {
  return this.publish('guest', data)
}
