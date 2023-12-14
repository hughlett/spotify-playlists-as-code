import { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk'
import axios from 'axios'

import { createAPI } from '../spotify-api/create-api.js'

async function getAllPlaylists() {
  const api = await createAPI()

  let playlists: SimplifiedPlaylist[] = []

  let page = await api.currentUser.playlists.playlists(50)
  playlists = [...playlists, ...page.items]

  const accessToken = await api.getAccessToken()

  if (!accessToken) {
    throw new Error('Not logged in.')
  }

  while (page.next) {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken.access_token}`,
      },
      method: 'GET',
      url: page.next,
    }

    // eslint-disable-next-line no-await-in-loop
    const response = await axios(config)
    page = response.data
    playlists = [...playlists, ...page.items]
  }

  return playlists
}

export default getAllPlaylists
