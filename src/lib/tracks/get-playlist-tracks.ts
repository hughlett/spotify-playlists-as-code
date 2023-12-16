import { PlaylistedTrack } from '@spotify/web-api-ts-sdk'
import axios from 'axios'
import { Presets, SingleBar } from 'cli-progress'

import { createAPI } from '../spotify-api/create-api.js'

async function getPlaylistTracks(id: string) {
  const spotify = await createAPI()

  //   TODO: Refactor and type

  const asyncFunctions = []
  asyncFunctions.push(
    spotify.playlists.getPlaylist(id),
    spotify.currentUser.profile(),
    spotify.getAccessToken(),
  )

  const values = await Promise.all(asyncFunctions)

  const page = values[0].tracks
  const profile = values[1]
  const accessToken = values[2]

  let tracks: PlaylistedTrack[] = []
  const { total } = page

  const progressBar = new SingleBar({}, Presets.shades_classic)
  progressBar.start(total, 0)

  const urls = []

  let offset = 0
  while (offset < total) {
    urls.push(
      `${profile.href}/playlists/${id}/tracks?offset=${offset}&limit=50`,
    )
    offset += 50
  }

  if (!accessToken) {
    throw new Error('Not logged in.')
  }

  const requests = []

  for (const url of urls) {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken.access_token}`,
      },
      method: 'GET',
      url,
    }
    requests.push(axios(config))
  }

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
