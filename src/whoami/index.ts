import { SpotifyApiSingleton } from '../spotify-api/create-api.js'

export default async function whoami() {
  const spotify = await SpotifyApiSingleton.getInstance()
  const user = await spotify.currentUser.profile()
  console.log(user.display_name)
}
