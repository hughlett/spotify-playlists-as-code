import { Command } from '@oclif/core'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { stringify } from 'yaml'

import getLikedTracks from '../../lib/tracks/get-liked-tracks.js'

export default class BackUp extends Command {
  static args = {}

  static description = 'Test'

  static examples = []

  static flags = {}

  async run(): Promise<void> {
    const BackUpPath = `${process.cwd()}/backup/liked-songs.yml`
    const likedSongs = await getLikedTracks()

    mkdirSync(dirname(BackUpPath), { recursive: true })
    writeFileSync(BackUpPath, stringify(likedSongs))
  }
}
