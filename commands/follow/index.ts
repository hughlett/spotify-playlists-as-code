import { followManagedPlaylists } from '../../src/playlists/follow/follow-managed-playlists.js'
import { followCuratedPlaylists } from '../../src/playlists/follow/follow-personalised-playlists.js'
import getManagedPlaylists from '../../src/playlists/get-managed-playlists.js'

await followManagedPlaylists(getManagedPlaylists())
await followCuratedPlaylists()
