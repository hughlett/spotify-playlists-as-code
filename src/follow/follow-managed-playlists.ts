import {
  PlaylistedTrack,
  SimplifiedArtist,
  SimplifiedPlaylist,
  TrackItem,
  UserProfile,
} from '@spotify/web-api-ts-sdk'
import chalk from 'chalk'
import getAllPlaylists from '../playlists/get-all-user-playlists.js'
import { SpotifyApiSingleton } from '../spotify-api/create-api.js'
import getLikedTracks from '../tracks/get-user-liked-tracks.js'

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
  const BATCH_SIZE = 1
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
  const playlist = await fetchUserPlaylist(
    managedPlaylistName,
    userPlaylists,
    user,
  )

  const spotify = await SpotifyApiSingleton.getInstance()
  await spotify.currentUser.playlists.unfollow(playlist.id)
  const freshPlaylist = await spotify.playlists.createPlaylist(user.id, {
    name: managedPlaylistName,
    collaborative: false,
    public: true,
    description: '',
  })

  const addedTracks: PlaylistedTrack<TrackItem>[] = userLikedTracks.filter(
    (userLikedTrack) => {
      return songMeetsCriteria(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        userLikedTrack.track.artists,
        managedPlaylist.artists,
      )
    },
  )
  addTracks(addedTracks, freshPlaylist)
}

async function addTracks(
  addedTracks: PlaylistedTrack<TrackItem>[],
  playlist: SimplifiedPlaylist,
) {
  const URIsToAdd: string[] = addedTracks.map((track) => {
    return track.track.uri
  })

  const URIsToAddArrays = [...Array(Math.ceil(URIsToAdd.length / 100))].map(
    () => URIsToAdd.splice(0, 100),
  )

  const spotify = await SpotifyApiSingleton.getInstance()
  const promises = URIsToAddArrays.map(async (URIsToAddArray) => {
    URIsToAddArray.map((uri) => {
      console.log(chalk.green(`Added ${uri} to ${playlist.name}`))
    })

    await spotify.playlists.addItemsToPlaylist(playlist.id, URIsToAddArray)
  })

  await Promise.all(
    promises.map(async (promise) => {
      await promise
    }),
  )
}

/**
 * Evaluates the name of the managed playlist.
 * @param managedPlaylist The playlist to calculate the name of.
 * @returns The name of the managed playlist.
 */
function getManagedPlaylistName(managedPlaylist: ManagedPlaylist) {
  return managedPlaylist.name || managedPlaylist.artists[0]
}

/**
 * Find a playlist based on name that is saved and owned by the user. Create the playlist if it doesn't exist.
 * @param playlistName The name of the playlist to find. Assumes the name of the playlist is unique.
 * @returns The playlist.
 */
async function fetchUserPlaylist(
  playlistName: string,
  userPlaylists: SimplifiedPlaylist[],
  user: UserProfile,
) {
  // TODO Refactor
  for (const userPlaylist of userPlaylists) {
    if (
      userPlaylist.owner.uri === user.uri &&
      userPlaylist.name === playlistName
    ) {
      return userPlaylist
    }
  }

  const spotify = await SpotifyApiSingleton.getInstance()

  const playlist = await spotify.playlists.createPlaylist(user.id, {
    name: playlistName,
    collaborative: false,
    public: true,
    description: '',
  })

  console.log(chalk.green(`Created playist ${playlistName}`))

  return playlist
}

function songMeetsCriteria(
  songArtists: SimplifiedArtist[],
  playlistArtists: string[],
) {
  // TODO Refactor
  for (const artist of songArtists) {
    if (playlistArtists.includes(artist.name)) {
      return true
    }
  }
}
