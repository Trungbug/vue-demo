/**
 * Utils định dạng hiển thị nhỏ
 * Created By NMDUC - 18/11/2025
 */

/**
 * Chuyển giá trị về chuỗi số có phân cách hàng nghìn
 * @param {number|string|null|undefined} v Giá trị đầu vào
 * @returns {string|number} Trả về chuỗi đã format hoặc '-' nếu không có giá trị
 * createdby: Bảo Trung
 */
export const formatNumber = (v) => {
  if (v === null || v === undefined || v === '') return '-'
  const n = Number(v)
  if (Number.isNaN(n)) return v
  return n.toLocaleString()
}

/**
 * Định dạng ngày giờ thành `dd/mm/yyyy hh:MM`
 * @param {string|Date|number} v Giá trị ngày (ISO string, timestamp hoặc Date)
 * @returns {string} Chuỗi định dạng ngày hoặc '-' nếu không có giá trị
 * createdby: Bảo Trung
 */
export const formatDate = (v) => {
  if (!v) return '-'
  // accept ISO string like "2025-08-27T09:33:43.000+07:00"
  const d = new Date(v)
  if (isNaN(d)) return v
  // format: dd/mm/yyyy hh:MM
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yy} ${hh}:${min}`
}

/**
 * Đảm bảo trả về chuỗi, xử lý null/undefined
 * @param {any} v Giá trị bất kỳ
 * @returns {string} Chuỗi hoặc '-' nếu không có giá trị
 * createdby: Bảo Trung
 */
export const formatText = (v) => {
  if (v === null || v === undefined || v === '') return '-'
  return String(v)
}

/**
 * Hàm lấy 2 chữ cái đầu của tên
 * @param {string} name Tên đầy đủ
 * @returns {string} 2 chữ cái đầu
 * createdby: Bảo Trung
 */
export const getInitials = (name) => {
  if (!name || typeof name !== 'string' || name.trim() === '') return '?'
  const words = name.trim().split(/\s+/)
  if (words.length === 1) {
    return words[0][0].toUpperCase()
  }
  if (words.length > 1) {
    const first = words[0][0]
    const last = words[words.length - 1][0]
    return (first + last).toUpperCase()
  }

  return '?'
}

/**
 * Định dạng giờ phút `HH:mm`
 * @param {string} timeStr Chuỗi giờ (HH:mm:ss hoặc HH:mm)
 * @returns {string} Giờ phút
 * createdby: Bảo Trung
 */
export const formatTime = (timeStr) => {
  if (!timeStr) return ''
  if (timeStr.length >= 5) {
    return timeStr.substring(0, 5)
  }
  return timeStr
}

/**
 * Định dạng ngày `dd/mm/yyyy`
 * @param {string|Date} dateStr Giá trị ngày
 * @returns {string} Ngày tháng năm
 * createdby: Bảo Trung
 */
export const formatDateOnly = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Định dạng số nguyên (làm tròn)
 * @param {number|string} v Giá trị
 * @returns {string} Số nguyên hoặc '-'
 * createdby: Bảo Trung
 */
export const formatInteger = (v) => {
  if (v === null || v === undefined || v === '') return '-'
  const n = Number(v)
  if (Number.isNaN(n)) return v
  return Math.round(n).toString()
}

/**
 * Mapper để chuyển đổi response từ Backend sang frontend format
 * Backend trả về các trường với naming convention khác (ví dụ: ShiftCode, Inactive, BeginShiftTime)
 * Frontend mong đợi: shiftCode, shiftStatus, shiftBeginTime
 */

/**
 * Map một Shift object từ backend sang frontend format
 * @param {Object} backendShift - Object từ API backend
 * @returns {Object} - Object với tên trường đúng cho frontend
 * createdby: Bảo Trung
 */
export const mapShiftFromBackend = (backendShift) => {
  if (!backendShift) return null

  return {
    // Map các trường chính
    shiftId: backendShift.ShiftID || backendShift.shiftId,
    shiftCode: backendShift.ShiftCode || backendShift.shiftCode,
    shiftName: backendShift.ShiftName || backendShift.shiftName,
    shiftBeginTime: backendShift.BeginShiftTime || backendShift.shiftBeginTime,
    shiftEndTime: backendShift.EndShiftTime || backendShift.shiftEndTime,
    shiftBeginBreakTime: backendShift.BeginBreakTime || backendShift.shiftBeginBreakTime,
    shiftEndBreakTime: backendShift.EndBreakTime || backendShift.shiftEndBreakTime,
    shiftDescription: backendShift.Description || backendShift.shiftDescription || '',
    shiftStatus:
      backendShift.Inactive !== undefined
        ? backendShift.Inactive
          ? 0
          : 1
        : backendShift.shiftStatus,
    workTimeHours: backendShift.WorkingTime || backendShift.workTimeHours,
    breakTimeHours: backendShift.BreakingTime || backendShift.breakTimeHours,
    createdBy: backendShift.CreatedBy || backendShift.createdBy,
    createdDate: backendShift.CreatedDate || backendShift.createdDate,
    modifiedBy: backendShift.ModifiedBy || backendShift.modifiedBy,
    modifiedDate: backendShift.ModifiedDate || backendShift.modifiedDate,
  }
}

/**
 * Map một danh sách Shifts từ backend
 * @param {Array} backendShifts - Mảng từ API backend
 * @returns {Array} - Mảng với format frontend
 * createdby: Bảo Trung
 */
export const mapShiftsFromBackend = (backendShifts) => {
  if (!Array.isArray(backendShifts)) return []
  return backendShifts.map(mapShiftFromBackend)
}

/**
 * Map một Shift object từ frontend sang backend format để gửi API
 * @param {Object} frontendShift - Object từ form
 * @returns {Object} - Object với tên trường đúng cho backend
 * createdby: Bảo Trung
 */
export const mapShiftToBackend = (frontendShift) => {
  if (!frontendShift) return null

  return {
    shiftId: frontendShift.shiftId,
    shiftCode: frontendShift.shiftCode,
    shiftName: frontendShift.shiftName,
    shiftBeginTime: frontendShift.shiftBeginTime,
    shiftEndTime: frontendShift.shiftEndTime,
    shiftBeginBreakTime: frontendShift.shiftBeginBreakTime,
    shiftEndBreakTime: frontendShift.shiftEndBreakTime,
    shiftDescription: frontendShift.shiftDescription || '',
    shiftStatus: Number(frontendShift.shiftStatus),
    createdBy: frontendShift.createdBy,
    createdDate: frontendShift.createdDate,
    modifiedBy: frontendShift.modifiedBy,
    modifiedDate: frontendShift.modifiedDate,
    workTimeHours: frontendShift.workTimeHours,
    breakTimeHours: frontendShift.breakTimeHours,
  }
}

/**
 * Helper: đảm bảo time string có định dạng HH:mm:ss
 * @param {string} timeStr - Chuỗi thời gian
 * @returns {string|null} - Chuỗi thời gian chuẩn hoặc null
 * createdby: Bảo Trung
 */
export const formatTimeForPayload = (timeStr) => {
  if (!timeStr) return null
  // Nếu có dạng HH:mm => thêm :00
  if (timeStr.length === 5) return `${timeStr}:00`
  // Nếu đã có giây hoặc khác, trả về nguyên bản
  return timeStr
}

/**
 * Hàm parse chuỗi "HH:mm" sang số phút trong ngày
 * @param {string} timeString - Chuỗi thời gian (ví dụ: "08:30")
 * @returns {number} - Số phút từ đầu ngày
 * createdby: Bảo Trung
 */
export const parseTime = (timeString) => {
  if (!timeString) return 0
  const parts = String(timeString).split(':').map(Number)
  if (parts.length < 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) return 0
  const [hours, minutes] = parts
  return hours * 60 + minutes
}

/**
 * Simple UUID v4 generator
 * @returns {string} - UUID string
 * createdby: Bảo Trung
 */
export const generateUUID = () => {
  // RFC4122 version 4 compliant-ish
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
