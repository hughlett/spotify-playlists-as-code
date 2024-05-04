import { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk'
import chalk from 'chalk'
import SpotifyAPISingleton from '../spotify-api/index.js'

export default async function getUserPlaylist(
  playlistName: string,
  userPlaylists: SimplifiedPlaylist[],
) {
  const spotify = await SpotifyAPISingleton.getInstance()
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
