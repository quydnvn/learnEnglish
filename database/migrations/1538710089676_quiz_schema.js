'use strict'

const Schema = use('Schema')

class QuizSchema extends Schema {
  up () {
    this.create('quizzes', (table) => {
      table.increments()
      table.string('name', 50).notNullable()
      table.string('description', 255).notNullable()
      table.integer('category').notNullable()
      table.integer('active').notNullable().defaultTo(1)
      table.bigInteger('created').notNullable()
      table.bigInteger('updated').notNullable()
    })
  }

  down () {
    this.drop('quizzes')
  }
}

module.exports = QuizSchema
