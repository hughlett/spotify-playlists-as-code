// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { managedPlaylists } from '../../data/managedPlaylists.js'
import { followManagedPlaylists } from '../../src/follow/follow-managed-playlists.js'
import { followCuratedPlaylists } from '../../src/follow/follow-personalised-playlists.js'

await followManagedPlaylists([...managedPlaylists])
await followCuratedPlaylists()
