import { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { managedPlaylists } from '../../data/managedPlaylists.js'
import getAllPlaylists from '../playlists/get-all-user-playlists.js'
import { ManagedPlaylist } from '../playlists/process-managed-playlist.js'
import { SpotifyApiSingleton } from '../spotify-api/create-api.js'

export default async function teardown() {
  const spotify = await SpotifyApiSingleton.getInstance()

  // Get user's playlists
  const userPlaylists = await getAllPlaylists()
  const user = await spotify.currentUser.profile()

  // Remove playlist's that weren't created by the user
  const ownedPlaylists: SimplifiedPlaylist[] = userPlaylists.filter(
    (userPlaylist) => {
      return userPlaylist.owner.id === user.id
    },
  )

  // Filter out non-SPaC playlists
  const spacPlaylists = ownedPlaylists.filter((ownedPlaylist) => {
    if (ownedPlaylist.name === 'Dangling Tracks') {
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
    await spotify.currentUser.playlists.unfollow(spacPlaylist.id)
    console.log(`Deleted ${spacPlaylist.name}`)
  }
}
