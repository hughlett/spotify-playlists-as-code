import { readFileSync } from 'fs'
import { parse } from 'yaml'

export function getCatalogsConfig(): CatalogsConfig {
  return parse(
    readFileSync('/spotify-playlists-as-code/data/catalogs.yml', 'utf8'),
  )
}

export type CatalogsConfig = {
  dangling_tracks: DanglingTracksConfig
  curated_tracks: CuratedTracksConfig
}

export function getCuratedTracksConfig(): CuratedTracksConfig {
  return getCatalogsConfig().curated_tracks
}

export type CuratedTracksConfig = {
  name: string
  description: string
  enable: boolean
}

export function getDanglingTracksConfig(): DanglingTracksConfig {
  return getCatalogsConfig().dangling_tracks
}

export type DanglingTracksConfig = {
  name: string
  description: string
  enable: boolean
}
