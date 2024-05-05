import {
  PlaylistedTrack,
  SimplifiedArtist,
  SimplifiedPlaylist,
  TrackItem,
  UserProfile,
} from '@spotify/web-api-ts-sdk'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ManagedPlaylist } from '../../data/managedPlaylists.js'
import getAllPlaylists from '../playlists/get-all-user-playlists.js'
import SpotifyAPISingleton from '../spotify-api/index.js'
import getLikedTracks from '../tracks/get-user-liked-tracks.js'
import { getUserPlaylist } from './follow-personalised-playlists.js'
import { followPlaylist } from './follow-playlist.js'

/**
 * Process an array of managed playlists.
 * @param managedPlaylists Managed playlists to process.
 */
export async function followManagedPlaylists(
  managedPlaylists: ManagedPlaylist[],
) {
  const spotify = await SpotifyAPISingleton.getInstance()
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
    await Promise.all(
      array.map((managedPlaylist) =>
        processManagedPlaylist(
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
    ...userPlaylists.filter((userPlaylist) => userPlaylist.owner.id == user.id),
  ])

  const managedPlaylistTracks = userLikedTracks
    .filter((userLikedTrack) =>
      songMeetsCriteria(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        userLikedTrack.track.artists,
        managedPlaylist.artists,
      ),
    )
    .map((track) => track.track)

  await followPlaylist(playlist, [...managedPlaylistTracks])

  await updateCoverArt(managedPlaylistTracks, playlist, managedPlaylistName)
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

async function updateCoverArt(
  managedPlaylistTracks: TrackItem[],
  playlist: SimplifiedPlaylist,
  managedPlaylistName: string,
) {
  const trackWithArtist = managedPlaylistTracks.find((track) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    track.artists.find((artist) => artist.name === playlist.name),
  )

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const artistID: string = trackWithArtist?.artists.find(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (artist) => artist.name === playlist.name,
  ).id

  const spotify = await SpotifyAPISingleton.getInstance()

  const artistImages = (await spotify.artists.get(artistID)).images

  const existingPlaylistCoverImage = await (
    await fetch(
      (await spotify.playlists.getPlaylistCoverImage(playlist.id))[0].url,
    )
  ).arrayBuffer()

  const existingPlaylistCoverImageBase64 = Buffer.from(
    existingPlaylistCoverImage,
  ).toString('base64')

  let playlistCoverImage: string | undefined

  for (const artistImage of artistImages) {
    const artistImageData = await (await fetch(artistImage.url)).arrayBuffer()
    const artistImageDataBase64 =
      Buffer.from(artistImageData).toString('base64')
    if (
      artistImageDataBase64.length / 1e3 <= 256 &&
      existingPlaylistCoverImageBase64 !== artistImageDataBase64
    ) {
      playlistCoverImage = artistImageDataBase64
      break
    }
  }

  if (!playlistCoverImage) {
    return
  }

  console.log(`Adding new cover image for ${managedPlaylistName}`)

  await spotify.playlists.addCustomPlaylistCoverImageFromBase64String(
    playlist.id,
    playlistCoverImage,
  )
}
