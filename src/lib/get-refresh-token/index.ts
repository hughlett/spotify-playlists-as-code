import { SpotifyApiSingleton, createAPI } from '../spotify-api/create-api.js'

const spotify = await SpotifyApiSingleton.getInstance()
const result = await spotify.currentUser.profile()
console.log(result.display_name)
