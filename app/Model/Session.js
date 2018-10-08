'use strict'

const Base = use('App/Model/Base')

class Session extends Base {

  static get table () {
    return 'sessions'
  }
}

module.exports = Session
