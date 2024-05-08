import SpotifyAPISingleton from '../../spotify-api/index.js'

const spotify = await SpotifyAPISingleton.getInstance()

// Get genres for each artist.

const artist = await spotify.artists.get('')
const genres = artist.genres

// Get a track's release date.
const track = await spotify.tracks.get('')
const trackReleaseDate = track.album.release_date
