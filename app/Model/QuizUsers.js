'use strict'

const Base = use('App/Model/Base')

class QuizUsers extends Base {

  static get table () {
    return 'quiz_users'
  }
}

module.exports = QuizUsers
