import { PlaylistedTrack } from '@spotify/web-api-ts-sdk'
import getItems from '../items/get-items.js'
import SpotifyAPISingleton from '../spotify-api/index.js'

/**
 * Retrieves the liked tracks of the current user from Spotify.
 * @returns A promise that resolves to an array of PlaylistedTrack objects representing the liked tracks.
 */
async function getUserLikedTracks(): Promise<PlaylistedTrack[]> {
  const spotify = await SpotifyAPISingleton.getInstance()
  const MAX_LIMIT = 50

  const page = await spotify.currentUser.tracks.savedTracks(MAX_LIMIT)
  const { total } = page

  const urls = Array.from({ length: Math.floor(total / MAX_LIMIT) + 1 }).map(
    (_value, index) =>
      `https://api.spotify.com/v1/me/tracks?offset=${index * MAX_LIMIT}&limit=${MAX_LIMIT}`,
  )

  return await getItems(urls)
}

export default getUserLikedTracks
