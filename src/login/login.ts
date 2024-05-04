import { randomBytes } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { Server } from 'node:http'
import { stringify } from 'node:querystring'
import express from 'express'
import {
  CLIENT_ID as client_id,
  REFRESH_TOKEN_PATH,
} from '../spotify-api/index.js'
import { base64encode, generateRandomString, sha256 } from './pkce.js'

const PORT = 5173
const scope =
  'user-library-read playlist-read-private playlist-modify-public playlist-modify-private ugc-image-upload'
const redirect_uri = `http://localhost:${PORT}/callback`

const state = randomBytes(16).toString('hex')
const code_verifier = generateRandomString(64)
const hashed = await sha256(code_verifier)
const code_challenge = base64encode(hashed)

const app = express()

let server: Server

app.get('/callback', (req, res) => {
  const html = process.cwd() + '/public/callback.html'

  res.sendFile(html)
  if (req.query.error) {
    console.log('Something went wrong!')
  }
})

app.get('/token', async (req, res) => {
  res.sendStatus(200)

  const body = new URLSearchParams({
    client_id,
    code: `${req.query.code}`,
    code_verifier,
    grant_type: 'authorization_code',
    redirect_uri,
  })

  fetch('https://accounts.spotify.com/api/token', {
    body,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'post',
  })
    .then(async (response) => {
      const body = await response.json()
      writeFileSync(REFRESH_TOKEN_PATH, body.refresh_token)
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
        client_id,
        code_challenge,
        code_challenge_method: 'S256',
        redirect_uri,
        response_type: 'code',
        scope,
        state,
      })
    console.log(URL)
  })
}
