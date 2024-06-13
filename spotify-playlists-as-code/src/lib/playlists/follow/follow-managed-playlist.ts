import {
  PlaylistedTrack,
  SimplifiedPlaylist,
  TrackItem,
  UserProfile,
} from '@spotify/web-api-ts-sdk'
import { ManagedPlaylist } from '../../data/get-managed-playlists.js'
import {
  getManagedPlaylistName,
  songMeetsCriteria,
} from './follow-managed-playlists.js'
import { getUserPlaylist } from './follow-personalised-playlists.js'
import { followPlaylist } from './follow-playlist.js'

/**
 * Follows a managed playlist by performing the following steps:
 * 1. Retrieves the managed playlist name.
 * 2. Logs a message indicating the playlist being followed.
 * 3. Retrieves the user playlist matching the managed playlist name.
 * 4. Filters the user liked tracks based on the criteria defined by the managed playlist.
 * 5. Follows the playlist by adding the filtered tracks to the playlist.
 * 6. Updates the cover art of the playlist.
 *
 * @param managedPlaylist - The managed playlist to follow.
 * @param userLikedTracks - The user's liked tracks.
 * @param userPlaylists - The user's playlists.
 * @param user - The user's profile.
 */
export async function followManagedPlaylist(
  managedPlaylist: ManagedPlaylist,
  userLikedTracks: PlaylistedTrack<TrackItem>[],
  userPlaylists: SimplifiedPlaylist[],
  user: UserProfile,
) {
  const managedPlaylistName = getManagedPlaylistName(managedPlaylist)

  console.log(`Following ${managedPlaylistName}`)

  const playlist = await getUserPlaylist(managedPlaylistName, [
    ...userPlaylists.filter((userPlaylist) => userPlaylist.owner.id == user.id),
  ])

  const managedPlaylistTracks = [
    ...userLikedTracks.filter((userLikedTrack) =>
      songMeetsCriteria(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        userLikedTrack.track.artists,
        managedPlaylist.artists,
      ),
    ),
  ].map((track) => track.track)

  await followPlaylist(
    playlist,
    [...managedPlaylistTracks],
    managedPlaylistName,
    `Liked songs by ${formatNames(managedPlaylist.artists)}.`,
  )

  // await updateCoverArt(managedPlaylistTracks, playlist, managedPlaylistName)
}

function formatNames(names: string[]) {
  if (names.length === 0) {
    return ''
  } else if (names.length === 1) {
    return names[0]
  } else {
    const last = names.pop()
    return `${names.join(', ')} and ${last}`
  }
}
