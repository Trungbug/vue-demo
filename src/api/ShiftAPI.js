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
   * createdby: Bảo Trung
   */
  getPaging(pageSize, pageNumber, search, sort) {
    // Khớp với hàm GetPaged trong ShiftController
    return APIConfig.get(this.controller, {
      params: {
        pageSize,
        pageNumber,
        search,
        sort,
      },
    })
  }

  /**
   * Cập nhật trạng thái hàng loạt
   * @param {Array} ids Danh sách ID
   * @param {int} status Trạng thái mới (0 hoặc 1)
   * createdby: Bảo Trung
   */
  bulkUpdateStatus(ids, status) {
    return APIConfig.put(`${this.controller}/bulk-status`, {
      ids,
      status,
    })
  }

  // Các hàm insert, update, delete đã được kế thừa từ BaseAPI
}

// Xuất ra một instance để dùng chung
export default new ShiftAPI()
