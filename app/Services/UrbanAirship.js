'use strict'

const Env = use('Env')
const request = use('request')

class UrbanAirship {

  constructor () {
    this.api = 'https://go.urbanairship.com/api'

    this.appKey = Env.get('UA_APP_KEY')
    this.appSecret = Env.get('UA_APP_SECRET')
    this.masterSecret = Env.get('UA_MASTER_SECRET')

    this.appAuth = Buffer.from(`${this.appKey}:${this.appSecret}`).toString('base64')
    this.masterAuth = Buffer.from(`${this.appKey}:${this.masterSecret}`).toString('base64')

    this.request = request
      .defaults({
        headers: {
          'Accept': 'application/vnd.urbanairship+json; version=3;',
          'Content-Type': 'application/json'
        }
      })
  }

  async associateUser (data) {
    return await new Promise((resolve, reject) => {
      this.request.post(`${this.api}/named_users/associate`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${this.masterAuth}`
        },
        json: data
      }, (error, response, body) => {
        return (response && response.statusCode === 200) ? resolve(body) : reject(error || JSON.stringify(body))
      })
    })
  }

  async addNamedUserTags (data) {
    return await new Promise((resolve, reject) => {
      this.request.post(`${this.api}/named_users/tags`, {
        headers: {
          Authorization: `Basic ${this.masterAuth}`
        },
        json: data
      }, (error, response, body) => {
        return (response && response.statusCode === 200) ? resolve(body) : reject(error || JSON.stringify(body))
      })
    })
  }

  async pushNotification (data) {
    return await new Promise((resolve, reject) => {
      this.request.post(`${this.api}/push`, {
        headers: {
          Authorization: `Basic ${this.masterAuth}`
        },
        json: data
      }, (error, response, body) => {
        return (response && [200, 201, 202].indexOf(response.statusCode) > -1)
          ? resolve(body)
          : reject(error || JSON.stringify(body))
      })
    })
  }

  async updateNamedUserTags (data) {
    return await new Promise((resolve, reject) => {
      this.request.post(`${this.api}/named_users/tags`, {
        headers: {
          Authorization: `Basic ${this.masterAuth}`
        },
        json: data
      }, (error, response, body) => {
        return (response && [200, 201, 202].indexOf(response.statusCode) > -1)
          ? resolve(body)
          : reject(error || JSON.stringify(body))
      })
    })
  }

}

module.exports = UrbanAirship

