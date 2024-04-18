import { managedPlaylists } from '../../data/managedPlaylists.js'
import { processManagedPlaylists } from '../../src/playlists/process-managed-playlist.js'

await processManagedPlaylists(managedPlaylists)
