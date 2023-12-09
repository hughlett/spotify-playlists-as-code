import open from 'open'
import express from 'express'
import axios from 'axios'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'
import { stringify } from 'querystring'
import { writeFileSync } from 'fs'
import { generateRandomString, sha256, base64encode } from './pkce.js'

const PORT = 5173
const CLIENT_ID = `00bc6817f84c4065aa526dbb1fe66169`
const SCOPE = 'user-read-private user-read-email'
const REDIRECT_URI = 'http://localhost:' + PORT + '/callback'
const STATE = randomBytes(16).toString('hex')

const codeVerifier = generateRandomString(64)
const hashed = await sha256(codeVerifier)
const codeChallenge = base64encode(hashed)

const app = express()

app.get('/callback', (req, res) => {
  const html =
    dirname(dirname(dirname(fileURLToPath(import.meta.url)))) +
    '/public/callback.html'

  res.sendFile(html)
  if (req.query.error) {
    console.error(req.query.error)
  }
})

app.get('/token', async (req, res) => {
  res.sendStatus(200)

  const data = new URLSearchParams({
    code: `${req.query.code}`,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    code_verifier: codeVerifier,
  })

  const config = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data: data,
  }

  const refreshPath = `${dirname(
    dirname(dirname(fileURLToPath(import.meta.url))),
  )}/refresh_token`

  axios(config)
    .then(function (response) {
      writeFileSync(refreshPath, response.data.refresh_token)

      process.exit()
    })
    .catch(function (error) {
      console.log(error)
      process.exit()
    })
})

app.listen(PORT, () => {
  const URL =
    'https://accounts.spotify.com/authorize?' +
    stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      SCOPE,
      redirect_uri: REDIRECT_URI,
      state: STATE,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    })

  open(URL)
})
