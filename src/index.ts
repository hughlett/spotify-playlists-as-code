import {
  ManagedPlaylist,
  processManagedPlaylists,
} from './lib/playlists/process-managed-playlist.js'

import { processDanglingTracks } from './lib/playlists/process-dangling-tracks.js'
import { login } from './lib/login/login.js'

import { managedPlaylists } from '../data/managedPlaylists.js'

// login()

await processManagedPlaylists(managedPlaylists)

// await processDanglingTracks()
