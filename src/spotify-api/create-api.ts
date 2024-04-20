import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'

export const REFRESH_TOKEN_PATH = '/tokens/refresh_token'
export const CLIENT_ID = process.env.CLIENT_ID || ''

export class SpotifyApiSingleton {
  private static instance: SpotifyApi

  public static async getInstance(): Promise<SpotifyApi> {
    if (!SpotifyApiSingleton.instance) {
      if (!CLIENT_ID) {
        throw new Error('No client ID!')
      }
      const api = await createAPI()
      SpotifyApiSingleton.instance = api
    }

    return SpotifyApiSingleton.instance
  }
}
async function createAPI() {
  if (!existsSync(REFRESH_TOKEN_PATH)) {
    throw new Error('No refresh token provided')
  }

  const refreshToken = readFileSync(REFRESH_TOKEN_PATH)
    .toString('utf8')
    .replace(/\r?\n|\r/g, '')

  if (!refreshToken) {
    throw new Error('No refresh token provided')
  }

  const { accessToken, newRefreshToken } =
    await generateAccessToken(refreshToken)

  writeFileSync(REFRESH_TOKEN_PATH, newRefreshToken)

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
  return { accessToken: body.access_token, newRefreshToken: body.refresh_token }
}
