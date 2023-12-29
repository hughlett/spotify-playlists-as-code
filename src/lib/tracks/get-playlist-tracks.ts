import { PlaylistedTrack } from '@spotify/web-api-ts-sdk'
import axios from 'axios'
import { Presets, SingleBar } from 'cli-progress'

import { createAPI } from '../spotify-api/create-api.js'

async function getPlaylistTracks(id: string) {
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

  const accessToken = await spotify.getAccessToken()

  if (!accessToken) {
    throw new Error('Not logged in.')
  }

  const requests = urls.map((url) =>
    axios({
      headers: {
        Authorization: `Bearer ${accessToken.access_token}`,
      },
      method: 'GET',
      url,
    }),
  )

  let tracks: PlaylistedTrack[] = []

  const progressBar = new SingleBar({}, Presets.shades_classic)
  progressBar.start(total, 0)

  await Promise.all(
    requests.map(async (request) => {
      const response = await request
      tracks = [...tracks, ...response.data.items]
      progressBar.increment(response.data.items.length)
    }),
  )

  progressBar.stop()
  return tracks
}

export default getPlaylistTracks
