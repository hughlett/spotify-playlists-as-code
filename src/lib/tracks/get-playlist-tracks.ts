import { Playlist } from '@spotify/web-api-ts-sdk'

import getItems from '../items/get-items.js'
import { createAPI } from '../spotify-api/create-api.js'

async function getPlaylistTracks(id: string): Promise<Playlist[]> {
  const spotify = await createAPI()
  const MAX_LIMIT = 50

  const page = await spotify.playlists.getPlaylist(id)
  const { total } = page.tracks

  const profile = await spotify.currentUser.profile()

  const urls = Array.from({ length: Math.floor(total / MAX_LIMIT) + 1 }).map(
    (_value, index) =>
      `${profile.href}/playlists/${id}/tracks?offset=${
        index * MAX_LIMIT
      }&limit=50`,
  )

  const items = await getItems(urls, total)

  return items
}

export default getPlaylistTracks
