import { createAPI } from './spotify-api/createAPI.js'

const api = await createAPI()
const result = await api.currentUser.profile()
console.log(result)
