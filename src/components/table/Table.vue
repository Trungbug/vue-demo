<template>
  <div class="table-container">
    <table>
      <thead class="ms-thead">
        <tr>
          <th class="sticky-cell checkbox-cell">
            <div class="ms-th-checkbox">
              <input
                type="checkbox"
                class="ms-checkbox"
                :checked="isAllChecked"
                @change="handleSelectAll"
              />
            </div>
          </th>

          <th
            v-for="field in fields"
            :key="field.key"
            class="sticky-cell"
            :style="{ width: field.width }"
          >
            <div class="ms-th-content">
              <div class="menu-wrapper">
                <div class="menu-button-container">
                  <div class="ms-th-title" :title="field.label">
                    {{ field.label }}
                  </div>
                </div>
              </div>
            </div>
          </th>

          <th class="sticky-cell actions-header">
            <div class="ms-th-content"></div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.shiftId"
          class="table-row"
          :class="{ 'row-checked': selectedRows.includes(row.shiftId) }"
        >
          <td class="checkbox-cell">
            <input
              type="checkbox"
              class="ms-checkbox"
              :checked="selectedRows.includes(row.shiftId)"
              @change="handleRowCheck(row.shiftId)"
            />
          </td>
          <td v-for="field in fields" :key="field.key">
            <div class="ms-td-content" :title="handleFormat(row[field.key], field.type || 'text')">
              {{ handleFormat(row[field.key], field.type || 'text') }}
            </div>
          </td>
          <td class="actions-cell">
            <div class="action-buttons">
              <button class="edit-text-btn" @click="handleEdit(row)">Sửa</button>
              <button class="context-menu-btn" @click.stop="">
                <i class="fas fa-ellipsis-h"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatNumber, formatDate, formatText } from '@/ultils/formatter'

//#region Props
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

//#region State
const selectedRows = ref([])
//#endregion

//#region Computed
const isAllChecked = computed(() => {
  return props.rows.length > 0 && selectedRows.value.length === props.rows.length
})
//#endregion

//#region Emits
const emit = defineEmits(['edit', 'delete'])

const handleFormat = (value, type) => {
  if (value === null || value === undefined || value === '') return '--'
  if (type === 'text' && typeof value === 'string' && value.match(/^\d{2}:\d{2}:\d{2}$/)) {
    return value.substring(0, 5)
  }
  switch (type) {
    case 'number':
      return formatNumber(value)
    case 'date':
      return formatDate(value)
    default:
      return formatText(value)
  }
}

const handleEdit = (row) => {
  emit('edit', row)
}

const handleSelectAll = (event) => {
  if (event.target.checked) {
    selectedRows.value = props.rows.map((row) => row.shiftId)
  } else {
    selectedRows.value = []
  }
}

const handleRowCheck = (shiftId) => {
  const index = selectedRows.value.indexOf(shiftId)
  if (index === -1) {
    selectedRows.value.push(shiftId)
  } else {
    selectedRows.value.splice(index, 1)
  }
}
//#endregion
</script>

<style scoped>
/* Container chính cho phép cuộn cả ngang và dọc */
.table-container {
  width: 100%;
  height: 100%;
  overflow: auto; /* Bật thanh cuộn khi cần */
}

table {
  width: auto;
  min-width: 100%;
  border-collapse: separate; /* Chuyển sang separate để sticky hoạt động tốt */
  border-spacing: 0;
  table-layout: fixed;
}

th,
td {
  position: relative;
  height: 32px;
  padding: 0 16px;
  text-align: left;
  border-bottom: 1px solid #e0e6ec;
  white-space: nowrap; /* Ngăn text xuống dòng */
}

/* Quan trọng: Giữ cho header dính ở trên cùng */
.sticky-cell {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #f1f2f6; /* Bắt buộc phải có màu nền */
}

/* Cột checkbox - dính ở bên trái */
.checkbox-cell {
  position: sticky;
  left: 0;
  z-index: 10;
  background-color: #f3f4f6;
}

thead.ms-thead .checkbox-cell {
  background-color: #f3f4f6;
  z-index: 11;
}

tbody .table-row .checkbox-cell {
  background-color: #ffffff;
}

tbody .table-row:hover .checkbox-cell {
  background-color: #f0f8ff;
}

/* Cột chức năng - dính ở bên phải */
.actions-header,
.actions-cell {
  position: sticky;
  right: 0;
  z-index: 10;
  background-color: #f3f4f6;
}

thead.ms-thead .actions-header {
  background-color: #f3f4f6;
  z-index: 11;
}

tbody .table-row .actions-cell {
  background-color: #ffffff;
}

tbody .table-row:hover .actions-cell {
  background-color: #f0f8ff;
}

.ms-th-content {
  max-width: 100%;
  padding: 0 16px;
  border-right: 1px solid #d1d5db;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
th {
  padding: 0; /* Xóa padding khỏi th */
  border-bottom: 1px solid #d1d5db;
  height: 36px; /* Đặt chiều cao cố định cho hàng header */
  font-weight: 600; /* Có thể bạn muốn giữ font-weight ở đây */
}
.ms-thead th {
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  font-size: 13px;
  height: 30px;
  font-weight: 600;
  background: #f3f4f6;
  border-bottom: 1px solid #d1d5db;
  position: sticky;
  top: 0;
}

.table-row:hover {
  background-color: #f0f8ff;
}

.table-row.row-checked {
  background-color: #86efac;
}

.table-row.row-checked:hover {
  background-color: #86efac;
}

.table-row.row-checked .checkbox-cell {
  background-color: #86efac;
}

.table-row.row-checked .actions-cell {
  background-color: #86efac;
}

.checkbox-cell {
  width: 60px;
  text-align: center;
}

.actions-header,
.actions-cell {
  width: 120px;
  text-align: center;
}

.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.edit-text-btn {
  background: none;
  border: none;
  color: #2680eb;
  font-weight: 600;
  cursor: pointer;
}

.context-menu-btn {
  background: none;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ms-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* Style cho cột Tên + Avatar */
.avatar-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Style cho avatar là HÌNH ẢNH */
.candidate-avatar-img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.candidate-avatar-color {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  flex-shrink: 0; /* Ngăn avatar bị co lại */
}
.ms-thead {
  height: 30px;
  color: #262626;
  -webkit-touch-callout: none;

  -moz-user-select: none;
  user-select: none;
}
.menu-wrapper {
  width: 100%;
  font-weight: 400;
  cursor: pointer;
}
thead.ms-thead th .ms-th-content {
  border-right: 1px solid #d1d5db;
}
.ms-th-title {
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
  font-weight: 600;
  width: 100%;
  position: relative;
}
.ms-th-checkbox {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
thead.ms-thead .checkbox-cell .ms-th-content,
thead.ms-thead .actions-header .ms-th-content {
  justify-content: center;
  padding: 0; /* Các ô này không cần padding trái/phải */
}
/* 2. Áp dụng viền trái CHỈ cho cột checkbox (cột đầu tiên) trong thead */
/* Viền trái cho checkbox header */
thead.ms-thead .checkbox-cell {
  border-left: 1px solid #d1d5db;
  width: 60px;
}

thead.ms-thead .actions-header {
  width: 120px;
}

tbody .table-row .checkbox-cell {
  width: 60px;
}

tbody .table-row .actions-cell {
  width: 120px;
}
.ms-td-content {
  overflow: hidden; /* Ẩn nội dung thừa */
  text-overflow: ellipsis; /* Hiển thị dấu ... */
  white-space: nowrap; /* Giữ trên 1 dòng */
}
</style>
