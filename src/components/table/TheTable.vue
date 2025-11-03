<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th class="sticky-cell checkbox-cell">
            <input type="checkbox" class="ms-checkbox" />
          </th>

          <th v-for="field in fields" :key="field.key" class="sticky-cell">
            {{ field.label }}
          </th>

          <th class="sticky-cell actions-header">Chức năng</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.CandidateID" class="table-row">
          <td class="checkbox-cell">
            <input type="checkbox" class="ms-checkbox" />
          </td>
          <td v-for="field in fields" :key="field.key">
            {{ handleFormat(row[field.key], field.type || 'text') }}
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
import { formatNumber, formatDate, formatText } from '@/ultils/formatter'

// ... (phần script của bạn giữ nguyên) ...

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

//#region Emits
const emit = defineEmits(['edit', 'delete'])
//#endregion

//#region Methods
const handleFormat = (value, type) => {
  if (value === null || value === undefined || value === '') return '--'
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

const handleDelete = (row) => {
  emit('delete', row)
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
  width: 100%;
  border-collapse: separate; /* Chuyển sang separate để sticky hoạt động tốt */
  border-spacing: 0;
}

th,
td {
  padding: 12px 16px;
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

th {
  font-weight: 600;
  color: #1f1f1f;
}

.table-row:hover {
  background-color: #f0f8ff;
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
</style>
