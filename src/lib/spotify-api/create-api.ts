/* eslint-disable camelcase */
import { SpotifyApi } from '@spotify/web-api-ts-sdk'

import { generateAccessToken, getRefreshToken } from './tokens.js'
import { writeFileSync } from 'fs'

const CLIENT_ID = '813f058151b749cf9400a586ab0c3c54'

export async function createAPI() {
  const refreshToken = getRefreshToken()

  writeFileSync('/tokens/refresh_token', refreshToken)

  const accessToken = await generateAccessToken()
  console.log(refreshToken)
  const api = SpotifyApi.withAccessToken(CLIENT_ID, {
    access_token: accessToken,
    expires_in: 3600,
    refresh_token: refreshToken,
    token_type: 'Bearer',
  })

  return api
}
