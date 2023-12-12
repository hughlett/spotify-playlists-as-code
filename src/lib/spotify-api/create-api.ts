/* eslint-disable camelcase */
import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { existsSync } from 'node:fs'

import {
  accessTokenPath,
  generateAccessToken,
  getAccessToken,
  getRefreshToken,
  refreshTokenPath,
} from './tokens.js'

const CLIENT_ID = '00bc6817f84c4065aa526dbb1fe66169'

// TODO: Refactor

export async function createAPI() {
  if (!existsSync(refreshTokenPath)) {
    console.log('Login!')
  }

  const refreshToken = getRefreshToken()

  if (!existsSync(accessTokenPath)) {
    await generateAccessToken()

    const accessToken = getAccessToken()

    return SpotifyApi.withAccessToken(CLIENT_ID, {
      access_token: accessToken,
      expires_in: 3600,
      refresh_token: refreshToken,
      token_type: 'Bearer',
    })
  }

  let accessToken = getAccessToken()

  const api = SpotifyApi.withAccessToken(CLIENT_ID, {
    access_token: accessToken,
    expires_in: 3600,
    refresh_token: refreshToken,
    token_type: 'Bearer',
  })

  try {
    await api.currentUser.profile()
    return api
  } catch (error) {
    await generateAccessToken()
    accessToken = getAccessToken()

    return SpotifyApi.withAccessToken(CLIENT_ID, {
      access_token: accessToken,
      expires_in: 3600,
      refresh_token: refreshToken,
      token_type: 'Bearer',
    })
  }
}
