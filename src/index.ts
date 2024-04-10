import getAllPlaylists from './lib/playlists/get-all-playlists.js'
import getLikedTracks from './lib/tracks/get-liked-tracks.js'
import getPlaylistTracks from './lib/tracks/get-playlist-tracks.js'

const tracks = await getLikedTracks()
