// Copyright 2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

/**
 * This is used by several samples to easily provide an oauth2 workflow.
 */

const {google} = require('googleapis');
const http = require('http');
const url = require('url');
const querystring = require('querystring');
const opn = require('opn');
const destroyer = require('server-destroy');
const fs = require('fs');
const path = require('path');

const keyPath = path.join(__dirname, 'oauth2.keys.json');
let keys = { redirect_uris: [''] };
if (fs.existsSync(keyPath)) {
  const keyFile = require(keyPath);
  keys = keyFile.installed || keyFile.web;
}

const invalidRedirectUri = `The provided keyfile does not define a valid
redirect URI. There must be at least one redirect URI defined, and this sample
assumes it redirects to 'http://localhost:3000/oauth2callback'.  Please edit
your keyfile, and add a 'redirect_uris' section.  For example:

"redirect_uris": [
  "http://localhost:3000/oauth2callback"
]
`;

class Youtube {
  constructor (options) {
    this._options = options || { scopes: [] };

    // validate the redirectUri.  This is a frequent cause of confusion.
    if (!keys.redirect_uris || keys.redirect_uris.length === 0) {
      throw new Error(invalidRedirectUri);
    }
    const redirectUri = keys.redirect_uris[keys.redirect_uris.length - 1];
    const parts = url.parse(redirectUri, false);
    if (redirectUri.length === 0 || parts.port !== '3000' || parts.hostname !== 'localhost' || parts.path !== '/oauth2callback') {
      throw new Error(invalidRedirectUri);
    }

    // create an oAuth client to authorize the API call
    this.oAuth2Client = new google.auth.OAuth2(
      keys.client_id,
      keys.client_secret,
      redirectUri
    )
    // initialize the youtube API library
    this.youtube = new google.youtube({
      version: 'v3',
      auth: this.oAuth2Client
    })
  }

  // Open an http server to accept the oauth callback. In this
  // simple example, the only request to our webserver is to
  // /oauth2callback?code=<code>
  async authenticate (scopes) {
    return new Promise((resolve, reject) => {
      // grab the url that will be used for authorization
      this.authorizeUrl = this.oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' ')
      });
      const server = http.createServer(async (req, res) => {
        try {
          if (req.url.indexOf('/oauth2callback') > -1) {
            const qs = querystring.parse(url.parse(req.url).query);
            res.end('Authentication successful! Please return to the console.');
            server.destroy();
            const {tokens} = await this.oAuth2Client.getToken(qs.code);
            this.oAuth2Client.credentials = tokens;
            resolve(this.oAuth2Client);
          }
        } catch (e) {
          reject(e);
        }
      }).listen(3000, () => {
        // open the browser to the authorize url to start the workflow
        opn(this.authorizeUrl, {wait: false}).then(cp => cp.unref());
      });
      destroyer(server);
    });
  }

  async getPlaylistData (etag) {
    // Create custom HTTP headers for the request to enable use of eTags
    const headers = {};
    if (etag) {
      headers['If-None-Match'] = etag;
    }
    const res = await this.youtube.playlists.list({
      part: 'id,snippet',
      id: 'PLIivdWyY5sqIij_cgINUHZDMnGjVx3rxi',
      headers: headers
    });
    console.log('Status code: ' + res.status);
    console.log(res.data);
    return res;
  }

  async search() {
    const res = await this.youtube.search.list({
      part: 'id,snippet',
      q: 'Node.js on Google Cloud'
    });
    console.log(res.data)
  }

  async upload (fileName, callback) {
    const fileSize = fs.statSync(fileName).size;
    const res = await youtube.videos.insert({
      part: 'id,snippet,status',
      notifySubscribers: false,
      requestBody: {
        snippet: {
          title: 'Node.js YouTube Upload Test',
          description: 'Testing YouTube upload via Google APIs Node.js Client'
        },
        status: {
          privacyStatus: 'private'
        }
      },
      media: {
        body: fs.createReadStream(fileName)
      }
    }, {
      // Use the `onUploadProgress` event from Axios to track the
      // number of bytes uploaded to this point.
      onUploadProgress: evt => {
        const progress = (evt.bytesRead / fileSize) * 100;
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`${Math.round(progress)}% complete`);
      }
    });
    console.log('\n\n');
    console.log(res.data);
    return res.data;
  }

}

module.exports = Youtube
