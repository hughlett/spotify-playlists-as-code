import { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk'
import chalk from 'chalk'
import SpotifyAPISingleton from '../spotify-api/index.js'

/**
 * Retrieves a user playlist by name from a list of user playlists.
 * If the playlist is not found, it creates a new playlist with the given name.
 *
 * @param {string} playlistName - The name of the playlist to retrieve or create.
 * @param {SimplifiedPlaylist[]} userPlaylists - The list of user playlists to search in.
 * @returns {Promise<SimplifiedPlaylist>} - The retrieved or created user playlist.
 */
export default async function getUserPlaylist(
  playlistName: string,
  userPlaylists: SimplifiedPlaylist[],
): Promise<SimplifiedPlaylist> {
  const spotify = await SpotifyAPISingleton.getInstance()
  const user = await SpotifyAPISingleton.getUserProfile()

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
