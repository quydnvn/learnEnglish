'use strict'
const CatLog = require('cat-log')
const Logger = new CatLog('jwt:token')

const jwt = require('jsonwebtoken')

const Env = use('Env')
const Credential = use('App/Model/Credential')
const JwtTokenService = module.exports = exports = {}

JwtTokenService.generateNewAccountToken = function (payload = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      expiresIn: '7d',
      issuer:
    }

    jwt.sign({ context: payload.context }, Env.get('APP_KEY'), options, function(error, token) {
      if(error) {
        return reject(error)
      }
      resolve(token)
    })
  })
}

JwtTokenService.generateNewPasswordToken = function (payload = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      expiresIn: '7d',
      issuer: Credential.ISSUERS.PASSWORD
    }
    jwt.sign({ context: payload.context }, Env.get('APP_KEY'), options, function(error, token) {
      if(error) {
        return reject(error)
      }
      resolve(token)
    })
  })
}


