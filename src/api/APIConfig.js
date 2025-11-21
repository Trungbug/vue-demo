/**
 * API axios instance cấu hình chung cho toàn bộ project
 * @module APIConfig
 * createdby: Bảo Trung
 */
import axios from 'axios'

const baseURL = 'https://localhost:7248/api'

/**
 * Tạo instance axios với cấu hình mặc định
 * @type {import('axios').AxiosInstance}
 * createdby: Bảo Trung
 */
let api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Thêm interceptor để xử lý response chung (nếu cần xử lý error/generic)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // có thể log hoặc xử lý các mã lỗi chung ở đây
    return Promise.reject(error)
  },
)

export default api
