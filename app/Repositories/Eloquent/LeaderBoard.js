'use strict'
const co = use('co')
const _ = use('lodash')
const User = use('App/Model/User')
const QuizUser = use('App/Model/QuizUsers')

class LeaderBoardRepository extends BaseRepository {

  constructor() {

    super()
    this.model = User
    this.quizuser = QuizUser
  }

  async getMembers(quizid, number = false) {
    const members = await co(this.model.query()
                              .leftOuterJoin('quiz_users', 'quiz_users.user_id', 'users.id')
                              .where('quiz_users.quiz_id', quizid)
                              .orderBy('quiz_users.score', 'desc')
                              .fetch())
  }

  async addMember(quizid, user, score, start, end, timetaken) {
    const userExists = await this.findByOrFail('name', user)
    const userid = null

    if(!userExists) {
      const instance = this.model.newInstance()
            instance.name = user
      const newuser = await super.store(instance)
      userid = newuser.id
    } else {
      userid = userExists.id
    }

    const quizuser = this.quizuser.newInstance()
    quizuser.quiz_id = quizid
    quizuser.user_id = userid
    quizuser.score = score
    quizuser.start_time = start
    quizuser.date_submitted = end
    quizuser.time_taken = timetaken

    await super.store(quizuser)

    return true
  }
}


module.exports = LeaderBoardRepository

