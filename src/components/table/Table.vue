<template>
  <div class="table-container">
    <table>
      <thead class="ms-thead">
        <tr>
          <th class="sticky-cell checkbox-cell" v-if="showCheckbox">
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
            :style="{ width: field.width, minWidth: field.width, textAlign: field.align || 'left' }"
          >
            <div
              class="ms-th-content header-content"
              :style="{ justifyContent: field.align === 'right' ? 'flex-end' : 'flex-start' }"
            >
              <el-tooltip :content="field.label" placement="top" effect="dark" :transition="'none'">
                <div class="ms-th-title">{{ field.label }}</div>
              </el-tooltip>

              <el-popover
                v-if="field.allowFilter"
                placement="bottom"
                :width="320"
                trigger="manual"
                :visible="popoverVisible[field.key]"
                popper-class="filter-popover"
                @hide="resetTempFilter"
              >
                <template #reference>
                  <div
                    :class="isColumnFiltered(field.key) ? 'filter-icon2' : 'filter-icon1'"
                    @click.stop="togglePopover(field)"
                  >
                    <i class="fas fa-filter"></i>
                  </div>
                </template>

                <div class="filter-container">
                  <div class="filter-header">
                    <span class="fw-600">Lọc {{ field.label }}</span>
                    <span class="close-filter" @click="closePopover(field.key)">✕</span>
                  </div>

                  <div class="filter-body mt-2">
                    <el-select v-model="tempFilter.operator" class="w-100 mb-2" size="default">
                      <el-option label="Chứa" value="Contains" />
                      <el-option label="Không chứa" value="NotContains" />
                      <el-option label="Bắt đầu với" value="StartsWith" />
                      <el-option label="Kết thúc với" value="EndsWith" />
                      <el-option label="Bằng" value="Equals" />
                    </el-select>

                    <el-input
                      v-model="tempFilter.value"
                      placeholder="Nhập giá trị lọc"
                      size="default"
                      @keyup.enter="handleApplyFilter(field)"
                    />
                  </div>

                  <div class="filter-footer mt-3 d-flex justify-content-space-between">
                    <button class="btn-text text-red" @click="handleClearFilter(field.key)">
                      Bỏ lọc
                    </button>
                    <div class="d-flex gap-2">
                      <button class="btn-secondary-sm" @click="closePopover(field.key)">Hủy</button>
                      <button class="btn-primary-sm" @click="handleApplyFilter(field)">
                        Áp dụng
                      </button>
                    </div>
                  </div>
                </div>
              </el-popover>
            </div>
          </th>

          <th class="sticky-cell actions-header" v-if="showActions">
            <div class="ms-th-content"></div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="row in rows"
          :key="row[rowKey]"
          class="table-row"
          :class="{
            'row-checked': selectedIds.includes(row[rowKey]) || activeRowId === row[rowKey],
          }"
          @dblclick="$emit('row-dblclick', row)"
          @click="handleRowClick(row)"
        >
          <td class="checkbox-cell" v-if="showCheckbox">
            <input
              type="checkbox"
              class="ms-checkbox"
              :checked="selectedIds.includes(row[rowKey])"
              @change="handleRowCheck(row[rowKey])"
              @click.stop
            />
          </td>

          <td
            v-for="field in fields"
            :key="field.key"
            :style="{ textAlign: field.align || 'left' }"
          >
            <el-tooltip
              placement="bottom-end"
              effect="dark"
              :transition="'none'"
              :disabled="!row[field.key] || field.noTooltip"
            >
              <template #content>
                <slot :name="`cell-${field.key}`" :row="row" :value="row[field.key]">
                  {{ row[field.key] || '--' }}
                </slot>
              </template>
              <div class="ms-td-content">
                <slot :name="`cell-${field.key}`" :row="row" :value="row[field.key]">
                  {{ row[field.key] || '--' }}
                </slot>
              </div>
            </el-tooltip>
          </td>

          <td class="actions-cell" v-if="showActions">
            <div class="action-buttons" @click.stop>
              <slot name="actions" :row="row">
                <button class="edit-text-btn" @click="$emit('edit', row)">Sửa</button>
                <button class="context-menu-btn" @click="$emit('delete', row)">
                  <i class="fas fa-trash text-red"></i>
                </button>
              </slot>
            </div>
          </td>
        </tr>

        <tr v-if="rows.length === 0">
          <td :colspan="totalColumns" class="text-center py-4 text-gray">Không có dữ liệu</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  fields: { type: Array, required: true }, // Cấu hình cột
  rows: { type: Array, default: () => [] }, // Dữ liệu
  rowKey: { type: String, default: 'id' }, // Tên trường ID (vd: shiftId, employeeId)
  selectedIds: { type: Array, default: () => [] }, // Danh sách ID đang chọn (v-model)
  showCheckbox: { type: Boolean, default: true },
  showActions: { type: Boolean, default: true },
  activeFilters: { type: Array, default: () => [] },
})

