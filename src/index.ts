import {
  PlaylistedTrack,
  SimplifiedArtist,
  TrackItem,
} from '@spotify/web-api-ts-sdk'
import getAllPlaylists from './lib/playlists/get-all-user-playlists.js'
import { createAPI } from './lib/spotify-api/create-api.js'
import getLikedTracks from './lib/tracks/get-user-liked-tracks.js'
import getPlaylistTracks from './lib/tracks/get-playlist-tracks.js'
import chalk from 'chalk'

const userLikedTracks = await getLikedTracks()
const userPlaylists = await getAllPlaylists()
const spotify = await createAPI()
const user = await spotify.currentUser.profile()

type ManagedPlaylist = {
  artists: string[]
  name?: string
}

const managedPlaylists: ManagedPlaylist[] = [
  { artists: ['Mac Miller'] },
  { artists: ['A$AP Rocky'] },
  { artists: ['Gorillaz'] },
  { artists: ['21 Savage'] },
  { artists: ['Young Thug'] },
  {
    artists: [
      'Three 6 Mafia',
      'Juicy J',
      'Project Pat',
      'DJ Paul',
      'Lord Infamous',
    ],
    name: 'Three 6 Mafia',
  },
  { artists: ['Kendrick Lamar'] },
  { artists: ['A Tribe Called Quest', 'Q-Tip'], name: 'A Tribe Called Quest' },
  { artists: ['Wiz Khalifa'] },
  { artists: ['Bob Marley & The Wailers', 'The Wailers'], name: 'Bob Marley' },
  { artists: ['Drake'] },
  { artists: ['Snoop Dogg'] },
  { artists: ['Anderson .Paak'] },
  { artists: ['Westside Gunn'] },
  { artists: ['Future'] },
  { artists: ['Slum Village'] },
  { artists: ['Coolio'] },
  { artists: ['Childish Gambino'], name: 'Gambino' },
  { artists: ['Jay-Z'] },
  { artists: ['2 Chainz'] },
  { artists: ['Kodak Black'], name: 'Kodak' },
  { artists: ['Playboi Carti'], name: 'Carti' },
  { artists: ['Outkast', 'André 3000', 'Big Boi'], name: 'Outkast' },
  { artists: ['Freddie Gibbs'] },
  { artists: ['Lil Wayne', 'Lil Waye'] },
  {
    artists: [
      'A$AP Mob',
      'A$AP Rocky',
      'A$AP Ferg',
      'A$AP Twelvyy',
      'A$AP NAST',
      'A$AP ANT',
    ],
    name: 'A$AP Mob',
  },
  { artists: ['Macabre Plaza'] },
  { artists: ['Aphex Twin'] },
  { artists: ['Kool & The Gang'] },
  { artists: ['Isaac Hayes'] },
  { artists: ['Common'] },
  { artists: ['Ms. Lauryn Hill', 'Fugees'], name: 'Fugees' },
  { artists: ['Wee'] },
  { artists: ['The Weeknd'] },
  { artists: ['Vince Guaraldi'] },
  { artists: ['Tom Petty'] },
  { artists: ['T-Dre'] },
  { artists: ['Tame Impala'] },
  { artists: ['Stevie Wonder'] },
  { artists: ['Stevie Ray Vaughan'] },
  { artists: ['Steely Dan'] },
  { artists: ['Santana'] },
  { artists: ['Rush'] },
  { artists: ['The Rolling Stones'] },
  { artists: ['Rick Ross'] },
  { artists: ['Ramones'] },
  { artists: ['Pusha T'] },
  { artists: ['Post Malone'] },
  { artists: ['Simon & Garfunkel', 'Paul Simon'], name: 'Simon & Garfunkel' },
  { artists: ['N.E.R.D'] },
  { artists: ['Nas'] },
  { artists: ['MF DOOM', 'King Geedorah', 'Doom'], name: 'DOOM' },
  { artists: ['MED'] },
  { artists: ['Led Zeppelin'] },
  { artists: ['J Dilla', 'Jay Dee'], name: 'J Dilla' },
  { artists: ['Joey Bada$$'] },
  {
    artists: [
      'Wu-Tang Clan',
      'GZA',
      'Method Man',
      'RZA',
      'Ghostface Killah',
      'Prince Rakeem',
      'Inspectah Deck',
      'Raekwon',
      `Ol' Dirty Bastard`,
      'Masta Killa',
    ],
    name: 'Wu-Tang Clan',
  },
  { artists: ['Funkadelic'] },
  { artists: ['Dr. Dre'] },
  { artists: ['Madlib', 'Quasimoto'], name: 'Madlib' },
  { artists: ['Dorothy Ashby'] },
  { artists: ['The Band'] },
  { artists: ['America'] },
  { artists: ['Frank Ocean'] },
  { artists: ['Lil Uzi Vert'], name: 'Uzi' },
  { artists: ['Fleetwood Mac'] },
  { artists: ['Gucci Mane'] },
  { artists: ['Grateful Dead'] },
  { artists: ['Jimi Hendrix'] },
  { artists: ['Eminem'] },
  { artists: ['Richie Havens'] },
  {
    artists: ['Pink Floyd', 'David Gilmour', 'Roger Waters'],
    name: 'Pink Floyd',
  },
  { artists: ['Daft Punk'] },
  { artists: ['Cortex'] },
  { artists: ['Creedence Clearwater Revival'], name: 'Creedence' },
  { artists: ['The Clash'] },
  { artists: ['Black Sabbath'] },
  { artists: ['Tyler, The Creator'], name: 'Tyler' },
  { artists: ['Kanye West'], name: 'Kanye' },
  {
    artists: [
      'The Beatles',
      'George Harrison',
      'Paul McCartney',
      'John Lennon',
    ],
    name: 'The Beatles',
  },
  { artists: ['The Beach Boys'] },
  { artists: ['Travis Scott'] },
  { artists: ['Chance the Rapper'], name: 'Chance' },
  { artists: ['UGK', 'Pimp C', 'Bun B'], name: 'UGK' },
]

