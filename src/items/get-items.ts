import { SingleBar } from 'cli-progress'
import { SpotifyApiSingleton } from '../spotify-api/create-api.js'

async function getItems(urls: string[], total: number, progressBar: SingleBar) {
  const spotify = await SpotifyApiSingleton.getInstance()
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let items: any[] = []

  // Divide the array into arrays of size BATCH_SIZE
  const BATCH_SIZE = 3
  const itemsArrays = [...Array(Math.ceil(requests.length / BATCH_SIZE))].map(
    () => requests.splice(0, BATCH_SIZE),
  )

  // progressBar.start(total, 0)

  for (const itemArray of itemsArrays) {
    await Promise.all(
      itemArray.map(async (request) => {
        const response = await request
        const body = await response.json()
        if (body.items) {
          items = [...items, ...body.items]
          progressBar.increment(body.items.length)
        }
      }),
    )
  }

  // progressBar.stop()
  return items
}

export default getItems
