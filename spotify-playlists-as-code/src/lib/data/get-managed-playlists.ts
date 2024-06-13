import { readFileSync } from 'fs'
import { parse } from 'yaml'

function getManagedPlaylistsConfig(): ManagedPlaylistsConfig {
  return parse(
    readFileSync(
      '/spotify-playlists-as-code/data/managed-playlists.yml',
      'utf8',
    ),
  )
}

/**
 * Retrieves the managed playlists.
 *
 * @returns An array of managed playlists.
 */
export default function getManagedPlaylists(): ManagedPlaylist[] {
  return getManagedPlaylistsConfig().playlists || []
}

type ManagedPlaylistsConfig = {
  playlists?: ManagedPlaylist[]
}

/**
 * Represents a managed playlist.
 */
export type ManagedPlaylist = {
  artists: string[]
  name?: string
  description?: string
  enable?: boolean
}
