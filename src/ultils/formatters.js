/**
 * Mapper để chuyển đổi response từ Backend sang frontend format
 * Backend trả về các trường với naming convention khác (ví dụ: ShiftCode, Inactive, BeginShiftTime)
 * Frontend mong đợi: shiftCode, shiftStatus, shiftBeginTime
 */

/**
 * Map một Shift object từ backend sang frontend format
 * @param {Object} backendShift - Object từ API backend
 * @returns {Object} - Object với tên trường đúng cho frontend
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

    // Map trạng thái: backend gửi "Inactive" (boolean), FE dùng shiftStatus (0/1)
    // Inactive: false => status: 1 (đang sử dụng), Inactive: true => status: 0 (ngưng sử dụng)
    shiftStatus:
      backendShift.Inactive !== undefined
        ? backendShift.Inactive
          ? 0
          : 1
        : backendShift.shiftStatus,

    // Map thời gian làm việc và nghỉ
    workTimeHours: backendShift.WorkingTime || backendShift.workTimeHours,
    breakTimeHours: backendShift.BreakingTime || backendShift.breakTimeHours,

    // Map người tạo/sửa
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
 */
export const mapShiftsFromBackend = (backendShifts) => {
  if (!Array.isArray(backendShifts)) return []
  return backendShifts.map(mapShiftFromBackend)
}

/**
 * Map một Shift object từ frontend sang backend format để gửi API
 * @param {Object} frontendShift - Object từ form
 * @returns {Object} - Object với tên trường đúng cho backend
 */
export const mapShiftToBackend = (frontendShift) => {
  if (!frontendShift) return null

  return {
    ShiftID: frontendShift.shiftId,
    ShiftCode: frontendShift.shiftCode,
    ShiftName: frontendShift.shiftName,
    BeginShiftTime: frontendShift.shiftBeginTime,
    EndShiftTime: frontendShift.shiftEndTime,
    BeginBreakTime: frontendShift.shiftBeginBreakTime,
    EndBreakTime: frontendShift.shiftEndBreakTime,
    Description: frontendShift.shiftDescription || '',
    // Map status (0/1) => Inactive (boolean)
    // status 1 (đang sử dụng) => Inactive: false
    // status 0 (ngưng sử dụng) => Inactive: true
    Inactive: Number(frontendShift.shiftStatus) === 0,
    ShiftStatus: Number(frontendShift.shiftStatus),
    WorkingTime: frontendShift.workTimeHours,
    BreakingTime: frontendShift.breakTimeHours,
    CreatedBy: frontendShift.createdBy,
    CreatedDate: frontendShift.createdDate,
    ModifiedBy: frontendShift.modifiedBy,
    ModifiedDate: frontendShift.modifiedDate,
  }
}
