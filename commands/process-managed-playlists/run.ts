// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { managedPlaylists } from '../../data/managedPlaylists.js'
import { processManagedPlaylists } from '../../src/playlists/process-managed-playlist.js'

export default async function run() {
  if (!managedPlaylists) {
    throw new Error('No managed playlists!')
  }

  await processManagedPlaylists(managedPlaylists)
}
