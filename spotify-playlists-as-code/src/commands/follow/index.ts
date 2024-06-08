import { followManagedPlaylists } from '../../playlists/follow/follow-managed-playlists.js'
import { followCuratedPlaylists } from '../../playlists/follow/follow-personalised-playlists.js'

await followManagedPlaylists()
await followCuratedPlaylists()
