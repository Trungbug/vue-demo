/**
 * Enum định nghĩa trạng thái Ca làm việc
 */
export const WorkShiftStatus = {
  ACTIVE: 1,
  INACTIVE: 0,
}

/**
 * Map giá trị sang text hiển thị
 */
export const WorkShiftStatusText = {
  [WorkShiftStatus.ACTIVE]: 'Đang sử dụng',
  [WorkShiftStatus.INACTIVE]: 'Ngưng sử dụng',
}

/**
 * Map giá trị sang class màu sắc (nếu muốn hiển thị màu)
 * Ví dụ: xanh cho active, xám cho inactive
 */
export const WorkShiftStatusColor = {
  [WorkShiftStatus.ACTIVE]: 'text-green',
  [WorkShiftStatus.INACTIVE]: 'text-gray',
}
