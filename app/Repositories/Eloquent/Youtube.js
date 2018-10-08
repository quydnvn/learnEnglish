'use strict'

const ytb = make('App/Services/Youtube')
const {google} = require('googleapis');

class YoutubeRepository {

  constructor() {
    // Initialize the ytb api library
    this.youtube = google.youtube({
      version: 'v3',
      auth: ytb.oAuth2Client
    })
  }

  async list () {
    const res = await ytb.getPlaylistData(null)
    const etag = res.data.etag
    console.log(`etag: ${etag}`)
    const res2 = await ytb.getPlaylistData(etag)
    console.log(res2.status)
    return res2
  }

  async search () {
    const res = await ytb.search()
    console.log(res)
    return res
  }

  async upload (fileName, callback) {
    const res = await ytb.upload(fileName, callback)
    return res
  }

}

module.exports = YoutubeRepository
