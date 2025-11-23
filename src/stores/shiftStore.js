import { defineStore } from 'pinia'
import ShiftAPI from '@/api/ShiftAPI.js'
import {
  mapShiftsFromBackend,
  mapShiftToBackend,
  generateUUID,
  formatTimeForPayload,
} from '@/ultils/formatter.js'

export const useShiftStore = defineStore('shift', {
  // 1. State: Chứa dữ liệu
  state: () => ({
    shifts: [], // Danh sách ca làm việc
    totalRecords: 0, // Tổng số bản ghi
    isLoading: false, // Trạng thái loading (để hiển thị xoay xoay nếu cần)

    // Bộ lọc và phân trang
    filter: {
      pageNumber: 1,
      pageSize: 20,
      searchQuery: '',
      sort: 'createdDate DESC',
      filters: [],
    },
  }),

  actions: {
    /**
     * Xuất khẩu dữ liệu ra file Excel
     */
    async exportData() {
      this.isLoading = true
      try {
        // Lấy tham số search hiện tại từ state filter
        const response = await ShiftAPI.exportExcel(this.filter.searchQuery)

        // Tạo URL tạm thời cho blob dữ liệu
        const url = window.URL.createObjectURL(new Blob([response.data]))

        // Tạo thẻ a ẩn để kích hoạt tải xuống
        const link = document.createElement('a')
        link.href = url

        // Đặt tên file (Backend đã trả về tên, nhưng ta có thể đặt lại ở đây)
        const fileName = `Danh_sach_ca_${new Date().toISOString().slice(0, 10)}.xlsx`
        link.setAttribute('download', fileName)

        document.body.appendChild(link)
        link.click()

        // Dọn dẹp
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        return { success: true, message: 'Xuất khẩu thành công!' }
      } catch (error) {
        console.error(error)
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },
    /**
     * Lấy danh sách ca làm việc từ API
     */
    async fetchShifts() {
      this.isLoading = true
      try {
        const res = await ShiftAPI.getPaging(
          this.filter.pageSize,
          this.filter.pageNumber,
          this.filter.searchQuery,
          this.filter.sort,
          this.filter.filters,
        )

        if (res.data.success) {
          // Map dữ liệu từ Backend sang format Frontend
          this.shifts = mapShiftsFromBackend(res.data.data.data)
          this.totalRecords = res.data.data.totalRecords
        }
      } catch (error) {
        console.error('Lỗi fetch data:', error)
        throw error // Ném lỗi để Component hứng và hiện thông báo
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Thêm mới ca làm việc
     */
    async addShift(formData) {
      this.isLoading = true
      try {
        // Chuẩn bị dữ liệu trước khi gửi (Logic cũ của bạn)
        const payload = { ...formData }
        const now = new Date().toISOString()

        // Xử lý format giờ
        payload.shiftBeginTime = formatTimeForPayload(payload.shiftBeginTime)
        payload.shiftEndTime = formatTimeForPayload(payload.shiftEndTime)
        payload.shiftBeginBreakTime = formatTimeForPayload(payload.shiftBeginBreakTime)
        payload.shiftEndBreakTime = formatTimeForPayload(payload.shiftEndBreakTime)

        // Gán các giá trị mặc định
        payload.shiftId = generateUUID()
        payload.shiftStatus = payload.shiftStatus ?? 1
        payload.createdBy = 'Trương Hoàng Bảo Trung' // Có thể thay bằng user thật sau này
        payload.createdDate = now
        payload.modifiedBy = 'Trương Hoàng Bảo Trung'
        payload.modifiedDate = now

        // Map sang format Backend
        const backendPayload = mapShiftToBackend(payload)

        // Gọi API
        await ShiftAPI.insert(backendPayload)

        // Load lại dữ liệu (về trang 1 để thấy bản ghi mới)
        this.filter.pageNumber = 1
        await this.fetchShifts()

        return { success: true, message: 'Thêm mới thành công!' }
      } catch (error) {
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Cập nhật ca làm việc
     */
    async updateShift(id, formData) {
      this.isLoading = true
      try {
        const payload = { ...formData }
        const now = new Date().toISOString()

        // Xử lý format giờ
        payload.shiftBeginTime = formatTimeForPayload(payload.shiftBeginTime)
        payload.shiftEndTime = formatTimeForPayload(payload.shiftEndTime)
        payload.shiftBeginBreakTime = formatTimeForPayload(payload.shiftBeginBreakTime)
        payload.shiftEndBreakTime = formatTimeForPayload(payload.shiftEndBreakTime)

        payload.modifiedBy = 'Trương Hoàng Bảo Trung'
        payload.modifiedDate = now

        const backendPayload = mapShiftToBackend(payload)

        // Gọi API update
        await ShiftAPI.update(id, backendPayload)

        // Load lại dữ liệu để cập nhật thay đổi
        await this.fetchShifts()

        return { success: true, message: 'Cập nhật thành công!' }
      } catch (error) {
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Xóa 1 bản ghi
     */
    async removeShift(id) {
      try {
        await ShiftAPI.delete(id)

        // Xóa trực tiếp trên UI store để phản hồi nhanh
        this.shifts = this.shifts.filter((s) => s.shiftId !== id)
        this.totalRecords--

        return { success: true, message: 'Xóa thành công!' }
      } catch (error) {
        return { success: false, error }
      }
    },

    /**
     * Xóa nhiều bản ghi
     */
    async removeManyShifts(ids) {
      try {
        await ShiftAPI.deleteMany(ids)

        // Load lại dữ liệu để đảm bảo đồng bộ
        await this.fetchShifts()

        return { success: true, message: 'Xóa thành công!' }
      } catch (error) {
        return { success: false, error }
      }
    },

    /**
     * Cập nhật trạng thái hàng loạt
     */
    async bulkUpdateStatus(ids, status) {
      try {
        await ShiftAPI.bulkUpdateStatus(ids, status)

        // Cập nhật nhanh UI
        this.shifts.forEach((shift) => {
          if (ids.includes(shift.shiftId)) {
            shift.shiftStatus = status
          }
        })

        return { success: true, message: 'Cập nhật trạng thái thành công!' }
      } catch (error) {
        throw error
      }
    },
  },
})
