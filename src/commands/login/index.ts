import { Command } from '@oclif/core'

import { login } from '../../lib/login/login.js'

export default class Login extends Command {
  static args = {}

  static description = 'Login'

  static examples = []

  static flags = {}

  async run(): Promise<void> {
    login()
  }
}