const emit = defineEmits([
  'update:selectedIds',
  'edit',
  'delete',
  'row-dblclick',
  'row-click',
  'apply-filter',
])

const tempFilter = ref({
  column: '',
  operator: 'Contains',
  value: '',
})

const popoverVisible = ref({})

/**
 * Hàm kiểm tra xem cột hiện tại có đang được áp dụng bộ lọc hay không
 * @param {string} key - Mã cột (field key)
 * @returns {boolean} - True nếu đang lọc
 * createdby: Bảo Trung
 */
const isColumnFiltered = (key) => {
  return props.activeFilters.some((f) => f.column === key)
}

/**
 * Hàm khởi tạo dữ liệu mặc định cho popover lọc khi mở lên
 * Nếu đã có lọc trước đó thì fill lại giá trị cũ
 * @param {object} field - Cấu hình cột
 * createdby: Bảo Trung
 */
const initFilter = (field) => {
  // Tìm xem đã có lọc cho cột này chưa
  const current = props.activeFilters.find((f) => f.column === field.key)
  if (current) {
    tempFilter.value = { ...current }
  } else {
    tempFilter.value = {
      column: field.key,
      operator: 'Contains',
      value: '',
    }
  }
}
const resetTempFilter = () => {
  // Có thể reset nếu cần
}

/**
 * Hàm bật/tắt popover lọc cho từng cột
 * Đảm bảo chỉ có 1 popover mở tại 1 thời điểm
 * @param {object} field - Cấu hình cột
 * createdby: Bảo Trung
 */
const togglePopover = (field) => {
  if (popoverVisible.value[field.key]) {
    popoverVisible.value[field.key] = false
  } else {
    // Close other popovers first if needed (optional)
    Object.keys(popoverVisible.value).forEach((k) => (popoverVisible.value[k] = false))

    initFilter(field)
    popoverVisible.value[field.key] = true
  }
}

/**
 * Hàm đóng popover dựa theo key
 * @param {string} key - Mã cột
 * createdby: Bảo Trung
 */
const closePopover = (key) => {
  if (key) {
    popoverVisible.value[key] = false
  }
}

/**
 * Hàm xử lý khi nhấn nút "Áp dụng" trên form lọc
 * Nếu giá trị rỗng -> chuyển sang logic bỏ lọc
 * @param {object} field - Cấu hình cột
 * createdby: Bảo Trung
 */
const handleApplyFilter = (field) => {
  if (!tempFilter.value.value && tempFilter.value.operator !== 'NotNull') {
    // Nếu không nhập gì mà ấn áp dụng -> coi như bỏ lọc
    handleClearFilter(field.key)
    return
  }

  // Emit ra ngoài cho WorkShift xử lý
  emit('apply-filter', {
    ...tempFilter.value,
    column: field.key,
    label: field.label, // Truyền thêm label để hiển thị tag
  })
  closePopover(field.key)
}

/**
 * Hàm xử lý khi nhấn nút "Bỏ lọc"
 * @param {string} key - Mã cột
 * createdby: Bảo Trung
 */
const handleClearFilter = (key) => {
  emit('apply-filter', { column: key, remove: true })
  closePopover(key)
}

const activeRowId = ref(null)

/**
 * Computed tính tổng số cột hiển thị để merge cell (colspan) khi bảng không có dữ liệu
 * @returns {number} Tổng số cột
 * createdby: Bảo Trung
 */
const totalColumns = computed(() => {
  let count = props.fields.length
  if (props.showCheckbox) count++
  if (props.showActions) count++
  return count
})

/**
 * Computed kiểm tra trạng thái chọn tất cả (cho checkbox header)
 * @returns {boolean} True nếu tất cả các dòng đều được chọn
 * createdby: Bảo Trung
 */
