import getItems from '../items/get-items.js'
import { createAPI } from '../spotify-api/create-api.js'

/**
 * Retrieves all of the user's playlists.
 * @returns All of the users playlists.
 */
async function getAllPlaylists() {
  const spotify = await createAPI()
  const MAX_LIMIT = 50

  const page = await spotify.currentUser.playlists.playlists(MAX_LIMIT)
  const { total } = page

  const profile = await spotify.currentUser.profile()

  const urls = Array.from({ length: Math.floor(total / MAX_LIMIT) + 1 }).map(
    (_value, index) =>
      `${profile.href}/playlists?offset=${index * MAX_LIMIT}&limit=50`,
  )

  const items = await getItems(urls, total)

  return items
}

export default getAllPlaylists
