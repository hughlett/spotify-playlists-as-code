import { managedPlaylists } from '../data/managedPlaylists.js'
import { processDanglingTracks } from './lib/playlists/process-dangling-tracks.js'
import { processManagedPlaylists } from './lib/playlists/process-managed-playlist.js'

async function run() {
  await processManagedPlaylists(managedPlaylists)
  await processDanglingTracks()
}

await run()
