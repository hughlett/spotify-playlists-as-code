import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import {
  PlaylistedTrack,
  SpotifyApi,
  UserProfile,
} from '@spotify/web-api-ts-sdk'
import getUserLikedTracks from '../tracks/get-user-liked-tracks.js'

export const REFRESH_TOKEN_PATH =
  '/spotify-playlists-as-code/data/refresh_token'
export const CLIENT_ID = process.env.CLIENT_ID || ''

/**
 * Represents a singleton instance of the Spotify API and the current user.
 */
export default class SpotifyAPISingleton {
  private static instance: SpotifyApi

  private static user: UserProfile

  private static userLikedTracks: PlaylistedTrack[]

  /**
   * Returns the singleton instance of the Spotify API.
   * If the instance does not exist, it creates a new instance and assigns it to the `instance` property.
   * @returns A promise that resolves to the singleton instance of the Spotify API.
   * @throws An error if the client ID is not provided.
   */
  public static async getInstance(): Promise<SpotifyApi> {
    if (!SpotifyAPISingleton.instance) {
      if (!CLIENT_ID) {
        throw new Error('No client ID!')
      }
      const api = await createAPI()
      SpotifyAPISingleton.instance = api
    }

    return SpotifyAPISingleton.instance
  }

  /**
   * Returns the user profile of the authenticated user.
   * If the user profile does not exist, it fetches the user profile using the Spotify API.
   * @returns A promise that resolves to the user profile of the authenticated user.
   */
  public static async getUserProfile(): Promise<UserProfile> {
    if (!SpotifyAPISingleton.user) {
      const api = await SpotifyAPISingleton.getInstance()
      SpotifyAPISingleton.user = await api.currentUser.profile()
    }

    return SpotifyAPISingleton.user
  }

  public static async getUserLikedTracks(): Promise<PlaylistedTrack[]> {
    if (!SpotifyAPISingleton.userLikedTracks) {
      SpotifyAPISingleton.userLikedTracks = await getUserLikedTracks()
    }

    return SpotifyAPISingleton.userLikedTracks
  }
}

/**
 * Creates a Spotify API instance with the provided refresh token.
 * @throws {Error} If no refresh token is provided.
 * @returns {Promise<SpotifyApi>} A promise that resolves to a SpotifyApi instance.
 */
async function createAPI(): Promise<SpotifyApi> {
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

/**
 * Generates a new access token using the provided refresh token.
 * @param refreshToken - The refresh token used to generate the access token.
 * @returns An object containing the new access token and the new refresh token.
 */
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
