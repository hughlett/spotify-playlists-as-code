import { SpotifyApiSingleton } from '../spotify-api/create-api.js'

export default async function healthcheck() {
  const spotify = await SpotifyApiSingleton.getInstance()
  await spotify.currentUser.profile()
}
