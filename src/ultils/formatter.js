// very small utils
export const formatNumber = (v) => {
  if (v === null || v === undefined || v === '') return '-'
  const n = Number(v)
  if (Number.isNaN(n)) return v
  return n.toLocaleString()
}

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

export const formatText = (v) => {
  if (v === null || v === undefined || v === '') return '-'
  return String(v)
}
/**
 * Hàm lấy 2 chữ cái đầu của tên
 * @param {string} name Tên đầy đủ
 * @returns {string} 2 chữ cái đầu
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
