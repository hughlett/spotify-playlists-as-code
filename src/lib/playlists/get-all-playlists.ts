import getItems from '../items/get-items.js'
import { createAPI } from '../spotify-api/create-api.js'

/**
 * Retrieves all of the user's playlists.
 * @returns All of the users playlists.
 */
async function getAllPlaylists() {
  const spotify = await createAPI()

  const page = await spotify.currentUser.playlists.playlists(50)

  const profile = await spotify.currentUser.profile()
  const MAX_ITEMS = 50
  const { total } = page

  const urls = Array.from({ length: Math.floor(total / MAX_ITEMS) + 1 }).map(
    (_value, index) =>
      `${profile.href}/playlists?offset=${index * MAX_ITEMS}&limit=50`,
  )

  const items = await getItems(urls, total)

  return items
}

export default getAllPlaylists
