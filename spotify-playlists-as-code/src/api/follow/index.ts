import { followManagedPlaylists } from '../../lib/playlists/follow/follow-managed-playlists.js'
import { followCuratedPlaylists } from '../../lib/playlists/follow/follow-personalised-playlists.js'

await followManagedPlaylists()
await followCuratedPlaylists()
