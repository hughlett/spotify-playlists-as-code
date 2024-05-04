import SpotifyAPISingleton from '../spotify-api/index.js'

export default async function healthcheck() {
  const spotify = await SpotifyAPISingleton.getInstance()
  await spotify.currentUser.profile()
}
