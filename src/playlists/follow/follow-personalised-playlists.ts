import { SimplifiedPlaylist, TrackItem } from '@spotify/web-api-ts-sdk'
import SpotifyAPISingleton from '../../spotify-api/index.js'
import getPlaylistTracks from '../../tracks/get-playlist-tracks.js'
import getLikedTracks from '../../tracks/get-user-liked-tracks.js'
import getManagedPlaylists from '../get-managed-playlists.js'
import getUserPlaylist from '../get-user-playlist.js'
import getAllPlaylists from '../get-user-playlists.js'
import { ManagedPlaylist } from '../managed-playlist.js'
import { followPlaylist } from './follow-playlist.js'

/**
 * Follows curated playlists based on the user's preferences.
 * This function retrieves the user's playlists, filters them based on certain criteria,
 * and then follows the curated playlists by adding the unique tracks to the corresponding playlists.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export async function followCuratedPlaylists(): Promise<void> {
  const spotify = await SpotifyAPISingleton.getInstance()
  const userPlaylists = await getAllPlaylists()
  const user = await spotify.currentUser.profile()
  const managedPlaylists = getManagedPlaylists()

  const ownedPlaylists: SimplifiedPlaylist[] = [...userPlaylists].filter(
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

  const nicheTracks = likedTracks.filter(
    (likedTrack) =>
      !SPaCTracks.some((spacTrack) => {
        return likedTrack.track.uri == spacTrack.uri
      }) &&
      !curatedTracks.some((spacTrack) => {
        return likedTrack.track.uri == spacTrack.uri
      }),
  )

  // Update playlists

  const nicheTracksPlaylist = await getUserPlaylist('Niche Tracks', [
    ...userPlaylists.filter((userPlaylist) => userPlaylist.owner.id == user.id),
  ])
  const curatedTracksPlaylist = await getUserPlaylist('Curated Tracks', [
    ...userPlaylists.filter((userPlaylist) => userPlaylist.owner.id == user.id),
  ])

  await followPlaylist(
    nicheTracksPlaylist,
    nicheTracks.map((item) => item.track),
  )
  await followPlaylist(curatedTracksPlaylist, curatedTracks)
}

/**
 * Retrieves unique tracks from an array of playlists.
 *
 * @param playlists - An array of SimplifiedPlaylist objects.
 * @returns A Promise that resolves to an array of TrackItem objects representing the unique tracks.
 */
async function getUniqueTracksFromPlaylists(
  playlists: SimplifiedPlaylist[],
): Promise<TrackItem[]> {
  const uniqueTracks: TrackItem[] = []
  const uniqueTracksIDs: string[] = []

  for (const playlist of playlists) {
    const tracks = await getPlaylistTracks(playlist.id)
    console.log(`Searching ${playlist.name} for unique tracks`)
    tracks
      .filter((track) => !uniqueTracksIDs.includes(track.track.id))
      .map((track) => {
        uniqueTracks.push(track.track)
        uniqueTracksIDs.push(track.track.id)
      })
  }

  return uniqueTracks
}
export { getUserPlaylist }
