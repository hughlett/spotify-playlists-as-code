import { PlaylistedTrack } from '@spotify/web-api-ts-sdk'
import axios from 'axios'
import { Presets, SingleBar } from 'cli-progress'

import { createAPI } from '../spotify-api/create-api.js'

async function getPlaylistTracks(id: string) {
  const spotify = await createAPI()

  const pagePromise = spotify.playlists.getPlaylist(id)
  const profilePromise = spotify.currentUser.profile()
  const accessTokenPromise = spotify.getAccessToken()

  const page = await pagePromise
  const profile = await profilePromise
  const accessToken = await accessTokenPromise

  const { total } = page.tracks
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

  let tracks: PlaylistedTrack[] = []

  const progressBar = new SingleBar({}, Presets.shades_classic)
  progressBar.start(total, 0)

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