async function playlistAlreadyExists(playlistName: string) {
  for (const userPlaylist of userPlaylists) {
    if (
      userPlaylist.owner.uri === user.uri &&
      userPlaylist.name === playlistName
    ) {
      return userPlaylist
    }
  }

  return false
}

function playlistContainsTrack(
  playlist: PlaylistedTrack<TrackItem>[],
  trackID: string,
) {
  for (const track of playlist) {
    if (track.track.id === trackID) {
      return true
    }
  }
  return false
}

function isLikedTrack(track: PlaylistedTrack<TrackItem>) {
  for (const likedTrack of userLikedTracks) {
    if (likedTrack.track.uri === track.track.uri) {
      return true
    }
  }
  return false
}

function songMeetsCriteria(
  songArtists: SimplifiedArtist[],
  playlistArtists: string[],
) {
  for (const artist of songArtists) {
    if (playlistArtists.includes(artist.name)) {
      return true
    }
  }
}

for (const managedPlaylist of managedPlaylists) {
  const managedPlaylistName = managedPlaylist.name || managedPlaylist.artists[0]

  // Get the playlist or create it

  let playlist = await playlistAlreadyExists(managedPlaylistName)

  if (playlist === false) {
    playlist = await spotify.playlists.createPlaylist(user.id, {
      name: managedPlaylistName,
      collaborative: false,
      public: true,
      description: '',
    })

    console.log(chalk.green(`Created playist ${managedPlaylistName}`))
  }

  const tracks = await getPlaylistTracks(playlist.id)

  // Remove any unliked songs from the playlist.

  const URIsToRemove: Array<{
    uri: string
  }> = []
  const removedTracks = []
  for (const track of tracks) {
    if (track.is_local || isLikedTrack(track)) {
      continue
    }

    URIsToRemove.push({ uri: track.track.uri })
    removedTracks.push(track)
  }

  if (URIsToRemove.length > 0) {
    await spotify.playlists.removeItemsFromPlaylist(playlist.id, {
      tracks: URIsToRemove,
    })

    for (const removedTrack of removedTracks) {
      console.log(
        chalk.red(`Removed ${removedTrack.track.name} from ${playlist.name}`),
      )
    }
  }

  // Search for and add any liked songs that match the playlist criteria that aren't already present.

  const URIsToAdd: string[] = []
  const addedTracks = []

  for (const likedTrack of userLikedTracks) {
    if (
      playlistContainsTrack(tracks, likedTrack.track.id) ||
      URIsToAdd.includes(likedTrack.track.uri) ||
      !songMeetsCriteria(likedTrack.track.artists, managedPlaylist.artists)
    ) {
      continue
    }

    URIsToAdd.push(likedTrack.track.uri)
    addedTracks.push(likedTrack)
  }

  if (URIsToAdd.length > 0) {
    for (const addedTrack of addedTracks) {
      console.log(
        chalk.green(`Added ${addedTrack.track.name} to ${playlist.name}`),
      )
    }
    await spotify.playlists.addItemsToPlaylist(playlist.id, URIsToAdd)
  }
}
