import { readFileSync } from 'fs'
import { parse } from 'yaml'
import { ManagedPlaylist } from './managed-playlist.js'

/**
 * Retrieves the managed playlists.
 *
 * @returns An array of managed playlists.
 */
export default function getManagedPlaylists(): ManagedPlaylist[] {
  return parse(readFileSync('/spac/data/managed-playlists.yml', 'utf8'))
    .playlists
}
