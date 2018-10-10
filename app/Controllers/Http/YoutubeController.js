'use strict'

const ytbRepository = make('App/Repositories/Eloquent/Youtube')
class YoutubeController {
  constructor() {
    this.ytb = ytbRepository
  }

  * list (request, response) {

  }

  * search(request, response) {

  }

  * upload(request, response) {

  }
}

module.exports = YoutubeController
