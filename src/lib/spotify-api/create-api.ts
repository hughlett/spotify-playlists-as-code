/* eslint-disable camelcase */
import { SpotifyApi } from '@spotify/web-api-ts-sdk'

import { REFRESH_TOKEN_PATH, generateAccessToken } from './tokens.js'
import { readFileSync } from 'node:fs'

const CLIENT_ID = '813f058151b749cf9400a586ab0c3c54'

async function createAPI() {
  const accessToken = await generateAccessToken(process.env.REFRESH_TOKEN)

  const api = SpotifyApi.withAccessToken(CLIENT_ID, {
    access_token: accessToken,
    expires_in: 3600,
    refresh_token: readFileSync(REFRESH_TOKEN_PATH).toString('utf8'),
    token_type: 'Bearer',
  })

  return api
}

export class SpotifyApiSingleton {
  private static instance: SpotifyApi

  private constructor() {}

  public static async getInstance(): Promise<SpotifyApi> {
    if (!SpotifyApiSingleton.instance) {
      const api = await createAPI()
      SpotifyApiSingleton.instance = api
    }

    return SpotifyApiSingleton.instance
  }
}
