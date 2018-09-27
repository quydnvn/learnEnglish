'use strict'

const Base = use('App/Model/Base')

class Credential extends Base {

  static get ISSUERS () {
    return {
      LOGIN: 'oauth:login',
      COMPANY_ACCOUNT: 'company:account',
      INVITATION: 'account:invitation',
      PASSWORD: 'password:reset'
    }
  }

  static get visible () {
    return ['token_type', 'access_token', 'expires_in', 'expires_on']
  }

}

module.exports = Credential
