import { existsSync } from 'fs'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { managedPlaylists } from '../../data/managedPlaylists.js'
import { processDanglingTracks } from '../../src/playlists/process-dangling-tracks.js'
import { processManagedPlaylists } from '../../src/playlists/process-managed-playlist.js'

if (
  !existsSync('/spac/data/managedPlaylists.ts') &&
  !existsSync('../../data/managedPlaylists.ts')
) {
  throw new Error('No managed playlists!')
}

await processManagedPlaylists(managedPlaylists)
await processDanglingTracks()
