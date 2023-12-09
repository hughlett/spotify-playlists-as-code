import axios from 'axios'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname } from 'path'

export function generateRefreshTokenFile() {
  const spotifyTokenPath = `${dirname(
    dirname(fileURLToPath(import.meta.url)),
  )}/login/login.js`

  execSync(`node ${spotifyTokenPath}`, {
    windowsHide: true,
    stdio: ['ignore', 'inherit', 'inherit'],
  })
}

export async function generateAccessToken(refreshToken: string) {
  const CLIENT_ID = '00bc6817f84c4065aa526dbb1fe66169'

  const data = new URLSearchParams({
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
  })

  const config = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data: data,
  }

  const response = await axios(config)
  const accessToken = response.data.access_token
  const newRefreshToken = response.data.refresh_token
  return { accessToken, newRefreshToken }
}
