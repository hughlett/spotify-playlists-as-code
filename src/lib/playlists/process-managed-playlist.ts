import {
  PlaylistedTrack,
  SavedTrack,
  SimplifiedArtist,
  TrackItem,
} from '@spotify/web-api-ts-sdk'
import getAllPlaylists from './get-all-user-playlists.js'
import { createAPI } from '../spotify-api/create-api.js'
import getLikedTracks from '../tracks/get-user-liked-tracks.js'
import getPlaylistTracks from '../tracks/get-playlist-tracks.js'
import chalk from 'chalk'

export type ManagedPlaylist = {
  artists: string[]
  name?: string
}

const spotify = await createAPI()
const user = await spotify.currentUser.profile()
const userPlaylists = await getAllPlaylists()
const userLikedTracks = await getLikedTracks()

async function processManagedPlaylist(managedPlaylist: ManagedPlaylist) {
  // Get the name of the managed playlist
  const managedPlaylistName = getManagedPlaylistName(managedPlaylist)

  console.log(`Processing ${managedPlaylistName}`)

  // Get the managed playlist or create it
  const playlist = await fetchUserPlaylist(managedPlaylistName)

  // Get the managed playlist's tracks.
  const tracks = await getPlaylistTracks(playlist.id)

  // Find any unliked songs that exist in the managed playlist.
  const removedTracks: PlaylistedTrack<TrackItem>[] = tracks.filter((track) => {
    return !track.is_local && !isLikedTrack(track)
  })

  const URIsToRemove: Array<{
    uri: string
  }> = removedTracks.map((track) => {
    return {
      uri: track.track.uri,
    }
  })

  if (URIsToRemove.length > 0) {
    await spotify.playlists.removeItemsFromPlaylist(playlist.id, {
      tracks: URIsToRemove,
    })

    removedTracks.map((removedTrack) => {
      console.log(
        chalk.red(`Removed ${removedTrack.track.name} from ${playlist.name}`),
      )
    })
  }

  // Search for and add any liked songs that match the playlist criteria that aren't already present.
  const addedTracks: SavedTrack[] = userLikedTracks.filter((userLikedTrack) => {
    return (
      !playlistContainsTrack(tracks, userLikedTrack.track.id) &&
      songMeetsCriteria(userLikedTrack.track.artists, managedPlaylist.artists)
    )
  })

  const URIsToAdd: string[] = addedTracks.map((track) => {
    return track.track.uri
  })

  if (URIsToAdd.length > 0) {
    await spotify.playlists.addItemsToPlaylist(playlist.id, URIsToAdd)

    addedTracks.map((addedTrack) => {
      console.log(
        chalk.green(`Added ${addedTrack.track.name} to ${playlist.name}`),
      )
    })
  }
}

/**
 *
 * @param managedPlaylists
 * @returns
 */
export async function processManagedPlaylists(
  managedPlaylists: ManagedPlaylist[],
): Promise<boolean> {
  const arrays = [...Array(Math.ceil(managedPlaylists.length / 5))].map((_) =>
    managedPlaylists.splice(0, 5),
  )

  for (const array of arrays) {
    const promises = array.map((managedPlaylist) => {
      return processManagedPlaylist(managedPlaylist)
    })

    await Promise.all(
      promises.map(async (promise) => {
        await promise
      }),
    )
  }

  return true
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
