import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'

const REFRESH_TOKEN_PATH = '/tokens/refresh_token'
export const CLIENT_ID = 'e27f8d0802d54214acfe4fc8d28b23a7'

export class SpotifyApiSingleton {
  private static instance: SpotifyApi

  public static async getInstance(): Promise<SpotifyApi> {
    if (!SpotifyApiSingleton.instance) {
      const api = await createAPI()
      SpotifyApiSingleton.instance = api
    }

    return SpotifyApiSingleton.instance
  }
}
async function createAPI() {
  let refreshToken = process.env.REFRESH_TOKEN

  if (!refreshToken && !existsSync(REFRESH_TOKEN_PATH)) {
    throw new Error('No refresh token provided')
  }

  if (existsSync(REFRESH_TOKEN_PATH)) {
    refreshToken = readFileSync(REFRESH_TOKEN_PATH).toString('utf8')
  }

  if (!refreshToken) {
    throw new Error('No refresh token provided')
  }

  const accessToken = await generateAccessToken(refreshToken)

  return SpotifyApi.withAccessToken(CLIENT_ID, {
    access_token: accessToken,
    expires_in: 3600,
    refresh_token: readFileSync(REFRESH_TOKEN_PATH).toString('utf8'),
    token_type: 'Bearer',
  })
}

async function generateAccessToken(refreshToken: string) {
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
  writeFileSync(REFRESH_TOKEN_PATH, body.refresh_token)
  return body.access_token
}
