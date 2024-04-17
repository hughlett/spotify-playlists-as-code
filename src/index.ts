import { processManagedPlaylists } from './lib/playlists/process-managed-playlist.js'

import { processDanglingTracks } from './lib/playlists/process-dangling-tracks.js'
import { managedPlaylists } from '../data/managedPlaylists.js'
import { login } from './lib/login/login.js'
import { createAPI } from './lib/spotify-api/create-api.js'

const spotify = await createAPI()

const user = await spotify.currentUser.profile()

console.log(user.display_name)

// await processManagedPlaylists(managedPlaylists)
// await processDanglingTracks()
