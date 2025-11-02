<template>
  <div class="base-table-container">
    <!-- Khung bảng có thể cuộn ngang và dọc -->
    <div class="table-scroll-wrapper">
      <table class="base-table">
        <thead>
          <tr>
            <th v-for="field in fields" :key="field.key" class="table-header-cell">
              {{ field.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <!-- Duyệt qua từng dòng dữ liệu -->
          <tr v-for="(row, rowIndex) in rows" :key="row.id || rowIndex" class="table-row">
            <!-- Duyệt qua từng ô trong dòng -->
            <td v-for="field in fields" :key="field.key" class="table-cell">
              <!-- Nếu có hàm format riêng -->
              <span>{{ formatValue(row[field.key], field.type) }}</span>
            </td>
          </tr>

          <!-- Trường hợp không có dữ liệu -->
          <tr v-if="!rows || rows.length === 0">
            <td :colspan="fields.length" class="no-data">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
//#region IMPORTS
import { defineProps } from 'vue'
//#endregion

//#region PROPS
/**
 * @prop {Array} fields - Danh sách cột hiển thị trên bảng. Mỗi phần tử là object có dạng:
 *   { key: string, label: string, type?: string }
 *   - key: tên thuộc tính trong dữ liệu rows
 *   - label: tiêu đề cột
 *   - type: kiểu dữ liệu ('text', 'number', 'date')
 * @prop {Array} rows - Dữ liệu hiển thị trong bảng. Mỗi phần tử là 1 object.
 */
const props = defineProps({
  fields: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
})
//#endregion

//#region METHODS
/**
 * Hàm định dạng giá trị hiển thị dựa theo kiểu dữ liệu
 * @param {any} value - Giá trị cần hiển thị
 * @param {string} type - Kiểu dữ liệu ('text', 'number', 'date')
 * @returns {string} Chuỗi hiển thị
 */
const formatValue = (value, type = 'text') => {
  // Kiểm tra null hoặc undefined
  if (value === null || value === undefined || value === '') {
    return '--'
  }

  switch (type) {
    case 'number':
      return Number(value).toLocaleString('vi-VN')
    case 'date':
      try {
        const date = new Date(value)
        if (isNaN(date)) return '--'
        return date.toLocaleDateString('vi-VN')
      } catch {
        return '--'
      }
    default:
      return String(value)
  }
}
//#endregion
</script>

<style scoped>
/* Container chính */
.base-table-container {
  width: 100%;
  height: 100vh; /* full chiều cao màn hình */
  display: flex;
  flex-direction: column;
}

/* Khung cuộn */
.table-scroll-wrapper {
  flex: 1;
  overflow-x: auto; /* cuộn ngang */
  overflow-y: auto; /* cuộn dọc */
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: #fff;
}

/* Bảng */
.base-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px; /* Đảm bảo có thể cuộn ngang nếu quá hẹp */
}

/* Header */
.table-header-cell {
  background-color: #f9fafb;
  font-weight: 600;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  white-space: nowrap;
}

/* Hàng dữ liệu */
.table-row:hover {
  background-color: #f1f5f9;
}

.table-cell {
  padding: 10px 16px;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 250px;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #6b7280;
}
</style>
