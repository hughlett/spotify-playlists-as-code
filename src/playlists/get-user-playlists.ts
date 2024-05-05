import { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk'
import getItems from '../items/get-items.js'
import SpotifyAPISingleton from '../spotify-api/index.js'

/**
 * Retrieves all of the user's playlists.
 * @returns All of the users playlists.
 */
export default async function getAllPlaylists(): Promise<SimplifiedPlaylist[]> {
  const spotify = await SpotifyAPISingleton.getInstance()
  const MAX_LIMIT = 50

  const page = await spotify.currentUser.playlists.playlists(MAX_LIMIT)
  const { total } = page

  const profile = await spotify.currentUser.profile()

  const urls = Array.from({ length: Math.floor(total / MAX_LIMIT) + 1 }).map(
    (_value, index) =>
      `${profile.href}/playlists?offset=${index * MAX_LIMIT}&limit=50`,
  )

  if (total === 0) {
    return []
  }

  return await getItems(urls)
}
