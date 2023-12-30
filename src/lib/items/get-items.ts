import { Presets, SingleBar } from 'cli-progress'

import { createAPI } from '../spotify-api/create-api.js'

async function getItems(urls: string[], total: number) {
  const spotify = await createAPI()
  const accessToken = await spotify.getAccessToken()

  if (!accessToken) {
    throw new Error('Not logged in.')
  }

  const requests = urls.map((url) =>
    fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken.access_token}`,
      },
      method: 'GET',
    }),
  )

  let items: any[] = []

  const progressBar = new SingleBar({}, Presets.shades_classic)
  progressBar.start(total, 0)

  await Promise.all(
    requests.map(async (request) => {
      const response = await request
      const body = await response.json()
      items = [...items, ...body.items]
      progressBar.increment(body.items.length)
    }),
  )

  progressBar.stop()
  return items
}

export default getItems
