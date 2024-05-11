// import SpotifyAPISingleton from '../../spotify-api/index.js'

import SpotifyAPISingleton from '../../spotify-api/index.js'
import getLikedTracks from '../../tracks/get-user-liked-tracks.js'

// const spotify = await SpotifyAPISingleton.getInstance()

// // Get genres for each artist.

// const artist = await spotify.artists.get('')
// const genres = artist.genres

// // Get a track's release date.
// const track = await spotify.tracks.get('')
// const trackReleaseDate = track.album.release_date

const likedTracks = await getLikedTracks()
const spotify = await SpotifyAPISingleton.getInstance()

const artistsIDs: string[] = likedTracks
  // @ts-ignore
  .map((track) => track.track.artists)
  .flat()
  .filter(onlyUnique)
  .map((artist) => artist.id)

const artistsArrays = [...Array(Math.ceil(artistsIDs.length / 50))].map(() =>
  artistsIDs.splice(0, 50),
)

let allGenres: any[] = []
for (const artistsArray of artistsArrays) {
  const artistData = await spotify.artists.get(artistsArray)

  artistData.map((data) => (allGenres = [...allGenres, data.genres]))
}

const usersGenres = allGenres
  .flat()
  .filter(onlyUnique)
  .map((genre) => {
    console.log(genre)
    return genre
  })

// @ts-ignore
function onlyUnique(value, index, array) {
  return array.indexOf(value) === index
}
