'use strict'

const coFs = require('co-functional')
const Auth = require('adonis-auth/middleware/Auth')
const Credential = use('App/Model/Credential')
const JwtTokenService = make('App/Services/JwtToken')
const ApplicationException = use('App/Exceptions/Application')

class JwtAuth {
  async handle ({ request }, next) {
    // call next to advance the request
    await next()
  }
}

module.exports = JwtAuth
