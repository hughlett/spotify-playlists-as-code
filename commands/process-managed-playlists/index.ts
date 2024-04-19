import { existsSync } from 'fs'
import run from './run.js'

if (
  !existsSync('/data/managedPlaylists.ts') &&
  !existsSync('../../data/managedPlaylists.ts')
) {
  throw new Error('No managed playlists!')
}

run()
