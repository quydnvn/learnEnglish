'use strict'

const Base = use('App/Model/Base')

class Question extends Base {

  static get table () {
    return 'questions'
  }
}

module.exports = Question
