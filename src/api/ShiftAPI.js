import APIConfig from './APIConfig.js'
import BaseAPI from './BaseAPI.js'

class ShiftAPI extends BaseAPI {
  constructor() {
    super()
    this.controller = 'Shift' // Khớp với ShiftController.cs
  }

  /**
   * Hàm lấy phân trang ca làm việc
   * @param {int} pageSize
   * @param {int} pageNumber
   * @param {string} search
   * @returns (Promise)
   */
  getPaging(pageSize, pageNumber, search) {
    // Khớp với hàm GetPaged trong ShiftController
    return APIConfig.get(this.controller, {
      params: {
        pageSize,
        pageNumber,
        search,
      },
    })
  }

  // Các hàm insert, update, delete đã được kế thừa từ BaseAPI
}

// Xuất ra một instance để dùng chung
export default new ShiftAPI()
