import axios from 'axios'

import { createAPI } from '../spotify-api/create-api.js'

/**
 * Retrieves all of the user's playlists.
 * @returns All of the users playlists.
 */
async function getAllPlaylists() {
  const api = await createAPI()

  const page = await api.currentUser.playlists.playlists(50)
  let playlists = page.items

  if (!page.next) {
    return playlists
  }

  const profile = await api.currentUser.profile()
  const { total } = page
  const urls = []

  let offset = 50
  while (offset < total) {
    urls.push(`${profile.href}/playlists?offset=${offset}&limit=50`)
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

  const responses = await Promise.all(requests)
  for (const response of responses) {
    playlists = [...playlists, ...response.data.items]
  }

  return playlists
}

export default getAllPlaylists
