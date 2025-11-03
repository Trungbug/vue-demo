<template>
  <div class="ms-datagrid">
    <!-- Wrapper cho scroll ngang -->
    <div class="grid-horizontal-scroll">
      <!-- Header -->
      <div class="table-header">
        <table>
          <thead>
            <tr>
              <th class="checkbox-cell">
                <input
                  type="checkbox"
                  class="ms-checkbox"
                  :checked="isAllSelected"
                  :indeterminate="isIndeterminate"
                  @change="toggleSelectAll"
                />
              </th>
              <th v-for="field in fields" :key="field.key" class="header-cell">
                {{ field.label }}
              </th>
              <th class="actions-header">Chức năng</th>
            </tr>
          </thead>
        </table>
      </div>

      <!-- Nội dung -->
      <div class="table-body">
        <table>
          <tbody>
            <tr v-for="row in rows" :key="row.CandidateID" class="table-row">
              <td class="checkbox-cell">
                <input
                  type="checkbox"
                  class="ms-checkbox"
                  :checked="selectedRows.has(row.CandidateID)"
                  @change="toggleRowSelection(row)"
                />
              </td>
              <td v-for="field in fields" :key="field.key" class="data-cell">
                <template v-if="field.type === 'custom'">
                  <slot :name="field.key" :row="row" :value="row[field.key]">
                    {{ handleFormat(row[field.key], 'text') }}
                  </slot>
                </template>
                <template v-else>
                  {{ handleFormat(row[field.key], field.type || 'text') }}
                </template>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatNumber, formatDate, formatText } from '@/ultils/formatter'

const props = defineProps({
  fields: { type: Array, required: true },
  rows: { type: Array, required: true },
})
const emit = defineEmits(['edit'])

const selectedRows = ref(new Set())

const isAllSelected = computed(
  () => props.rows.length > 0 && selectedRows.value.size === props.rows.length,
)
const isIndeterminate = computed(
  () => selectedRows.value.size > 0 && selectedRows.value.size < props.rows.length,
)

const toggleSelectAll = (event) => {
  if (event.target.checked) props.rows.forEach((r) => selectedRows.value.add(r.CandidateID))
  else selectedRows.value.clear()
}
const toggleRowSelection = (row) => {
  if (selectedRows.value.has(row.CandidateID)) selectedRows.value.delete(row.CandidateID)
  else selectedRows.value.add(row.CandidateID)
}

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

const handleEdit = (row) => emit('edit', row)
</script>

<style scoped>
.ms-datagrid {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #fff;
  overflow: hidden;
}

/* Scroll ngang chứa cả header và body */
.grid-horizontal-scroll {
  overflow-x: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Header */
.table-header {
  background: #f1f2f6;
  flex-shrink: 0;
}
.table-header table {
  width: 100%;
  border-collapse: collapse;
}

/* Body */
.table-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
.table-body table {
  width: 100%;
  border-collapse: collapse;
}

/* Cấu trúc ô */
th,
td {
  padding: 0 16px;
  height: 48px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  white-space: nowrap;
}

th {
  font-weight: 700;
  color: #1f1f1f;
}

.checkbox-cell {
  width: 50px;
  text-align: center;
}

.ms-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.table-row:hover {
  background-color: #e6f7ff;
}

.actions-cell {
  text-align: center;
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>
