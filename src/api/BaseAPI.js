import APIConfig from './APIConfig.js'

export default class BaseAPI {
  // Biến khởi tạo controller API
  controller = null

  /**
   * Hàm get by ID
   * @param {string} id
   * @returns (Promise)
   * createdby: Bảo Trung
   */
  getByID(id) {
    // BE chưa có hàm này trong BaseController, nhưng bạn có thể thêm nếu muốn
    return APIConfig.get(`${this.controller}/${id}`)
  }

  /**
   * Hàm lấy danh sách (thay thế cho paging cũ)
   * @param {object} params (VD: { pageSize, pageNumber, search })
   * @returns (Promise)
   * createdby: Bảo Trung
   */
  get(params) {
    return APIConfig.get(this.controller, { params: params })
  }

  /**
   * Hàm thêm mới (thay thế cho save)
   * @param {object} entity
   * @returns (Promise)
   * createdby: Bảo Trung
   */
  insert(entity) {
    return APIConfig.post(this.controller, entity)
  }

  /**
   * Hàm cập nhật
   * @param {string} id
   * @param {object} entity
   * @returns (Promise)
   * createdby: Bảo Trung
   */
  update(id, entity) {
    return APIConfig.put(`${this.controller}/${id}`, entity)
  }

  /**
   * Hàm xóa
   * @param {string} id
   * @returns (Promise)
   * createdby: Bảo Trung
   */
  delete(id) {
    return APIConfig.delete(`${this.controller}/${id}`)
  }
  /**
   * Cập nhật trạng thái hàng loạt
   * @param {Array} ids Danh sách ID
   * @param {int} status Trạng thái mới (0 hoặc 1)
   * createdby: Bảo Trung
   */
  deleteMany(ids) {
    return APIConfig.delete(`${this.controller}/delete-many`, {
      data: { ids: ids },
    })
  }

  // Các hàm insert, update, delete đã được kế thừa từ BaseAPI
}
