import { processManagedPlaylists } from './lib/playlists/process-managed-playlist.js'
import { processDanglingTracks } from './lib/playlists/process-dangling-tracks.js'
import { managedPlaylists } from '../data/managedPlaylists.js'

await processManagedPlaylists(managedPlaylists)
await processDanglingTracks()
