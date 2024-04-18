import { SimplifiedPlaylist, UserProfile } from '@spotify/web-api-ts-sdk'
import getAllPlaylists from './get-all-user-playlists.js'
import { SpotifyApiSingleton } from '../spotify-api/create-api.js'
import getLikedTracks from '../tracks/get-user-liked-tracks.js'
import getPlaylistTracks from '../tracks/get-playlist-tracks.js'
import chalk from 'chalk'

const PLAYLIST_NAME = 'Dangling Tracks'

export async function processDanglingTracks() {
  const spotify = await SpotifyApiSingleton.getInstance()
  const userPlaylists = await getAllPlaylists()
  const user = await spotify.currentUser.profile()

  const userLikedTracks = await getLikedTracks()

  let playlist = playlistAlreadyExists(PLAYLIST_NAME, userPlaylists, user)

  // Create the playlist if it doesn't exist yet

  if (playlist === false) {
    playlist = await spotify.playlists.createPlaylist(user.id, {
      name: PLAYLIST_NAME,
      collaborative: false,
      public: true,
      description: '',
    })

    console.log(chalk.green(`Created playist ${PLAYLIST_NAME}`))
  }

  // Remove playlist's that weren't created by the user

  let ownedPlaylists: SimplifiedPlaylist[] = []

  for (const userPlaylist of userPlaylists) {
    if (userPlaylist.owner.id === user.id) {
      ownedPlaylists.push(userPlaylist)
    }
  }

  // Get every unique track from the user's playlists

  let playlistedTracksURIs: string[] = []

  for (const playlist of ownedPlaylists) {
    const tracks = await getPlaylistTracks(playlist.id)
    for (const track of tracks) {
      if (track.track && !playlistedTracksURIs.includes(track.track.uri)) {
        playlistedTracksURIs.push(track.track.uri)
      }
    }
  }

  let tracksToAdd: string[] = []
  let tracksToRemove: Array<{
    uri: string
  }> = ([] = [])
  for (const likedTrack of userLikedTracks) {
    playlistedTracksURIs.includes(likedTrack.track.uri)
      ? tracksToRemove.push({ uri: likedTrack.track.uri })
      : tracksToAdd.push(likedTrack.track.uri)
  }

  const removeArrays = [...Array(Math.ceil(tracksToRemove.length / 100))].map(
    (_) => tracksToRemove.splice(0, 100),
  )

  for (const array of removeArrays) {
    for (const removedTrack of array) {
      console.log(
        chalk.red(`Removed ${removedTrack.uri} from ${playlist.name}`),
      )
    }
    await spotify.playlists.removeItemsFromPlaylist(playlist.id, {
      tracks: array,
    })
  }

  const arrays = [...Array(Math.ceil(tracksToAdd.length / 100))].map((_) =>
    tracksToAdd.splice(0, 100),
  )

  for (const array of arrays) {
    for (const addedTrack of array) {
      console.log(chalk.green(`Added ${addedTrack} to ${playlist.name}`))
    }
    await spotify.playlists.addItemsToPlaylist(playlist.id, array)
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
