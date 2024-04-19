import { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk'
import chalk from 'chalk'
import { SingleBar } from 'cli-progress'
import getItems from '../items/get-items.js'
import { SpotifyApiSingleton } from '../spotify-api/create-api.js'

/**
 * Retrieves all of the user's playlists.
 * @returns All of the users playlists.
 */
async function getAllPlaylists(): Promise<SimplifiedPlaylist[]> {
  const spotify = await SpotifyApiSingleton.getInstance()
  const MAX_LIMIT = 50

  const page = await spotify.currentUser.playlists.playlists(MAX_LIMIT)
  const { total } = page

  const profile = await spotify.currentUser.profile()

  const urls = Array.from({ length: Math.floor(total / MAX_LIMIT) + 1 }).map(
    (_value, index) =>
      `${profile.href}/playlists?offset=${index * MAX_LIMIT}&limit=50`,
  )

  const progressBar = new SingleBar({
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    format:
      'CLI Progress |' +
      chalk.green('{bar}') +
      '| {percentage}% || {value}/{total} Playlists',
    hideCursor: true,
  })

  if (total === 0) {
    return []
  }

  const items = await getItems(urls, total, progressBar)

  return items
}

export default getAllPlaylists
