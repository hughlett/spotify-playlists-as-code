import {
  PlaylistedTrack,
  SavedTrack,
  SimplifiedArtist,
  SimplifiedPlaylist,
  TrackItem,
} from '@spotify/web-api-ts-sdk'
import getAllPlaylists from './get-all-user-playlists.js'
import { SpotifyApiSingleton } from '../spotify-api/create-api.js'
import getLikedTracks from '../tracks/get-user-liked-tracks.js'
import getPlaylistTracks from '../tracks/get-playlist-tracks.js'
import chalk from 'chalk'

export type ManagedPlaylist = {
  artists: string[]
  name?: string
}

const spotify = await SpotifyApiSingleton.getInstance()
const user = await spotify.currentUser.profile()
const userPlaylists = await getAllPlaylists()
const userLikedTracks = await getLikedTracks()

/**
 * Process an array of managed playlists.
 * @param managedPlaylists Managed playlists to process.
 */
export async function processManagedPlaylists(
  managedPlaylists: ManagedPlaylist[],
) {
  // Divide the array into arrays of size BATCH_SIZE
  const BATCH_SIZE = 5
  const managedPlaylistsArrays = [
    ...Array(Math.ceil(managedPlaylists.length / BATCH_SIZE)),
  ].map((_) => managedPlaylists.splice(0, BATCH_SIZE))

  // Process each batch of managed playlists
  for (const array of managedPlaylistsArrays) {
    const promises = array.map((managedPlaylist) => {
      return processManagedPlaylist(managedPlaylist)
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
async function processManagedPlaylist(managedPlaylist: ManagedPlaylist) {
  // Get the name of the managed playlist
  const managedPlaylistName = getManagedPlaylistName(managedPlaylist)

  console.log(`Processing ${managedPlaylistName}`)

  // Get the managed playlist or create it
  const playlist = await fetchUserPlaylist(managedPlaylistName)

  // Get the managed playlist's tracks.
  const tracks = await getPlaylistTracks(playlist.id)

  // Find any unliked songs that exist in the managed playlist and remove them.
  const removedTracks: PlaylistedTrack<TrackItem>[] = tracks.filter((track) => {
    return !track.is_local && !isLikedTrack(track)
  })
  await removeTracks(removedTracks, playlist)

  // Search for and add any liked songs that match the playlist criteria that aren't already present.
  const addedTracks: SavedTrack[] = userLikedTracks.filter((userLikedTrack) => {
    return (
      !playlistContainsTrack(tracks, userLikedTrack.track.id) &&
      songMeetsCriteria(userLikedTrack.track.artists, managedPlaylist.artists)
    )
  })
  addTracks(addedTracks, playlist)
}

async function addTracks(
  addedTracks: SavedTrack[],
  playlist: SimplifiedPlaylist,
) {
  const URIsToAdd: string[] = addedTracks.map((track) => {
    return track.track.uri
  })

  const URIsToAddArrays = [...Array(Math.ceil(URIsToAdd.length / 100))].map(
    (_) => URIsToAdd.splice(0, 100),
  )

  const promises = URIsToAddArrays.map(async (URIsToAddArray) => {
    URIsToAddArray.map((uri) => {
      console.log(chalk.red(`Added ${uri} to ${playlist.name}`))
    })

    await spotify.playlists.addItemsToPlaylist(playlist.id, URIsToAddArray)
  })

  await Promise.all(
    promises.map(async (promise) => {
      await promise
    }),
  )
}

async function removeTracks(
  removedTracks: PlaylistedTrack<TrackItem>[],
  playlist: SimplifiedPlaylist,
) {
  const URIsToRemove: Array<{
    uri: string
  }> = removedTracks.map((track) => {
    return {
      uri: track.track.uri,
    }
  })

  const URIsToRemoveArrays = [
    ...Array(Math.ceil(URIsToRemove.length / 100)),
  ].map((_) => URIsToRemove.splice(0, 100))

  const promises = URIsToRemoveArrays.map(async (URIsToRemoveArray) => {
    URIsToRemoveArray.map((uri) => {
      console.log(chalk.red(`Removed ${uri.uri} from ${playlist.name}`))
    })

    await spotify.playlists.removeItemsFromPlaylist(playlist.id, {
      tracks: URIsToRemove,
    })
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
async function fetchUserPlaylist(playlistName: string) {
  for (const userPlaylist of userPlaylists) {
    if (
      userPlaylist.owner.uri === user.uri &&
      userPlaylist.name === playlistName
    ) {
      return userPlaylist
    }
  }

  const playlist = await spotify.playlists.createPlaylist(user.id, {
    name: playlistName,
    collaborative: false,
    public: true,
    description: '',
  })

  console.log(chalk.green(`Created playist ${playlistName}`))

  return playlist
}

function playlistContainsTrack(
  playlist: PlaylistedTrack<TrackItem>[],
  trackID: string,
) {
  for (const track of playlist) {
    if (track.track.id === trackID) {
      return true
    }
  }
  return false
}

function isLikedTrack(track: PlaylistedTrack<TrackItem>) {
  for (const likedTrack of userLikedTracks) {
    if (likedTrack.track.uri === track.track.uri) {
      return true
    }
  }
  return false
}

function songMeetsCriteria(
  songArtists: SimplifiedArtist[],
  playlistArtists: string[],
) {
  for (const artist of songArtists) {
    if (playlistArtists.includes(artist.name)) {
      return true
    }
  }
}
