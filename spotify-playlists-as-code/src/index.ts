import { writeFileSync } from 'fs'
import { SimplifiedPlaylist, TrackItem } from '@spotify/web-api-ts-sdk'
import SpotifyAPISingleton from './spotify-api/index.js'

export async function downloadcovertart(
  managedPlaylistTracks: TrackItem[],
  playlist: SimplifiedPlaylist,
  managedPlaylistName: string,
) {
  const trackWithArtist = managedPlaylistTracks.find((track) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    track.artists.find((artist) => artist.name === playlist.name),
  )

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const artistID: string = trackWithArtist?.artists.find(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (artist) => artist.name === playlist.name,
  ).id

  const spotify = await SpotifyAPISingleton.getInstance()

  const artist = await spotify.artists.get(artistID)

  const artistImages = artist.images

  const existingPlaylistCoverImage = await (
    await fetch(
      (await spotify.playlists.getPlaylistCoverImage(playlist.id))[0].url,
    )
  ).arrayBuffer()

  const existingPlaylistCoverImageBase64 = Buffer.from(
    existingPlaylistCoverImage,
  ).toString('base64')

  let playlistCoverImage: string | undefined

  for (const artistImage of artistImages) {
    const artistImageData = await (await fetch(artistImage.url)).arrayBuffer()
    const artistImageDataBase64 =
      Buffer.from(artistImageData).toString('base64')
    if (
      artistImageDataBase64.length / 1000 <= 256 &&
      existingPlaylistCoverImageBase64 !== artistImageDataBase64
    ) {
      playlistCoverImage = artistImageDataBase64
      break
    }
  }

  if (!playlistCoverImage) {
    return
  }

  writeFileSync(
    `./data/covers/${managedPlaylistName}.png`,
    playlistCoverImage,
    'base64',
  )
}
