import { SimplifiedPlaylist, TrackItem } from '@spotify/web-api-ts-sdk'
import chalk from 'chalk'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { managedPlaylists } from '../../data/managedPlaylists.js'
import getAllPlaylists from '../playlists/get-all-user-playlists.js'
import { SpotifyApiSingleton } from '../spotify-api/create-api.js'
import getPlaylistTracks from '../tracks/get-playlist-tracks.js'
import getLikedTracks from '../tracks/get-user-liked-tracks.js'
import { ManagedPlaylist } from './follow-managed-playlists.js'

export async function followCuratedPlaylists() {
  const spotify = await SpotifyApiSingleton.getInstance()
  const userPlaylists = await getAllPlaylists()
  const user = await spotify.currentUser.profile()

  const ownedPlaylists: SimplifiedPlaylist[] = userPlaylists.filter(
    (userPlaylist) => {
      if (
        userPlaylist.name == 'Niche Tracks' ||
        userPlaylist.name == 'Curated Tracks'
      ) {
        return false
      }
      return userPlaylist.owner.id == user.id
    },
  )

  // Get every unique track from managed playlists

  const SPaCPlaylists = [...ownedPlaylists].filter((ownedPlaylist) => {
    return managedPlaylists.some((managedPlaylist: ManagedPlaylist) => {
      if (managedPlaylist.artists[0] == ownedPlaylist.name) return true

      if (managedPlaylist.name && managedPlaylist.name == ownedPlaylist.name)
        return true
    })
  })

  const SPaCTracks = await getUniqueTracksFromPlaylists([...SPaCPlaylists])

  // Get every unique track from curated playlists

  const curatedPlaylists = [...ownedPlaylists].filter((ownedPlaylist) => {
    return !managedPlaylists.some((managedPlaylist: ManagedPlaylist) => {
      if (managedPlaylist.artists[0] == ownedPlaylist.name) return true

      if (managedPlaylist.name && managedPlaylist.name == ownedPlaylist.name)
        return true

      return false
    })
  })

  const curatedTracks = await getUniqueTracksFromPlaylists([
    ...curatedPlaylists,
  ])

  // Find song's not on any playlists

  const likedTracks = await getLikedTracks()

  const nicheTracks = likedTracks.filter((likedTrack) => {
    return (
      !SPaCTracks.some((spacTrack) => {
        return likedTrack.track.uri == spacTrack.uri
      }) &&
      !curatedTracks.some((spacTrack) => {
        return likedTrack.track.uri == spacTrack.uri
      })
    )
  })

  // Update playlists

  const nicheTracksPlaylist = await getUserPlaylist('Niche Tracks', [
    ...userPlaylists.filter((userPlaylist) => {
      return userPlaylist.owner.id == user.id
    }),
  ])
  const curatedTracksPlaylist = await getUserPlaylist('Curated Tracks', [
    ...userPlaylists.filter((userPlaylist) => {
      return userPlaylist.owner.id == user.id
    }),
  ])

  await followPlaylist(
    nicheTracksPlaylist,
    nicheTracks.map((item) => item.track),
  )
  await followPlaylist(curatedTracksPlaylist, curatedTracks)
}

export async function followPlaylist(
  playlist: SimplifiedPlaylist,
  newPlaylistTracks: TrackItem[],
) {
  const spotify = await SpotifyApiSingleton.getInstance()
  const existingTracks = (await getPlaylistTracks(playlist.id)).map(
    (track) => track.track,
  )

  const tracksToRemove = [...existingTracks].filter(
    (existingTrack) =>
      !newPlaylistTracks.some(
        (newPlaylistTrack) => newPlaylistTrack.id === existingTrack.id,
      ),
  )

  const tracksToAdd = newPlaylistTracks.filter(
    (newPlaylistTrack) =>
      !existingTracks.some(
        (existingTrack) => existingTrack.id === newPlaylistTrack.id,
      ),
  )

  const tracksToAddArrays = [...Array(Math.ceil(tracksToAdd.length / 100))].map(
    () => tracksToAdd.splice(0, 100),
  )

  for (const tracksArray of tracksToAddArrays) {
    const uris = tracksArray.map((track) => {
      console.log(chalk.green(`Adding ${track.name} to ${playlist.name}`))
      return track.uri
    })
    await spotify.playlists.addItemsToPlaylist(playlist.id, uris)
  }

  const tracksToRemoveArrays = [
    ...Array(Math.ceil(tracksToRemove.length / 100)),
  ].map(() => tracksToRemove.splice(0, 100))

  for (const tracksArray of tracksToRemoveArrays) {
    const uris = tracksArray.map((track) => {
      console.log(chalk.red(`Removing ${track.name} from ${playlist.name}`))
      return { uri: track.uri }
    })
    await spotify.playlists.removeItemsFromPlaylist(playlist.id, {
      tracks: uris,
    })
  }
}

async function getUniqueTracksFromPlaylists(
  playlists: SimplifiedPlaylist[],
): Promise<TrackItem[]> {
  const uniqueTracks: TrackItem[] = []
  const uniqueTracksIDs: string[] = []

  for (const playlist of playlists) {
    const tracks = await getPlaylistTracks(playlist.id)
    console.log(`Searching ${playlist.name} for unique tracks`)
    tracks
      .filter((track) => {
        return !uniqueTracksIDs.includes(track.track.id)
      })
      .map((track) => {
        uniqueTracks.push(track.track)
        uniqueTracksIDs.push(track.track.id)
      })
  }

  return uniqueTracks
}

export async function getUserPlaylist(
  playlistName: string,
  userPlaylists: SimplifiedPlaylist[],
) {
  const spotify = await SpotifyApiSingleton.getInstance()
  const user = await spotify.currentUser.profile()

  for (const userPlaylist of userPlaylists) {
    if (
      userPlaylist.owner.uri === user.uri &&
      userPlaylist.name === playlistName
    ) {
      return userPlaylist
    }
  }

  console.log(chalk.green(`Creating playist ${playlistName}`))

  return await spotify.playlists.createPlaylist(user.id, {
    name: playlistName,
    collaborative: false,
    public: true,
    description: '',
  })
}
