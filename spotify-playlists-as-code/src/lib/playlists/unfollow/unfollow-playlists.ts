import { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk'
import chalk from 'chalk'
import getManagedPlaylists, {
  ManagedPlaylist,
} from '../../data/get-managed-playlists.js'
import SpotifyAPISingleton from '../../spotify-api/index.js'
import getAllPlaylists from '../get-user-playlists.js'

/**
 * Unfollows playlists that meet certain criteria.
 *
 * @returns {Promise<void>} A promise that resolves when the playlists are unfollowed.
 */
export default async function unfollow(): Promise<void> {
  const spotify = await SpotifyAPISingleton.getInstance()

  // Get user's playlists
  const userPlaylists = await getAllPlaylists()
  const user = await SpotifyAPISingleton.getUserProfile()
  const managedPlaylists = getManagedPlaylists()

  // Remove playlist's that weren't created by the user
  const ownedPlaylists: SimplifiedPlaylist[] = userPlaylists.filter(
    (userPlaylist) => userPlaylist.owner.id === user.id,
  )

  // Filter out non-SPaC playlists
  const spacPlaylists = ownedPlaylists.filter((ownedPlaylist) => {
    if (
      ownedPlaylist.name === 'Curated Tracks' ||
      ownedPlaylist.name === 'Niche Tracks'
    ) {
      return true
    }
    return managedPlaylists.some((playlist: ManagedPlaylist) => {
      if (playlist.name) {
        return playlist.name === ownedPlaylist.name
      }
      return playlist.artists[0] === ownedPlaylist.name
    })
  })

  // Delete the playlists
  for (const spacPlaylist of spacPlaylists) {
    chalk.red(console.log(`Unfollowing ${spacPlaylist.name}`))
    await spotify.currentUser.playlists.unfollow(spacPlaylist.id)
  }
}
