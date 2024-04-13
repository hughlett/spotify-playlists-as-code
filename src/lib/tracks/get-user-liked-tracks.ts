import { SavedTrack } from '@spotify/web-api-ts-sdk'
import chalk from 'chalk'
import { SingleBar } from 'cli-progress'

import getItems from '../items/get-items.js'
import { createAPI } from '../spotify-api/create-api.js'

async function getLikedTracks(): Promise<SavedTrack[]> {
  const spotify = await createAPI()
  const MAX_LIMIT = 50

  const page = await spotify.currentUser.tracks.savedTracks(MAX_LIMIT)
  const { total } = page

  const profile = await spotify.currentUser.profile()

  const urls = Array.from({ length: Math.floor(total / MAX_LIMIT) + 1 }).map(
    (_value, index) =>
      `${profile.href}/tracks?offset=${index * MAX_LIMIT}&limit=50`,
  )

  const progressBar = new SingleBar({
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    format:
      'CLI Progress |' +
      chalk.green('{bar}') +
      '| {percentage}% || {value}/{total} Songs',
    hideCursor: true,
  })

  const items = await getItems(urls, total, progressBar)

  return items
}

export default getLikedTracks
