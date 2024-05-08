import { SimplifiedPlaylist, TrackItem } from '@spotify/web-api-ts-sdk'
import SpotifyAPISingleton from '../spotify-api/index.js'

/**
 * Updates the cover art of a playlist.
 * @param managedPlaylistTracks The tracks of the managed playlist.
 * @param playlist The playlist to update the cover art for.
 * @param managedPlaylistName The name of the managed playlist.
 */

export async function updateCoverArt(
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

  const artistImages = (await spotify.artists.get(artistID)).images

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

  console.log(`Adding new cover image for ${managedPlaylistName}`)

  await spotify.playlists.addCustomPlaylistCoverImageFromBase64String(
    playlist.id,
    playlistCoverImage,
  )
}
