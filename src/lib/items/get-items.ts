import axios from 'axios'
import { Presets, SingleBar } from 'cli-progress'

import { createAPI } from '../spotify-api/create-api.js'

async function getItems(urls: string[], total: number) {
  const spotify = await createAPI()
  const accessToken = await spotify.getAccessToken()

  if (!accessToken) {
    throw new Error('Not logged in.')
  }

  const requests = urls.map((url) =>
    axios({
      headers: {
        Authorization: `Bearer ${accessToken.access_token}`,
      },
      method: 'GET',
      url,
    }),
  )

  let items: any[] = []

  const progressBar = new SingleBar({}, Presets.shades_classic)
  progressBar.start(total, 0)

  await Promise.all(
    requests.map(async (request) => {
      const response = await request
      items = [...items, ...response.data.items]
      progressBar.increment(response.data.items.length)
    }),
  )

  progressBar.stop()
  return items
}

export default getItems
