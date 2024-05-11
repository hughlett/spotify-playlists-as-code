// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { managedPlaylists } from '../../data/managedPlaylists.js'

/**
 * Retrieves the managed playlists.
 *
 * @returns An array of managed playlists.
 */
export default function getManagedPlaylists() {
  return [...managedPlaylists]
}
