import { PlaylistedTrack, TrackItem } from '@spotify/web-api-ts-sdk'
import getAllPlaylists from './lib/playlists/get-all-user-playlists.js'
import { createAPI } from './lib/spotify-api/create-api.js'
import getLikedTracks from './lib/tracks/get-user-liked-tracks.js'
import getPlaylistTracks from './lib/tracks/get-playlist-tracks.js'
import chalk from 'chalk'

const userLikedTracks = await getLikedTracks()
const userPlaylists = await getAllPlaylists()
const spotify = await createAPI()
const user = await spotify.currentUser.profile()

type ManagedPlaylist = {
  artists: string[]
  name?: string
}

const managedPlaylists: ManagedPlaylist[] = [
  { artists: ['Mac Miller'] },
  { artists: ['A$AP Rocky'] },
  { artists: ['Gorillaz'] },
  { artists: ['21 Savage'] },
  { artists: ['Chance the Rapper'], name: 'Chance' },
  { artists: ['UGK', 'Pimp C', 'Bun B'], name: 'UGK' },
]

async function playlistAlreadyExists(playlistName: string) {
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

for (const managedPlaylist of managedPlaylists) {
  const managedPlaylistName = managedPlaylist.name || managedPlaylist.artists[0]

  // Get the playlist or create it

  let playlist = await playlistAlreadyExists(managedPlaylistName)

  if (playlist === false) {
    playlist = await spotify.playlists.createPlaylist(user.id, {
      name: managedPlaylistName,
      collaborative: false,
      public: true,
      description: '',
    })

    console.log(chalk.green(`Created playist ${managedPlaylistName}`))
  }

  const tracks = await getPlaylistTracks(playlist.id)

  // Remove any unliked songs from the playlist.

  const URIsToRemove: Array<{
    uri: string
  }> = []
  const removedTracks = []
  for (const track of tracks) {
    if (!isLikedTrack(track)) {
      URIsToRemove.push({ uri: track.track.uri })
      removedTracks.push(track)
    }
  }

  if (URIsToRemove.length > 0) {
    await spotify.playlists.removeItemsFromPlaylist(playlist.id, {
      tracks: URIsToRemove,
    })

    for (const removedTrack of removedTracks) {
      console.log(
        chalk.red(`Removed ${removedTrack.track.name} from ${playlist.name}`),
      )
    }
  }

  // Search for and add any liked songs that match the playlist criteria that aren't already present.

  const URIsToAdd = []
  const addedTracks = []

  for (const likedTrack of userLikedTracks) {
    // Does the song already exist on the playlist?
    if (playlistContainsTrack(tracks, likedTrack.track.id)) {
      continue
    }

    // Does the song belong on the playlist?
    for (const artist of likedTrack.track.artists) {
      if (managedPlaylist.artists.includes(artist.name)) {
        URIsToAdd.push(likedTrack.track.uri)
        addedTracks.push(likedTrack)
      }
    }
  }

  if (URIsToAdd.length > 0) {
    for (const addedTrack of addedTracks) {
      console.log(
        chalk.green(`Added ${addedTrack.track.name} to ${playlist.name}`),
      )
    }
    await spotify.playlists.addItemsToPlaylist(playlist.id, URIsToAdd)
  }
}
