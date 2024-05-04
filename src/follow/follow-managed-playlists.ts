import {
  PlaylistedTrack,
  SimplifiedArtist,
  SimplifiedPlaylist,
  TrackItem,
  UserProfile,
} from '@spotify/web-api-ts-sdk'
import getAllPlaylists from '../playlists/get-all-user-playlists.js'
import { SpotifyApiSingleton } from '../spotify-api/create-api.js'
import getLikedTracks from '../tracks/get-user-liked-tracks.js'
import { getUserPlaylist } from './follow-personalised-playlists.js'
import { followPlaylist } from './follow-playlist.js'

export type ManagedPlaylist = {
  artists: string[]
  name?: string
}

/**
 * Process an array of managed playlists.
 * @param managedPlaylists Managed playlists to process.
 */
export async function followManagedPlaylists(
  managedPlaylists: ManagedPlaylist[],
) {
  const spotify = await SpotifyApiSingleton.getInstance()
  const user = await spotify.currentUser.profile()
  const userPlaylists = await getAllPlaylists()
  const userLikedTracks = await getLikedTracks()

  // Divide the array into arrays of size BATCH_SIZE
  const BATCH_SIZE = 5
  const managedPlaylistsArrays = [
    ...Array(Math.ceil(managedPlaylists.length / BATCH_SIZE)),
  ].map(() => managedPlaylists.splice(0, BATCH_SIZE))

  // Process each batch of managed playlists
  for (const array of managedPlaylistsArrays) {
    const promises = array.map((managedPlaylist) => {
      return processManagedPlaylist(
        managedPlaylist,
        userLikedTracks,
        userPlaylists,
        user,
      )
    })

    await Promise.all(
      promises.map(async (promise) => {
        await promise
      }),
    )
  }
}

/**
 * Process a managed playlist.
 * @param managedPlaylist Managed playlist to process.
 */
async function processManagedPlaylist(
  managedPlaylist: ManagedPlaylist,
  userLikedTracks: PlaylistedTrack<TrackItem>[],
  userPlaylists: SimplifiedPlaylist[],
  user: UserProfile,
) {
  // Get the name of the managed playlist
  const managedPlaylistName = getManagedPlaylistName(managedPlaylist)

  console.log(`Processing ${managedPlaylistName}`)

  // Get the managed playlist or create it

  const playlist = await getUserPlaylist(managedPlaylistName, [
    ...userPlaylists.filter((userPlaylist) => {
      return userPlaylist.owner.id == user.id
    }),
  ])

  const managedPlaylistTracks = userLikedTracks
    .filter((userLikedTrack) => {
      return songMeetsCriteria(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        userLikedTrack.track.artists,
        managedPlaylist.artists,
      )
    })
    .map((track) => track.track)

  await followPlaylist(playlist, managedPlaylistTracks)
}

/**
 * Evaluates the name of the managed playlist.
 * @param managedPlaylist The playlist to calculate the name of.
 * @returns The name of the managed playlist.
 */
function getManagedPlaylistName(managedPlaylist: ManagedPlaylist) {
  return managedPlaylist.name || managedPlaylist.artists[0]
}

function songMeetsCriteria(
  songArtists: SimplifiedArtist[],
  playlistArtists: string[],
) {
  return songArtists.some((songArtist) =>
    playlistArtists.includes(songArtist.name),
  )
}
