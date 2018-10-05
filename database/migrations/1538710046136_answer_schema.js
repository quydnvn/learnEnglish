'use strict'

const Schema = use('Schema')

class AnswerSchema extends Schema {
  up () {
    this.create('answers', (table) => {
      table.increments()
      table.integer('question_num').notNullable()
      table.integer('quiz_id').notNullable()
      table.string('text').notNullable()
      table.integer('correct').notNullable().defaultTo(0)
    })
  }

  down () {
    this.drop('answers')
  }
}

module.exports = AnswerSchema
