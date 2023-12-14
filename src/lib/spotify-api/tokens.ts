/* eslint-disable camelcase */
import axios from 'axios'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { login } from '../login/login.js'

export const refreshTokenPath = `${dirname(
  dirname(dirname(dirname(fileURLToPath(import.meta.url)))),
)}/refresh_token`

export const accessTokenPath = `${dirname(
  dirname(dirname(dirname(fileURLToPath(import.meta.url)))),
)}/access_token`

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
  const CLIENT_ID = '00bc6817f84c4065aa526dbb1fe66169'
  const refreshToken = getRefreshToken()

  const data = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  })

  const config = {
    data,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
  }

  const response = await axios(config)
  const accessToken = response.data.access_token
  const newRefreshToken = response.data.refresh_token
  setAccessToken(accessToken)
  setRefreshToken(newRefreshToken)
}
