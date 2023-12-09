import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'node:url'
import { generateAccessToken, generateRefreshTokenFile } from './tokens.js'

const refreshTokenPath = `${dirname(
  dirname(dirname(fileURLToPath(import.meta.url))),
)}/refresh_token`

const CLIENT_ID = '00bc6817f84c4065aa526dbb1fe66169'

export async function createAPI() {
  if (!existsSync(refreshTokenPath)) {
    generateRefreshTokenFile()
  }

  const refreshToken = readFileSync(refreshTokenPath).toString('utf-8')
  const { accessToken, newRefreshToken } =
    await generateAccessToken(refreshToken)

  writeFileSync(refreshTokenPath, newRefreshToken)

  return SpotifyApi.withAccessToken(CLIENT_ID, {
    access_token: accessToken,
    expires_in: 3600,
    refresh_token: refreshToken,
    token_type: 'Bearer',
  })
}
