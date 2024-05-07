import { followManagedPlaylists } from '../../playlists/follow/follow-managed-playlists.js'
import { followCuratedPlaylists } from '../../playlists/follow/follow-personalised-playlists.js'
import getManagedPlaylists from '../../playlists/get-managed-playlists.js'

await followManagedPlaylists(getManagedPlaylists())
await followCuratedPlaylists()
