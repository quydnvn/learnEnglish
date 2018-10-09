'use strict'
const co = use('co')
const _ = use('lodash')
const Database = use('Database')
const Quiz = use('App/Model/Quiz')
const Answer = use('App/Model/Answer')
const Question = use('App/Model/Question')
const LeaderBoardRepository = make('App/Repositories/Eloquent/LeaderBoard')

class QuizRepository extends BaseRepository {
  constructor() {

    super()
    this.model = Quiz
    this.answer = Answer
    this.question = Question
    this._id = null
    this._name = null
    this._category = null
    this._active = null
    this._answers = []
    this._questions = []
    this._question = null
    this._users = null
    this._leaderboard = null
    this.leaderboard = LeaderBoardRepository

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

  async getId() {
    return this._id
  }

  async getName() {
    return this._name
  }

  async getDescription() {
    return this._description
  }

  async isActive() {
    return this._active == 1 ? true : false
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

    return answers
  }

  async updateAnswers(answers, questionid) {

    await this.deleteAnswers(questionid)
    await this.addAnswers(questionid, answers)

    return true
  }

  async deleteAnswers(questionid) {
    const deleteAnswers = await co(this.answer.query()
                                  .where('quiz_id', this._id)
                                  .where('question_num', questionid)
                                  .delete())
    return deleteAnswers
  }

  async addAnswers(questionid, answers) {
  }

 async addQuestion(question, answwers) {
  const max = await co(this.question.query()
                           .where('quiz_id', this._id)
                           .max('num'))
  const num  = max + 1
  // insert new question
  const newquestion = this.question.newInstance()
  newquestion.num = num
  newquestion.quiz_id = this._id
  newquestion.text = question

  await super.store(newquestion)

  await this.addAnswers(num, answers)

  return true
 }

 async updateQuestion(questionid, text) {
  const q = await co(this.question.query()
                      .where('quiz_id', this._id)
                      .where('num', questionid)
                      .first())
  q.text = text
  return await super.update(q)
 }

 async deleteQuestion(questionid) {
  //foreign_key constraints take care of deleting related answers
  const q = await co(this.question.query()
                         .where('quiz_id', this._id)
                         .where('num', questionid)
                         .delete())
  //reorder the num column in question table
  //foregin_key constraints take care of updating related answers
  const toupdate = await co(this.question.query()
                            .where('quiz_id', this._id)
                            .where('num', '>', questionid)
                            .fetch())

  toupdate.value().forEach((item, index) => {
    item.num = item.num - 1
  })

  return await super.update(toupdate)
 }

 async getQuestion(questionid) {
  const q = await co(this.question.query()
                      .select('text')
                      .where('num', questionid)
                      .where('quiz_id', this._id)
                      .first())

  this._question = q.text
  return this._question
 }

 async getQuestions() {
  return this._questions
 }

 async getCategory() {
  return this._category
 }

 async populateQuestions() {
  const questions = await co(this.question.query()
                                .where('quiz_id', this._id)
                                .orderBy('num', 'asc')
                                .fetch())
  questions.value().forEach((item, index) => {
    this._questions[item.num] = item.text
  })
 }

 async populateUsers() {
   this._users = await this.leaderboard.getMembers(this._id)
   return this._users
 }

 async getUsers() {
  return this._users
 }

 async getLeaders(num) {
  return await this.leaderboard.getMembers(this._id, num)
 }

 async registerUser(username) {
  // assuming no auth require

 }

 async addQuizTaker(user, score, start, end, timetaken) {
    return await this.leaderboard.addMember(this._id, user, score, start, end, timetaken)
 }
}

module.exports = QuizRepository

