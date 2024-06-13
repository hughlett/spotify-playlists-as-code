import SpotifyAPISingleton from '../spotify-api/index.js'

/**
 * Retrieves items from the specified URLs using the Spotify API.
 *
 * @param urls - An array of URLs to fetch items from.
 * @returns A promise that resolves to an array of items.
 * @throws An error if the user is not logged in.
 */
async function getItems(urls: string[]) {
  const spotify = await SpotifyAPISingleton.getInstance()
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
  const BATCH_SIZE = 5
  const itemsArrays = [...Array(Math.ceil(requests.length / BATCH_SIZE))].map(
    () => requests.splice(0, BATCH_SIZE),
  )

  for (const itemArray of itemsArrays) {
    await Promise.all(
      itemArray.map(async (request) => {
        const response = await request
        const body = await response.json()
        if (body.items) {
          items = [...items, ...body.items]
        }
      }),
    )
  }

  return items
}

export default getItems
