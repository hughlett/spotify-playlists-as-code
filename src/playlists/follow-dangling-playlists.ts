import {
  SavedTrack,
  SimplifiedPlaylist,
  SpotifyApi,
  UserProfile,
} from '@spotify/web-api-ts-sdk'
import chalk from 'chalk'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { managedPlaylists } from '../../data/managedPlaylists.js'
import { SpotifyApiSingleton } from '../spotify-api/create-api.js'
import getPlaylistTracks from '../tracks/get-playlist-tracks.js'
import getLikedTracks from '../tracks/get-user-liked-tracks.js'
import { ManagedPlaylist } from './follow-spac-playlists.js'
import getAllPlaylists from './get-all-user-playlists.js'

export async function followDanglingPlaylists() {
  const spotify = await SpotifyApiSingleton.getInstance()
  const userPlaylists = await getAllPlaylists()
  const user = await spotify.currentUser.profile()

  const userLikedTracks = await getLikedTracks()

  let ownedPlaylists: SimplifiedPlaylist[] = userPlaylists.filter(
    (userPlaylist) => {
      if (
        userPlaylist.name === 'Dangling Tracks' ||
        userPlaylist.name === 'Dangling SPaC Tracks'
      ) {
        return false
      }
      return userPlaylist.owner.id === user.id
    },
  )

  await followDanglingPlaylist(
    userPlaylists,
    user,
    spotify,
    userLikedTracks,
    ownedPlaylists,
    'Dangling Tracks',
  )

  ownedPlaylists = userPlaylists.filter((userPlaylist) => {
    if (
      userPlaylist.name === 'Dangling Tracks' ||
      userPlaylist.name === 'Dangling SPaC Tracks'
    ) {
      return false
    }
    return managedPlaylists.some(
      (managedPlaylist: ManagedPlaylist) =>
        managedPlaylist.artists[0] === userPlaylist.name ||
        managedPlaylist.name === userPlaylist.name,
    )
  })

  await followDanglingPlaylist(
    userPlaylists,
    user,
    spotify,
    userLikedTracks,
    ownedPlaylists,
    'Dangling SPaC Tracks',
  )
}

async function followDanglingPlaylist(
  userPlaylists: SimplifiedPlaylist[],
  user: UserProfile,
  spotify: SpotifyApi,
  userLikedTracks: SavedTrack[],
  ownedPlaylists: SimplifiedPlaylist[],
  playlistName: string,
) {
  let playlist = playlistAlreadyExists(playlistName, userPlaylists, user)

  // Create the playlist if it doesn't exist yet
  if (playlist === false) {
    playlist = await spotify.playlists.createPlaylist(user.id, {
      name: playlistName,
      collaborative: false,
      public: true,
      description: '',
    })

    console.log(chalk.green(`Created playist ${playlistName}`))
  }

  // Remove playlist's that weren't created by the user

  // Get every unique track from the user's playlists
  const playlistedTracksURIs: string[] = []

  // Divide the array into arrays of size BATCH_SIZE
  const BATCH_SIZE = 1
  const ownedPlaylistsArrays = [
    ...Array(Math.ceil(ownedPlaylists.length / BATCH_SIZE)),
  ].map(() => ownedPlaylists.splice(0, BATCH_SIZE))

  for (const array of ownedPlaylistsArrays) {
    const promises = array.map(async (ownedPlaylist) => {
      console.log(`Processing ${ownedPlaylist.name}`)

      const tracks = await getPlaylistTracks(ownedPlaylist.id)
      for (const track of tracks) {
        if (track.track && !playlistedTracksURIs.includes(track.track.uri)) {
          playlistedTracksURIs.push(track.track.uri)
        }
      }
    })

    await Promise.all(
      promises.map(async (promise) => {
        await promise
      }),
    )
  }

  const danglingTracks = await getPlaylistTracks(playlist.id)
  const danglingTracksURIs = danglingTracks.map((track) => {
    return track.track.uri
  })
  const tracksToAdd: string[] = []
  const tracksToRemove: Array<{
    uri: string
  }> = []
  for (const likedTrack of userLikedTracks) {
    // Remove tracks that are part of a playlist and a part of dangling tracks
    if (
      danglingTracksURIs.includes(likedTrack.track.uri) &&
      playlistedTracksURIs.includes(likedTrack.track.uri)
    ) {
      tracksToRemove.push({ uri: likedTrack.track.uri })
    }

    // Add tracks that are not part of a playlist and not a part of dangling tracks
    if (
      !playlistedTracksURIs.includes(likedTrack.track.uri) &&
      !danglingTracksURIs.includes(likedTrack.track.uri)
    ) {
      tracksToAdd.push(likedTrack.track.uri)
    }
  }

  const removeArrays = [...Array(Math.ceil(tracksToRemove.length / 100))].map(
    () => tracksToRemove.splice(0, 100),
  )

  // Divide the array into arrays of size BATCH_SIZE
  const removeArraysArrays = [
    ...Array(Math.ceil(removeArrays.length / BATCH_SIZE)),
  ].map(() => removeArrays.splice(0, BATCH_SIZE))

  for (const array of removeArraysArrays) {
    const promises = array.map((tracks) => {
      return spotify.playlists.removeItemsFromPlaylist(playlist.id, {
        tracks: tracks,
      })
    })

    await Promise.all(
      promises.map(async (promise) => {
        await promise
      }),
    )
  }

  const arrays = [...Array(Math.ceil(tracksToAdd.length / 100))].map(() =>
    tracksToAdd.splice(0, 100),
  )

  // Divide the array into arrays of size BATCH_SIZE
  const addArrayArrays = [...Array(Math.ceil(arrays.length / BATCH_SIZE))].map(
    () => arrays.splice(0, BATCH_SIZE),
  )

  // Process each batch of managed playlists
  for (const array of addArrayArrays) {
    const promises = array.map((tracks) => {
      return spotify.playlists.addItemsToPlaylist(playlist.id, tracks)
    })

    await Promise.all(
      promises.map(async (promise) => {
        await promise
      }),
    )
  }
}

function playlistAlreadyExists(
  playlistName: string,
  userPlaylists: SimplifiedPlaylist[],
  user: UserProfile,
) {
  for (const userPlaylist of userPlaylists) {
    if (
      userPlaylist.owner.uri === user.uri &&
      userPlaylist.name === playlistName
    ) {
      return userPlaylist
    }
  }

  return false
}
