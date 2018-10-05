'use strict'

const Schema = use('Schema')

class CredentialSchema extends Schema {
  up () {
    this.create('credentials', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('credentials')
  }
}

module.exports = CredentialSchema
