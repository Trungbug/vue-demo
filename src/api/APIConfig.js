import axios from 'axios'

const baseURL = 'https://localhost:7248/api'

let api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ...
    return Promise.reject(error)
  },
)

export default api
