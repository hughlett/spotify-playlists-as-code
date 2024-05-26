import SpotifyAPISingleton from '../spotify-api/index.js'

/**
 * Performs a health check by calling the Spotify API to retrieve the current user's profile.
 * @returns {Promise<void>} A promise that resolves when the health check is complete.
 */
export default async function healthcheck(): Promise<void> {
  await SpotifyAPISingleton.getInstance()
}
