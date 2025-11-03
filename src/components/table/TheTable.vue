<template>
  <div class="ms-table">
    <table>
      <thead>
        <tr>
          <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
          <th class="actions-header">Chức năng</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in rows" :key="rowIndex" class="table-row">
          <td v-for="field in fields" :key="field.key">
            <template v-if="field.type === 'custom'">
              <slot :name="field.key" :row="row" :field="field" :value="row[field.key]">
                {{ handleFormat(row[field.key], 'text') }}
              </slot>
            </template>

            <template v-else>
              {{ handleFormat(row[field.key], field.type || 'text') }}
            </template>
          </td>

          <td class="actions-cell">
            <div class="action-buttons">
              <button @click="handleEdit(row)" class="edit-btn">Sửa</button>
              <button @click="handleDelete(row)" class="delete-btn">Xóa</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { formatNumber, formatDate, formatText } from '@/ultils/formatter'

//#region Props
const props = defineProps({
  fields: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every((field) => {
        const validTypes = ['text', 'number', 'date', 'custom']
        return field.key && field.label && validTypes.includes(field.type || 'text')
      })
    },
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
  switch (type) {
    case 'number':
      return formatNumber(value)
    case 'date':
      return formatDate(value)
    case 'text':
      return formatText(value)
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
.ms-table {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e0e6ec;
  white-space: nowrap;
}

th {
  background-color: #f1f2f6;
  font-weight: 600;
  color: #1f1f1f;
}

.actions-header {
  text-align: center;
}

.table-row:hover {
  background-color: #f0f8ff;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.edit-btn,
.delete-btn {
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  color: white;
}

.edit-btn {
  background-color: #2680eb;
}

.delete-btn {
  background-color: #d9534f;
}

.edit-btn:hover,
.delete-btn:hover {
  opacity: 0.9;
}
</style>
