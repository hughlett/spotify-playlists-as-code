import { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { managedPlaylists } from '../../data/managedPlaylists.js'
import { ManagedPlaylist } from '../follow/follow-managed-playlists.js'
import getAllPlaylists from '../playlists/get-all-user-playlists.js'
import { SpotifyApiSingleton } from '../spotify-api/create-api.js'

export default async function unfollow() {
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
    await spotify.currentUser.playlists.unfollow(spacPlaylist.id)
    console.log(`Deleted ${spacPlaylist.name}`)
  }
}
