// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { managedPlaylists } from '../../data/managedPlaylists.js'
import { followDanglingPlaylists } from '../../src/playlists/follow-dangling-playlists.js'
import { followSPaCPlaylists } from '../../src/playlists/follow-spac-playlists.js'

await followSPaCPlaylists(managedPlaylists)
await followDanglingPlaylists()
