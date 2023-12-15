import axios from 'axios'
import { Presets, SingleBar } from 'cli-progress'

import { createAPI } from '../spotify-api/create-api.js'

async function getLikedTracks() {
  const api = await createAPI()

  const page = await api.currentUser.tracks.savedTracks(50)
  let tracks = page.items

  if (!page.next) {
    return tracks
  }

  const profile = await api.currentUser.profile()
  const { total } = page
  const urls = []

  let offset = 50
  while (offset < total) {
    urls.push(`${profile.href}/tracks?offset=${offset}&limit=50`)
    offset += 50
  }

  const accessToken = await api.getAccessToken()

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

  const progressBar = new SingleBar({}, Presets.shades_classic)
  progressBar.start(total, tracks.length)

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

export default getLikedTracks
