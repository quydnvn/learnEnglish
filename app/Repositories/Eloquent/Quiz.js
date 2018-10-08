'use strict'
const co = use('co')
const _ = use('lodash')
const Database = use('Database')
const Quiz = use('App/Model/Quiz')
const Answer = use('App/Model/Answer')
const LeaderBoardRepository = make('App/Repositories/Eloquent/LeaderBoard')

class QuizRepository extends BaseRepository {
  constructor() {

    super()
    this.model = Quiz
    this.answer = Answer
    this.leaderboard = LeaderBoardRepository
    this._id = null
    this._name = null
    this._category = null
    this._active = null
  }

  async setId(id) {
    const quizobj = await co(this.model.query()
                              .innerJoin('categories', 'quizzes.category', 'categories.id')
                              .where('id', id)
                              .first())
    if (quizobj) {
      this._id = id;
      this._name = quizobj.name;
      this._description = quizobj.description;
      this._category = quizobj.category;
      this._active = quizobj.active;

      return true;
    }
    return false;
  }

  async getAnswers(questionid = false) {
    const answers = []
    const obj = null
    if(questionid) {
      //pull answers from db for only this question ordered by correct answer first
      obj = await co(this.answer.query()
                            .where('question_num', questionid)
                            .where('quiz_id', this._id)
                            .orderBy('correct', 'desc')
                            .fetch())
      foreach(obj in answer) {
        answers.push(answer.text)
      }

    } else {
      // put all answers from db grouped by question

    }
  }

}

module.exports = QuizRepository

