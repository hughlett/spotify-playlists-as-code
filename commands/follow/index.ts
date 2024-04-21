import { existsSync } from 'fs'
import { processDanglingTracks } from '../../src/playlists/process-dangling-tracks.js'
import run from '../process-managed-playlists/run.js'

if (
  !existsSync('/spac/data/managedPlaylists.ts') &&
  !existsSync('../../data/managedPlaylists.ts')
) {
  throw new Error('No managed playlists!')
}

await run()
await processDanglingTracks()
