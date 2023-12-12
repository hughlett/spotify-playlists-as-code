import { Command } from '@oclif/core'

import { createAPI } from '../../lib/spotify-api/create-api.js'

export default class WhoAmI extends Command {
  static args = {}

  static description = 'Test'

  static examples = []

  static flags = {}

  async run(): Promise<void> {
    const api = await createAPI()
    const result = await api.currentUser.profile()
    console.log(result.display_name)
  }
}
