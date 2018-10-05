'use strict'

const Schema = use('Schema')

class CategorySchema extends Schema {
  up () {
    this.createIfNotExists('categories', (table) => {
      table.increments()
      table.string('name', 50).notNullable()
      table.text('description').notNullable()
    })
  }

  down () {
    this.drop('categories')
  }
}

module.exports = CategorySchema
