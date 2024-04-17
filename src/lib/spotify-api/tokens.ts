/* eslint-disable camelcase */
import { writeFileSync } from 'node:fs'

export const REFRESH_TOKEN_PATH = `/tokens/refresh_token`

export function setRefreshToken(refreshToken: string) {
  writeFileSync(REFRESH_TOKEN_PATH, refreshToken)
}

export function getRefreshToken(): string {
  return process.env.REFRESH_TOKEN || ''
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
  setRefreshToken(body.refresh_token)
  return body.access_token
}
