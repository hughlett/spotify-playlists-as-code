import { PlaylistedTrack } from '@spotify/web-api-ts-sdk'
import getItems from '../items/get-items.js'
import SpotifyAPISingleton from '../spotify-api/index.js'

/**
 * Retrieves the tracks of a playlist from Spotify.
 *
 * @param id - The ID of the playlist.
 * @returns A promise that resolves to an array of PlaylistedTrack objects.
 */
async function getPlaylistTracks(id: string): Promise<PlaylistedTrack[]> {
  const spotify = await SpotifyAPISingleton.getInstance()
  const MAX_LIMIT = 50

  const page = await spotify.playlists.getPlaylist(id)
  const { total } = page.tracks

  const profile = await SpotifyAPISingleton.getUserProfile()

  const urls = Array.from({ length: Math.floor(total / MAX_LIMIT) + 1 }).map(
    (_value, index) =>
      `${profile.href}/playlists/${id}/tracks?offset=${
        index * MAX_LIMIT
      }&limit=50`,
  )

  const items = await getItems(urls)

  return items.filter((trackItem) => trackItem.track.type === 'track')
}

export default getPlaylistTracks
