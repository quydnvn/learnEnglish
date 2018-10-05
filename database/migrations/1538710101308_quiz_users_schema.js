'use strict'

const Schema = use('Schema')

class QuizUsersSchema extends Schema {
  up () {
    this.create('quiz_users', (table) => {
      table.increments()
      table.integer('quiz_id').references('quizzes.id')
      table.integer('user_id').references('users.id')
      table.integer('score').notNullable()
      table.bigInteger('start_time').notNullable()
      table.bigInteger('date_submitted').notNullable()
      table.string('time_taken', 10).notNullable()
    })
  }

  down () {
    this.drop('quiz_users')
  }
}

module.exports = QuizUsersSchema
