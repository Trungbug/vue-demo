import APIConfig from './APIConfig.js'

export default class BaseAPI {
  // Biến khởi tạo controller API
  controller = null

  /**
   * Hàm get by ID
   * @param {*} payload
   * @returns
   */
  getByID(id) {
    return APIConfig.get(`${this.controller}?id=${id}`)
  }
  /**
   * Hàm paging
   * @param {*} payload
   * @returns
   */
  paging(payload) {
    return APIConfig.post(`${this.controller}/paging`, payload)
  }
  /**
   * Hàm save
   * @param {*} payload
   * @returns
   */
  save(payload) {
    return APIConfig.post(`${this.controller}/save`, payload)
  }
}
