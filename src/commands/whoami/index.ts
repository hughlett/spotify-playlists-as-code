import { createAPI } from '../../lib/spotify-api/create-api.js'

const spotify = await createAPI()
const result = await spotify.currentUser.profile()
console.log(result.display_name)
