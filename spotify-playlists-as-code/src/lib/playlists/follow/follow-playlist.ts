import { SimplifiedPlaylist, TrackItem } from '@spotify/web-api-ts-sdk'
import chalk from 'chalk'
import SpotifyAPISingleton from '../../spotify-api/index.js'
import getPlaylistTracks from '../../tracks/get-playlist-tracks.js'

/**
 * Follows a playlist by adding new tracks and removing existing tracks.
 *
 * @param playlist - The playlist to follow.
 * @param newPlaylistTracks - An array of new tracks to add to the playlist.
 * @returns A Promise that resolves when the playlist has been updated.
 */
export async function followPlaylist(
  playlist: SimplifiedPlaylist,
  newPlaylistTracks: TrackItem[],
  name: string,
  description: string,
) {
  const spotify = await SpotifyAPISingleton.getInstance()
  const existingTracks = (await getPlaylistTracks(playlist.id)).map(
    (track) => track.track,
  )

  const tracksToRemove = [...existingTracks].filter(
    (existingTrack) =>
      !newPlaylistTracks.some(
        (newPlaylistTrack) => newPlaylistTrack.id === existingTrack.id,
      ),
  )

  const tracksToAdd = newPlaylistTracks.filter(
    (newPlaylistTrack) =>
      !existingTracks.some(
        (existingTrack) => existingTrack.id === newPlaylistTrack.id,
      ),
  )

  const tracksToAddArrays = [...Array(Math.ceil(tracksToAdd.length / 100))].map(
    () => tracksToAdd.splice(0, 100),
  )

  for (const tracksArray of tracksToAddArrays) {
    const uris = tracksArray.map((track) => {
      console.log(chalk.green(`Adding ${track.name} to ${playlist.name}`))
      return track.uri
    })
    await spotify.playlists.addItemsToPlaylist(playlist.id, uris)
  }

  const tracksToRemoveArrays = [
    ...Array(Math.ceil(tracksToRemove.length / 100)),
  ].map(() => tracksToRemove.splice(0, 100))

  for (const tracksArray of tracksToRemoveArrays) {
    const uris = tracksArray.map((track) => {
      console.log(chalk.red(`Removing ${track.name} from ${playlist.name}`))
      return { uri: track.uri }
    })
    await spotify.playlists.removeItemsFromPlaylist(playlist.id, {
      tracks: uris,
    })
  }

  await spotify.playlists.changePlaylistDetails(playlist.id, {
    name,
    description,
  })
}
