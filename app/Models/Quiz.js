'use strict'

const Base = use('App/Model/Base')

class Quiz extends Base {

  static get table () {
    return 'quizzes'
  }
}

module.exports = Quiz
