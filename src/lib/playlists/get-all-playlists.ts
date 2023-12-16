import axios from 'axios'
import { Presets, SingleBar } from 'cli-progress'

import { createAPI } from '../spotify-api/create-api.js'

/**
 * Retrieves all of the user's playlists.
 * @returns All of the users playlists.
 */
async function getAllPlaylists() {
  const spotify = await createAPI()

  const page = await spotify.currentUser.playlists.playlists(50)
  let playlists = page.items

  if (!page.next) {
    return playlists
  }

  const profile = await spotify.currentUser.profile()
  const { total } = page
  const urls = []

  let offset = 50
  while (offset < total) {
    urls.push(`${profile.href}/playlists?offset=${offset}&limit=50`)
    offset += 50
  }

  const accessToken = await spotify.getAccessToken()

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
  progressBar.start(total, playlists.length)

  await Promise.all(
    requests.map(async (request) => {
      const response = await request
      playlists = [...playlists, ...response.data.items]
      progressBar.increment(response.data.items.length)
    }),
  )

  progressBar.stop()
  return playlists
}

export default getAllPlaylists
