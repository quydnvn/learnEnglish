'use strict'

const Schema = use('Schema')

class QuizUsersSchema extends Schema {
  up () {
    this.create('quiz_users', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('quiz_users')
  }
}

module.exports = QuizUsersSchema
