import { followManagedPlaylists } from '../../src/follow/follow-managed-playlists.js'
import { followCuratedPlaylists } from '../../src/follow/follow-personalised-playlists.js'
import getManagedPlaylists from '../../src/playlists/managed-playlists.js'

await followManagedPlaylists(getManagedPlaylists())
await followCuratedPlaylists()
