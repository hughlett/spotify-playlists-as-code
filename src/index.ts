import getAllPlaylists from './lib/playlists/get-all-playlists.js'
import getLikedTracks from './lib/tracks/get-liked-tracks.js'
import getPlaylistTracks from './lib/tracks/get-playlist-tracks.js'

const tracks = await getLikedTracks()

export const playlists = {
  playlists: [
    { artists: ['Mac Miller'] },
    { artists: ['A$AP Rocky'] },
    { artists: ['Gorillaz'] },
    { artists: ['21 Savage'] },
    { artists: ['Chance the Rapper'] },
    { artists: ['UGK', 'Pimp C', 'Bun B'], name: 'UGK' },
  ],
}
