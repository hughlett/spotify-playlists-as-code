/* eslint-disable camelcase */
import axios from 'axios'
import express from 'express'
import { randomBytes } from 'node:crypto'
import { Server } from 'node:http'
import { dirname } from 'node:path'
import { stringify } from 'node:querystring'
import { fileURLToPath } from 'node:url'
import open from 'open'

import { setAccessToken, setRefreshToken } from '../spotify-api/tokens.js'
import { base64encode, generateRandomString, sha256 } from './pkce.js'

const PORT = 5173
const CLIENT_ID = `00bc6817f84c4065aa526dbb1fe66169`
const SCOPE = 'user-read-private user-read-email'
const REDIRECT_URI = 'http://localhost:' + PORT + '/callback'
const STATE = randomBytes(16).toString('hex')

const codeVerifier = generateRandomString(64)
const hashed = await sha256(codeVerifier)
const codeChallenge = base64encode(hashed)

const app = express()

let server: Server

app.get('/callback', (req, res) => {
  const html =
    dirname(dirname(dirname(dirname(fileURLToPath(import.meta.url))))) +
    '/public/callback.html'

  res.sendFile(html)
  if (req.query.error) {
    console.log('Something went wrong!')
  }
})

app.get('/token', async (req, res) => {
  res.sendStatus(200)

  const data = new URLSearchParams({
    client_id: CLIENT_ID,
    code: `${req.query.code}`,
    code_verifier: codeVerifier,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI,
  })

  const config = {
    data,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
  }

  axios(config)
    .then(async (response) => {
      setRefreshToken(response.data.refresh_token)
      setAccessToken(response.data.access_token)
    })
    .catch(() => {
      console.log('Could not login')
    })
    .finally(() => {
      server.close()
    })
})

export function login() {
  server = app.listen(PORT, () => {
    const URL =
      'https://accounts.spotify.com/authorize?' +
      stringify({
        SCOPE,
        client_id: CLIENT_ID,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        state: STATE,
      })

    open(URL)
  })
}
