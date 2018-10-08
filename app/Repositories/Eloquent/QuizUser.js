'use strict'

const co = use('co')
const _ = use('lodash')
const moment = use('moment')
const Database = use('Database')
const QuizUser = use('App/Model/QuizUsers')

const BaseRepository = use('App/BaseRepositories/Eloquent/Base')

class QuizUserRepository extends BaseRepository {

  constructor() {
    super()

    this.model = QuizUser
  }
}

module.exports = QuizUserRepository
