'use strict'

const Env = use('Env')
const request = use('request')
const {google} = require('googleapis')
const sampleClient = request('../sampleClient')
class Playlist {

  constructor() {

  }
  async getPlaylistData (etag) {
    // Create custom HTTP headers for the request to enable use of eTags
    const headers = {}
    if (etag) {
      headers['If-None-Match'] = etag
    }
    const youtube = google.youtube({
      version: 'v3',
      auth: sampleClient.oAuth2Client
    })
    const res = await youtube.playlists.list({
      part: 'id,snippet',
      id: 'PLIivdWyY5sqIij_cgINUHZDMnGjVx3rxi',
      headers: header
    })
    console.log('Status code: ' + res.status)
    console.log(res.data)
    return res
  }

  async list() {
    // the first query will return data with an etag
    const res = await this.getPlaylistData(null)
    const etag = res.data.etag
    console.log(`1etag: ${etag}`)
    const res2 = await this.getPlaylistData(etag)
    console.log(res2.status)
  }
}

module.exports = Playlist