const isAllChecked = computed(() => {
  return props.rows.length > 0 && props.selectedIds.length === props.rows.length
})

/**
 * Hàm xử lý khi tick chọn checkbox của một dòng
 * Thêm hoặc xóa ID khỏi danh sách selectedIds
 * @param {string} id - ID của dòng
 * createdby: Bảo Trung
 */
const handleRowCheck = (id) => {
  const newSelected = [...props.selectedIds]
  const index = newSelected.indexOf(id)
  if (index === -1) {
    newSelected.push(id)
  } else {
    newSelected.splice(index, 1)
  }
  emit('update:selectedIds', newSelected)
}

/**
 * Hàm xử lý khi tick chọn checkbox "Chọn tất cả" ở header
 * @param {Event} event - Sự kiện change
 * createdby: Bảo Trung
 */
const handleSelectAll = (event) => {
  if (event.target.checked) {
    const allIds = props.rows.map((row) => row[props.rowKey])
    emit('update:selectedIds', allIds)
  } else {
    emit('update:selectedIds', [])
  }
}

/**
 * Hàm xử lý khi click vào một dòng (để highlight dòng đang chọn)
 * @param {object} row - Dữ liệu dòng
 * createdby: Bảo Trung
 */
const handleRowClick = (row) => {
  activeRowId.value = row[props.rowKey]
  emit('row-click', row)
}
</script>
<style scoped>
/* Container chính cho phép cuộn cả ngang và dọc */
.table-container {
  width: 100%;
  height: 100%;
  overflow: auto; /* Bật thanh cuộn khi cần */
}
.header-content {
  display: flex;
  align-items: center;
  /* justifyContent sẽ được set inline style */
  height: 100%;
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
  background-color: #e5e7eb;
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
  background-color: #e5e7eb;
}

.table-row.row-checked {
  background-color: #a4f6d3; /* Lighter green to match design */
}

.table-row.row-checked:hover {
  background-color: #a4f6d3;
}

.table-row.row-checked .checkbox-cell {
  background-color: #a4f6d3;
}

.table-row.row-checked .actions-cell {
  background-color: #a4f6d3;
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
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  transition: all 0.2s ease;
  position: relative;
  margin: 0 auto;
}

.ms-checkbox:checked {
  background-color: #009b71;
  border-color: #009b71;
}

.ms-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.ms-checkbox:hover {
  border-color: #009b71;
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
  flex: 1;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
  font-weight: 600;
  width: 100%;
  position: relative;
}
.filter-icon1 {
  mask-image: url(@/assets/icon/icon1.svg);
  mask-position: -544px 0px;
  height: 16px;
  width: 16px;
  min-height: 16px;
  min-width: 16px;
  position: relative;
  background-color: #4b5563;
  opacity: 0; /* Ẩn mặc định */
  transition: opacity 0.2s ease; /* Hiệu ứng mượt */
}
.filter-icon2 {
  mask-image: url(@/assets/icon/icon1.svg);
  mask-position: -720px 0px;
  height: 16px;
  width: 16px;
  min-height: 16px;
  min-width: 16px;
  position: relative;
  background-color: #4b5563;
  opacity: 1;
  transition: opacity 0.2s ease;
}
th:hover .filter-icon1 {
  opacity: 1;
}

/* .filter-icon1:hover,
.filter-icon2:hover {
  background-color: #e5e7eb;
} */

/* .filter-icon2 {
  color: #009b71;
  background-color: #ebfef6;
} */

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.close-filter {
  cursor: pointer;
  font-size: 16px;
  color: #757575;
  padding: 4px;
}

.close-filter:hover {
  background-color: #f3f4f6;
  border-radius: 4px;
}

/* Style nút nhỏ trong popover */
.btn-secondary-sm {
  border: 1px solid #e0e0e0;
  background: #fff;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary-sm {
  background: #009b71;
  color: #fff;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-text {
  background: none;
  border: none;
  cursor: pointer;
}
.mt-2 {
  margin-top: 8px;
}
.mt-3 {
  margin-top: 12px;
}
.mb-2 {
  margin-bottom: 8px;
}
.gap-2 {
  gap: 8px;
}
.fw-600 {
  font-weight: 600;
}
.pointer {
  cursor: pointer;
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
