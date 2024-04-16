import { processManagedPlaylists } from './lib/playlists/process-managed-playlist.js'

import { processDanglingTracks } from './lib/playlists/process-dangling-tracks.js'
import { managedPlaylists } from '../data/managedPlaylists.js'
import { login } from './lib/login/login.js'
import { createAPI } from './lib/spotify-api/create-api.js'

await createAPI()

// await processManagedPlaylists(managedPlaylists)
// await processDanglingTracks()
// login()
