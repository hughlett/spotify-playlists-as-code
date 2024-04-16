/* eslint-disable camelcase */
import { readFileSync, writeFileSync } from 'node:fs'

import { login } from '../login/login.js'

export const refreshTokenPath = `/tokens/refresh_token`

export const accessTokenPath = `/tokens/access_token`

export function setRefreshToken(refreshToken: string) {
  writeFileSync(refreshTokenPath, refreshToken)
}

export function setAccessToken(accessToken: string) {
  writeFileSync(accessTokenPath, accessToken)
}

export function getRefreshToken() {
  return readFileSync(refreshTokenPath).toString('utf8')
}

export function getAccessToken() {
  return readFileSync(accessTokenPath).toString('utf8')
}

export function generateRefreshToken() {
  login()
}

export async function generateAccessToken() {
  const CLIENT_ID = '813f058151b749cf9400a586ab0c3c54'
  const refreshToken = getRefreshToken()

  const response = await fetch('https://accounts.spotify.com/api/token', {
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'post',
  })

  const body = await response.json()

  const accessToken = body.access_token
  const newRefreshToken = body.refresh_token
  setAccessToken(accessToken)
  setRefreshToken(newRefreshToken)
}
