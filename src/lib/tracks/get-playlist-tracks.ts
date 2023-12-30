import { Playlist } from '@spotify/web-api-ts-sdk'

import getItems from '../items/get-items.js'
import { createAPI } from '../spotify-api/create-api.js'

async function getPlaylistTracks(id: string): Promise<Playlist[]> {
  const spotify = await createAPI()

  const page = await spotify.playlists.getPlaylist(id)
  const profile = await spotify.currentUser.profile()

  const MAX_ITEMS = 50
  const { total } = page.tracks

  const urls = Array.from({ length: Math.floor(total / MAX_ITEMS) + 1 }).map(
    (_value, index) =>
      `${profile.href}/playlists/${id}/tracks?offset=${
        index * MAX_ITEMS
      }&limit=50`,
  )

  const items = await getItems(urls, total)

  return items
}

export default getPlaylistTracks
