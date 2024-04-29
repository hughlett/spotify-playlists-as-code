import { PlaylistedTrack } from '@spotify/web-api-ts-sdk'
import chalk from 'chalk'
import { SingleBar } from 'cli-progress'
import getItems from '../items/get-items.js'
import { SpotifyApiSingleton } from '../spotify-api/create-api.js'

async function getPlaylistTracks(id: string): Promise<PlaylistedTrack[]> {
  const spotify = await SpotifyApiSingleton.getInstance()
  const MAX_LIMIT = 50

  const page = await spotify.playlists.getPlaylist(id)
  const { total } = page.tracks

  const profile = await spotify.currentUser.profile()

  const urls = Array.from({ length: Math.floor(total / MAX_LIMIT) + 1 }).map(
    (_value, index) =>
      `${profile.href}/playlists/${id}/tracks?offset=${
        index * MAX_LIMIT
      }&limit=50`,
  )

  const progressBar = new SingleBar({
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    format:
      'CLI Progress |' +
      chalk.green('{bar}') +
      '| {percentage}% || {value}/{total} Songs || ' +
      page.name,
    hideCursor: true,
  })

  const items = await getItems(urls, total, progressBar)

  return items.filter((trackItem) => {
    return trackItem.track.type === 'track'
  })
}

export default getPlaylistTracks
