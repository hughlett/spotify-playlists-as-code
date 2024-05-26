import { SimplifiedArtist } from '@spotify/web-api-ts-sdk'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ManagedPlaylist } from '../../../data/managedPlaylists.js'
import SpotifyAPISingleton from '../../spotify-api/index.js'
import getLikedTracks from '../../tracks/get-user-liked-tracks.js'
import getAllPlaylists from '../get-user-playlists.js'
import { followManagedPlaylist } from './follow-managed-playlist.js'

/**
 * Follows the managed playlists.
 *
 * @param managedPlaylists - An array of managed playlists to follow.
 * @returns A promise that resolves when all the managed playlists have been followed.
 */
export async function followManagedPlaylists(
  managedPlaylists: ManagedPlaylist[],
) {
  const user = await SpotifyAPISingleton.getUserProfile()
  const userPlaylists = await getAllPlaylists()
  const userLikedTracks = await getLikedTracks()

  // Divide the array into arrays of size BATCH_SIZE
  const BATCH_SIZE = 1
  const managedPlaylistsArrays = [
    ...Array(Math.ceil(managedPlaylists.length / BATCH_SIZE)),
  ].map(() => managedPlaylists.splice(0, BATCH_SIZE))

  // Process each batch of managed playlists
  for (const array of managedPlaylistsArrays) {
    await Promise.all(
      array.map((managedPlaylist) =>
        followManagedPlaylist(
          managedPlaylist,
          userLikedTracks,
          userPlaylists,
          user,
        ),
      ),
    )
  }
}

/**
 * Evaluates the name of the managed playlist.
 * @param managedPlaylist The playlist to calculate the name of.
 * @returns The name of the managed playlist.
 */
export function getManagedPlaylistName(managedPlaylist: ManagedPlaylist) {
  return managedPlaylist.name || managedPlaylist.artists[0]
}

/**
 * Checks if a song meets the criteria for inclusion in a playlist.
 * @param songArtists The artists of the song.
 * @param playlistArtists The artists of the playlist.
 * @returns A boolean indicating whether the song meets the criteria.
 */
export function songMeetsCriteria(
  songArtists: SimplifiedArtist[],
  playlistArtists: string[],
) {
  return songArtists.some((songArtist) =>
    playlistArtists.includes(songArtist.name),
  )
}
