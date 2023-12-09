import fs from 'fs'
import YAML from 'yaml'

const file = fs.readFileSync('./playlists/playlist.yml', 'utf8')
console.log(YAML.parse(file))
