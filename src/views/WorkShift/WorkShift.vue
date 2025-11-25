<template>
  <div class="content">
    <div class="title-header">
      <div class="title-left">Ca làm việc</div>
      <div class="title-right">
        <button class="btn" @click="openAddDialog">
          <div class="icon-add"></div>
          <span class="title-name">Thêm</span>
        </button>
      </div>
    </div>

    <BaseDialog v-model:show="isFormVisible" :title="dialogTitle" @close="handleCancelForm">
      <CandidateForm
        ref="candidateFormRef"
        @cancel="closeDialog"
        @submit="handleAddCandidate"
        :initialData="shiftToEdit"
      />

      <template #footer>
        <button type="button" class="btn-secondary" @click="handleCancelForm">Hủy</button>
        <button type="button" class="btn-secondary" @click="handleSaveAndAdd">Lưu và Thêm</button>
        <button type="button" class="btn-primary" @click="handleSaveOnly">Lưu</button>
      </template>
    </BaseDialog>

    <div class="candidates-wrapper">
      <div class="toolbar">
        <div class="toolbar-container">
          <div class="toolbar-grid-default">
            <div class="grid-left">
              <div class="input-search">
                <div class="search-container">
                  <div class="icon icon-search"></div>
                  <input
                    type="text"
                    class="texteditor-input"
                    v-model="searchQuery"
                    placeholder="Tìm kiếm "
                  />
                </div>
              </div>
              <div
                class="filter-tags-list d-flex align-items-center gap-2 ml-2"
                v-if="filter.filters.length > 0"
              >
                <div v-for="(f, index) in filter.filters" :key="index" class="filter-tag">
                  <span class="tag-label">{{ f.label }}</span>
                  <span class="tag-operator">{{ getOperatorText(f.operator) }}</span>
                  <span class="tag-value">{{ f.value }}</span>
                  <span class="tag-close" @click="removeFilterTag(f.column)">✕</span>
                </div>

                <span class="clear-all-filters text-red cursor-pointer" @click="clearAllFilters">
                  Bỏ lọc
                </span>
              </div>
              <div class="bulk-actions" v-if="selectedIds.length > 0">
                <span class="selected-count"
                  >Đã chọn <strong>{{ selectedIds.length }}</strong></span
                >
                <span class="unselect-link" @click="handleUnselect">Bỏ chọn</span>

                <button
                  class="btn-bulk btn-bulk-active"
                  v-if="showActiveButton"
                  @click="handleBulkUpdate(WorkShiftStatus.ACTIVE)"
                >
                  <div class="icon-check-circle"></div>
                  <span>Sử dụng</span>
                </button>

                <button
                  class="btn-bulk btn-bulk-inactive"
                  v-if="showInactiveButton"
                  @click="handleBulkUpdate(WorkShiftStatus.INACTIVE)"
                >
                  <div class="icon icon-ban"></div>
                  <span>Ngừng sử dụng</span>
                </button>

                <button class="btn-bulk btn-bulk-delete" @click="handleBulkDelete">
                  <div class="icon-trash"></div>
                  <span>Xóa</span>
                </button>
              </div>
            </div>

            <div class="grid-right">
              <div
                class="wrap-icon-button-toolbar"
                title="Lọc"
                v-if="selectedIds.length === 0"
                @click="loadShifts"
              >
                <div class="icon-reload"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="table-area">
        <TheTable
          :fields="shiftFields"
          :rows="shifts"
          :active-filters="filter.filters"
          v-model:selectedIds="selectedIds"
          rowKey="shiftId"
          @apply-filter="handleTableFilter"
          @edit="handleEdit"
          @delete="handleDelete"
          @row-dblclick="handleEdit"
        >
          <template #cell-shiftStatus="{ value }">
            <div class="status-badge" :class="value === 1 ? 'status-active' : 'status-inactive'">
              {{ WorkShiftStatusText[value] ?? value }}
            </div>
          </template>

          <!-- Custom Actions Column -->
          <template #actions="{ row }">
            <div class="action-buttons-container">
              <!-- Edit Button -->
              <button class="btn-circle btn-edit" @click="handleEdit(row)" title="Sửa">
                <div class="icon-edit"></div>
              </button>

              <!-- More Options Dropdown -->
              <el-dropdown trigger="click">
                <button class="btn-circle btn-more" title="Thêm">
                  <el-icon><MoreFilled /></el-icon>
                </button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleDuplicate(row)">
                      <el-icon><CopyDocument /></el-icon>
                      <span>Nhân bản</span>
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="row.shiftStatus === WorkShiftStatus.ACTIVE"
                      @click="handleToggleStatus(row, WorkShiftStatus.INACTIVE)"
                    >
                      <el-icon><CircleClose /></el-icon>
                      <span>Ngừng sử dụng</span>
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-else
                      @click="handleToggleStatus(row, WorkShiftStatus.ACTIVE)"
                    >
                      <el-icon><CircleCheck /></el-icon>
                      <span>Sử dụng</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleDelete(row)" class="text-red">
                      <el-icon class="text-red"><Delete /></el-icon>
                      <span class="text-redd">Xóa</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>

          <!-- Time Columns Formatting -->
          <template #cell-shiftBeginTime="{ value }">
            {{ formatTime(value) }}
          </template>
          <template #cell-shiftEndTime="{ value }">
            {{ formatTime(value) }}
          </template>
          <template #cell-shiftBeginBreakTime="{ value }">
            {{ formatTime(value) }}
          </template>
          <template #cell-shiftEndBreakTime="{ value }">
            {{ formatTime(value) }}
          </template>

          <!-- Duration Columns Formatting -->
          <template #cell-workTimeHours="{ value }">
            {{ formatInteger(value) }}
          </template>
          <template #cell-breakTimeHours="{ value }">
            {{ formatInteger(value) }}
          </template>

          <!-- Date Columns Formatting -->
          <template #cell-createdDate="{ value }">
            {{ formatDateOnly(value) }}
          </template>
          <template #cell-modifiedDate="{ value }">
            {{ formatDateOnly(value) }}
          </template>
        </TheTable>
      </div>

      <div class="paging">
        <div class="paging-left">
          Tổng số: <strong>{{ totalRecords }}</strong>
        </div>
        <div class="paging-right">
          <span class="text-label">Số dòng/trang</span>
          <el-select
            v-model="pageSize"
            class="page-size-select"
            popper-class="pagination-select-dropdown"
          >
            <el-option :value="10" label="10">
              <div class="option-content">
                <span>10</span>
                <el-icon v-if="pageSize === 10" class="check-icon"><Check /></el-icon>
              </div>
            </el-option>
            <el-option :value="20" label="20">
              <div class="option-content">
                <span>20</span>
                <el-icon v-if="pageSize === 20" class="check-icon"><Check /></el-icon>
              </div>
            </el-option>
            <el-option :value="30" label="30">
              <div class="option-content">
                <span>30</span>
                <el-icon v-if="pageSize === 30" class="check-icon"><Check /></el-icon>
              </div>
            </el-option>
            <el-option :value="50" label="50">
              <div class="option-content">
                <span>50</span>
                <el-icon v-if="pageSize === 50" class="check-icon"><Check /></el-icon>
              </div>
            </el-option>
            <el-option :value="100" label="100">
              <div class="option-content">
                <span>100</span>
                <el-icon v-if="pageSize === 100" class="check-icon"><Check /></el-icon>
              </div>
            </el-option>
          </el-select>
          <span class="record-range">{{ rangeStart }} - {{ rangeEnd }}</span>
          <div class="pagination-buttons">
            <button :disabled="currentPage === 1" @click="currentPage = 1" class="nav-btn">
              <el-icon><DArrowLeft /></el-icon>
            </button>
            <button :disabled="currentPage === 1" @click="currentPage--" class="nav-btn">
              <el-icon><ArrowLeft /></el-icon>
            </button>
            <button :disabled="currentPage === totalPages" @click="currentPage++" class="nav-btn">
              <el-icon><ArrowRight /></el-icon>
            </button>
            <button
              :disabled="currentPage === totalPages"
              @click="currentPage = totalPages"
              class="nav-btn"
            >
              <el-icon><DArrowRight /></el-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
    <Notification ref="notificationRef" />
  </div>
</template>
<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useShiftStore } from '@/stores/shiftStore.js'

import TheTable from '@/components/table/Table.vue'
import BaseDialog from '@/components/dialog/Dialog.vue'
import CandidateForm from '@/views/WorkShift/form/WorkShiftForm.vue'
import Notification from '@/components/notification/Notification.vue'
import { WorkShiftStatusText, WorkShiftStatus } from '@/constants/enums.js'
import { formatTime, formatDateOnly, formatInteger } from '@/ultils/formatter.js'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  MoreFilled,
  CopyDocument,
  CircleClose,
  Delete,
  CircleCheck,
  DArrowLeft,
  DArrowRight,
  ArrowLeft,
  ArrowRight,
  Check,
} from '@element-plus/icons-vue'
import useDialog from '@/composables/useDialog.js'
import useToast from '@/composables/useToast.js'

// --- 1. KHỞI TẠO STORE ---
const store = useShiftStore()

// Lấy state từ store (Dùng storeToRefs để khi state thay đổi, UI tự cập nhật)
// shifts thay thế cho shiftRows cũ
const { shifts, totalRecords, filter, isLoading } = storeToRefs(store)

// --- 2. LOCAL STATE (UI) ---
const isFormVisible = ref(false)
const candidateFormRef = ref(null)
const notificationRef = ref(null)
const shiftToEdit = ref(null)
const dialogTitle = ref('Thêm ca làm việc')
const selectedIds = ref([]) // Danh sách ID đang chọn
const isSaveAndAdd = ref(false)
const { isDialogVisible, selectedItem, showDialog, hideDialog } = useDialog()
const { showToast } = useToast()

// Cột bảng
const shiftFields = ref([
  { key: 'shiftCode', label: 'Mã ca', width: '120px', allowFilter: true },
  { key: 'shiftName', label: 'Tên ca', width: '250px', allowFilter: true },
  { key: 'shiftBeginTime', label: 'Giờ vào ca', type: 'text', width: '130px' },
  { key: 'shiftEndTime', label: 'Giờ hết ca', type: 'text', width: '130px' },
  { key: 'shiftBeginBreakTime', label: 'Bắt đầu nghỉ giữa ca', type: 'text', width: '200px' },
  { key: 'shiftEndBreakTime', label: 'Kết thúc nghỉ giữa ca', type: 'text', width: '210px' },
  {
    key: 'workTimeHours',
    label: 'Thời gian làm việc (giờ)',
    type: 'number',
    width: '210px',
    align: 'right',
  },
  {
    key: 'breakTimeHours',
    label: 'Thời gian nghỉ giữa ca (giờ)',
    type: 'number',
    width: '230px',
    align: 'right',
  },
  { key: 'shiftStatus', label: 'Trạng thái', width: '200px', noTooltip: true },
  { key: 'createdBy', label: 'Người tạo', width: '160px' },
  { key: 'createdDate', label: 'Ngày tạo', width: '160px' },
  { key: 'modifiedBy', label: 'Người sửa', width: '16px' },
  { key: 'modifiedDate', label: 'Ngày sửa', width: '160px' },
])

/**
 * Computed binding 2 chiều cho trang hiện tại (Current Page)
 * Get: Lấy giá trị từ Store
 * Set: Cập nhật vào Store -> Trigger watcher để load lại dữ liệu
 * createdby: Bảo Trung
 */
const currentPage = computed({
  get: () => filter.value.pageNumber,
  set: (val) => {
    filter.value.pageNumber = val
  },
})
/**
 * Computed binding 2 chiều cho kích thước trang (Page Size)
 * createdby: Bảo Trung
 */
const pageSize = computed({
  get: () => filter.value.pageSize,
  set: (val) => {
    filter.value.pageSize = val
  },
})
/**
 * Computed binding 2 chiều cho từ khóa tìm kiếm (Search Query)
 * createdby: Bảo Trung
 */
const searchQuery = computed({
  get: () => filter.value.searchQuery,
  set: (val) => {
    filter.value.searchQuery = val
  },
})

// Tính toán hiển thị phân trang (Dựa trên dữ liệu từ Store)
const rangeStart = computed(() => {
  if (totalRecords.value === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const rangeEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalRecords.value)
})

const totalPages = computed(() => {
  return Math.ceil(totalRecords.value / pageSize.value)
})

// --- 4. CALL API & WATCHERS ---
onMounted(() => {
  loadShifts()
})

/**
 * Hàm gọi API lấy danh sách ca làm việc thông qua Store Action
 * Bao gồm xử lý lỗi kết nối hoặc lỗi SSL
 * @returns (void)
 * createdby: Bảo Trung
 */
const loadShifts = async () => {
  try {
    await store.fetchShifts()
  } catch (err) {
    // Xử lý lỗi kết nối
    if (err.code === 'ERR_CERT_AUTHORITY_INVALID') {
      showToast('Lỗi SSL: Vui lòng chấp nhận chứng chỉ backend.', 'error')
    } else if (err.code === 'ERR_CONNECTION_REFUSED') {
      showToast('Không thể kết nối đến Server.', 'error')
    } else {
      showToast('Có lỗi xảy ra khi tải dữ liệu.', 'error')
    }
  }
}

// Watcher reload khi thay đổi trang hoặc kích thước trang
watch([currentPage, pageSize], () => {
  selectedIds.value = []
  loadShifts()
})

// Debounce tìm kiếm
let searchTimeout
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    filter.value.pageNumber = 1 // Reset về trang 1 khi tìm kiếm
    loadShifts()
  }, 500)
})

/**
 * Mở Dialog để thêm mới ca làm việc
 * createdby: Bảo Trung
 */
const openAddDialog = () => {
  shiftToEdit.value = null
  dialogTitle.value = 'Thêm Ca làm việc'
  isFormVisible.value = true
}

/**
 * Mở Dialog để sửa ca làm việc
 * @param {object} row - Dữ liệu dòng cần sửa
 * createdby: Bảo Trung
 */
const handleEdit = (row) => {
  shiftToEdit.value = { ...row }
  dialogTitle.value = 'Sửa ca làm việc'
  isFormVisible.value = true
}

/**
 * Đóng dialog và reset form
 */
const closeDialog = () => {
  isFormVisible.value = false
  shiftToEdit.value = null
}

/**
 * Xử lý sự kiện hủy - gọi handleCancel của form để kiểm tra thay đổi
 */
const handleCancelForm = () => {
  candidateFormRef.value?.handleCancel()
}

const handleSaveOnly = () => {
  isSaveAndAdd.value = false
  candidateFormRef.value?.handleSubmit()
}

const handleSaveAndAdd = () => {
  isSaveAndAdd.value = true
  candidateFormRef.value?.handleSubmit()
}

/**
 * Hàm xử lý sự kiện Lưu từ Form (dùng chung cho cả Thêm và Sửa)
 * @param {object} formData - Dữ liệu nhận được từ Form component
 * createdby: Bảo Trung
 */
const handleAddCandidate = async (formData) => {
  let result

  if (shiftToEdit.value && shiftToEdit.value.shiftId) {
    // Gọi Action Update từ Store
    result = await store.updateShift(shiftToEdit.value.shiftId, formData)
  } else {
    // Gọi Action Add từ Store
    result = await store.addShift(formData)
  }

  if (result.success) {
    showToast(result.message, 'success')

    if (isSaveAndAdd.value) {
      candidateFormRef.value?.resetForm()
      shiftToEdit.value = null
      dialogTitle.value = 'Thêm ca làm việc'
    } else {
      closeDialog()
    }
  } else {
    handleSaveError(result.error)
  }
}

/**
 * Hàm xử lý hiển thị lỗi từ Backend trả về sau khi Lưu thất bại
 * Map lỗi field vào form validate hoặc hiện toast message chung
 * @param {object} error - Object lỗi trả về
 * createdby: Bảo Trung
 */
const handleSaveError = (error) => {
  console.error('Lỗi khi lưu:', error)
  let errMsg = 'Có lỗi xảy ra.'

  if (error?.response?.data) {
    const respData = error.response.data
    // Map lỗi validate vào form nếu có
    if (respData.errors) {
      const mapped = {}
      Object.keys(respData.errors).forEach((k) => {
        const v = respData.errors[k]
        mapped[k] = Array.isArray(v) ? String(v[0]) : String(v)
      })
      candidateFormRef.value?.setErrors(mapped)
      errMsg = 'Dữ liệu không hợp lệ.'
    } else if (respData.message) {
      errMsg = respData.message
    }
  }
  showToast(errMsg, 'error')
}

// Helper chuyển đổi Operator sang tiếng Việt hiển thị
const getOperatorText = (op) => {
  const map = {
    Contains: 'Chứa',
    NotContains: 'Không chứa',
    StartsWith: 'Bắt đầu với',
    EndsWith: 'Kết thúc với',
    Equals: 'Bằng',
  }
  return map[op] || op
}

/**
 * Hàm xử lý khi người dùng áp dụng bộ lọc từ component Table
 * @param {object} filterData - Dữ liệu lọc { column, value, operator... }
 * createdby: Bảo Trung
 */
const handleTableFilter = (filterData) => {
  if (filterData.remove) {
    // Trường hợp nút "Bỏ lọc" trong popover
    removeFilterTag(filterData.column)
  } else {
    // Thêm hoặc cập nhật filter
    const existingIndex = filter.value.filters.findIndex((f) => f.column === filterData.column)

    const newFilterItem = {
      column: filterData.column,
      operator: filterData.operator,
      value: filterData.value,
      label: filterData.label,
    }

    if (existingIndex >= 0) {
      filter.value.filters[existingIndex] = newFilterItem
    } else {
      filter.value.filters.push(newFilterItem)
    }

    filter.value.pageNumber = 1
    loadShifts()
  }
}

/**
 * Xóa 1 thẻ lọc (Filter Tag) trên toolbar
 * @param {string} columnKey - Mã cột cần xóa lọc
 * createdby: Bảo Trung
 */
const removeFilterTag = (columnKey) => {
  filter.value.filters = filter.value.filters.filter((f) => f.column !== columnKey)
  filter.value.pageNumber = 1
  loadShifts()
}

/**
 * Xóa tất cả các bộ lọc hiện có (Reset về mặc định)
 * createdby: Bảo Trung
 */
const clearAllFilters = () => {
  filter.value.filters = []
  filter.value.pageNumber = 1
  loadShifts()
}
/**
 * Hàm xử lý xóa 1 ca làm việc
 * @param {object} row - Dòng dữ liệu cần xóa
 * createdby: Bảo Trung
 */
const handleDelete = (row) => {
  ElMessageBox.confirm(`Bạn có chắc chắn muốn xóa ca "${row.shiftName}"?`, 'Xóa ca làm việc', {
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
    type: 'warning',
    confirmButtonClass: 'el-button--danger',
  })
    .then(async () => {
      const result = await store.removeShift(row.shiftId)
      if (result.success) {
        showToast(result.message, 'success')
        // Nếu xóa hết item trang cuối, lùi trang
        if (shifts.value.length === 0 && currentPage.value > 1) {
          currentPage.value--
        }
      } else {
        showToast('Không thể xóa bản ghi này.', 'error')
      }
    })
    .catch(() => {})
}

/**
 * Hàm nhân bản ca làm việc
 * Copy dữ liệu dòng cũ nhưng xóa ID và Code để tạo mới
 * createdby: Bảo Trung
 */
const handleDuplicate = (row) => {
  const duplicatedData = { ...row }
  duplicatedData.shiftId = null
  duplicatedData.shiftCode = ''
  shiftToEdit.value = duplicatedData
  dialogTitle.value = 'Thêm ca làm việc'
  isFormVisible.value = true
}

// --- BULK ACTIONS ---
const selectedRows = computed(() => {
  if (!selectedIds.value.length) return []
  return shifts.value.filter((shift) => selectedIds.value.includes(shift.shiftId))
})

const showActiveButton = computed(() =>
  selectedRows.value.some((row) => row.shiftStatus === WorkShiftStatus.INACTIVE),
)
const showInactiveButton = computed(() =>
  selectedRows.value.some((row) => row.shiftStatus === WorkShiftStatus.ACTIVE),
)

const handleUnselect = () => {
  selectedIds.value = []
}

/**
 * Hàm xử lý cập nhật trạng thái hàng loạt (Sử dụng / Ngừng sử dụng)
 * @param {int} newStatus - Trạng thái mới
 * createdby: Bảo Trung
 */
const handleBulkUpdate = async (newStatus) => {
  try {
    const rowsToUpdate = selectedRows.value.filter((row) => row.shiftStatus !== newStatus)
    if (rowsToUpdate.length === 0) return

    const idsToUpdate = rowsToUpdate.map((row) => row.shiftId)
    const result = await store.bulkUpdateStatus(idsToUpdate, newStatus)

    if (result.success) {
      // showToast(result.message, 'success')
      // handleUnselect()
    }
  } catch (error) {
    showToast('Lỗi cập nhật trạng thái.', 'error')
  }
}

/**
 * Hàm toggle nhanh trạng thái 1 dòng từ dropdown menu
 * createdby: Bảo Trung
 */
const handleToggleStatus = async (row, newStatus) => {
  try {
    const result = await store.bulkUpdateStatus([row.shiftId], newStatus)
    if (result.success) {
      showToast(result.message, 'success')
    }
  } catch (error) {
    showToast('Lỗi cập nhật trạng thái.', 'error')
  }
}

/**
 * Hàm xử lý xóa hàng loạt các bản ghi đã chọn
 * createdby: Bảo Trung
 */
const handleBulkDelete = () => {
  ElMessageBox.confirm(
    `Bạn muốn xóa ${selectedIds.value.length} bản ghi đã chọn?`,
    'Xóa hàng loạt',
    {
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      type: 'warning',
      confirmButtonClass: 'el-button--danger',
    },
  )
    .then(async () => {
      const idsToDelete = [...selectedIds.value]
      const result = await store.removeManyShifts(idsToDelete)

      if (result.success) {
        showToast(result.message, 'success')
        handleUnselect()
      } else {
        showToast('Lỗi khi xóa hàng loạt.', 'error')
      }
    })
    .catch(() => {})
}
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  background: #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.title-header {
  align-items: center;
  padding: 16px 24px 0 24px;
}
.candidates-wrapper {
  flex: 1;
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.toolbar {
  background-color: #fff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.table-area {
  flex: 1;
  overflow: auto;
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  background-color: #fff;
  height: 0;
}

.paging {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f3f4f6;
  border: 1px solid #e0e0e0;
  border-top: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.paging-left {
  font-size: 14px;
  color: #1f1f1f;
}

.paging-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.text-label {
  font-size: 14px;
  color: #1f1f1f;
}

.page-size-select {
  width: 70px;
}

.page-size-select :deep(.el-input__wrapper) {
  padding: 0 8px;
}

.record-range {
  font-weight: 700;
  font-size: 14px;
  color: #1f1f1f;
  min-width: 40px;
  text-align: center;
}

.pagination-buttons {
  display: flex;
  gap: 8px;
}

.nav-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9e9e9e;
  padding: 0;
}

.nav-btn:hover:not(:disabled) {
  color: #1f1f1f;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.nav-btn:disabled {
  color: #e0e0e0;
  cursor: not-allowed;
}
.title-name {
  font-weight: 500;
  font-size: 14px !important;
}
.title-header {
  height: 50px;
  display: flex;
  justify-content: space-between;
}
.title-left {
  font-size: 24px;
  font-weight: 700;
  font-family: 'Inter';
  color: #111827;
}
.toolbar-container {
  padding: 8px 16px;

  flex-direction: row;
}
.toolbar-grid-default {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.grid-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.search-container {
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: #fff;
  padding: 5px 12px;

  column-gap: 4px;
  align-items: center;
  flex: 1 1 0%;
  display: flex;
  cursor: pointer;
}
.search-container:hover {
  border-color: #009b71;
}
.icon-search {
  margin: 0 4px 0 0;
  height: 16px;
  width: 16px;
  min-height: 16px;
  min-width: 16px;
  position: relative;
  mask-repeat: no-repeat;
  background-color: #4b5563;
  mask-position: 0px 0px;
  mask-image: url(@/assets/icon/icon1.svg);
}

.texteditor-input {
  background: #fff;
  outline: none;
  border: none;
  white-space: nowrap;
  display: flex;
  width: 100%;
  font-family: Inter, Helvetica, Arial, sans-serif !important;
  padding: 0;
  color: #111827;
  font-size: 13px;
  font-weight: 400;
}
.wrap-icon-button-toolbar {
  padding: 6px 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #d1d5db;
  color: #111827;
  background-color: #fff;
  font-weight: 500;
  border-radius: 4px;
  position: relative;
  font-size: 13px;
  height: 28px;
  outline: none;
  transition: all 0.2s ease;
  cursor: pointer;
}
.wrap-icon-button-toolbar:hover {
  background-color: #f0f0f0;
}
.btn {
  background-color: #009b71;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  outline: none;
  padding: 6px 12px;
  border-radius: 4px;
  position: relative;
  font-size: 13px;
  height: 28px;
  font-weight: 500;
}
.btn:hover {
  background-color: #007b5d;
}
.total-records strong {
  color: #1f1f1f;
}
.pagination-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}
.pagination-controls select {
  height: 32px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0 8px;
}
.page-nav-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

/* Styles cho nút trong footer */
.btn-primary,
.btn-secondary {
  height: 36px;
  padding: 0 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
}
.btn-primary {
  background-color: #009b71;
  color: white;
  border-color: #009b71;
}
.btn-primary:hover {
  background-color: #008a62;
}
.btn-secondary {
  background-color: #fff;
  border-color: #dddde4;
  color: #333;
}
.btn-secondary:hover {
  background-color: #f0f0f0;
}
.grid-left {
  gap: 8px;
  flex-direction: row;
  align-items: center;
  display: flex;
}
.input-search {
  height: auto;
  width: 200px;
  padding: 0;
  gap: 1rem;
  align-items: center;
  display: flex;
}

.status-badge {
  display: inline-block;
  padding: 4px 7px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  border-radius: 999px;
}

.status-active {
  background-color: #ebfef6;
  color: #009b71;
  border: none;
}

.status-inactive {
  background-color: #fee2e2;
  color: #dc2626;
  border: none;
}

/* Bulk Actions Toolbar */
.bulk-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.selected-count {
  font-size: 14px;
  color: #111827;
}

.unselect-link {
  font-size: 14px;
  color: #009b71; /* Green color */
  cursor: pointer;
  font-weight: 500;
}

.unselect-link:hover {
  text-decoration: underline;
}

.btn-bulk {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  background-color: #fff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  transition: all 0.2s;
}

.btn-bulk:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.btn-bulk-active {
  /* color: #009b71; */
}

.btn-bulk-inactive {
  /* color: #6b7280; */
}

.btn-bulk-delete {
  border: 1px solid #dc2626;
  color: #dc2626;
  background-color: #fff;
}
.btn-bulk-delete:hover {
  background-color: #fee2e2;
  border-color: #f87171;
}

/* Action Buttons Styles */
.action-buttons-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.btn-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #4b5563;
}

.btn-circle:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.btn-edit {
  /* Custom style for edit button if needed */
}

.btn-more {
  /* Custom style for more button if needed */
}

.text-red {
  color: #ef4444 !important;
}

.btn-bulk-active {
  border: 1px solid #009b71;
  color: #009b71;
}

.btn-bulk-active:hover {
  background-color: #edfdf8;
}

.btn-bulk-inactive {
  border: 1px solid #ef4444; /* Red color */
  color: #ef4444;
}

.btn-bulk-inactive:hover {
  background-color: #fef2f2;
}

.btn-bulk-delete {
  border: 1px solid #ef4444;
  color: #ef4444;
}

.btn-bulk-delete:hover {
  background-color: #fef2f2;
}

/* Icons for bulk buttons (using font awesome or similar if available, otherwise placeholders) */
/* Assuming icons are handled via class or background image similar to existing icons */
.icon-check-circle {
  width: 16px;
  height: 16px;
  /* Replace with actual icon path or font class */
  background-color: #009b71;
  mask-image: url(@/assets/icon/icon1.svg);
  mask-repeat: no-repeat;
  mask-position: -192px 0px;
}

.icon-ban {
  width: 16px;
  height: 16px;
  background-color: #ef4444;
  mask-image: url(@/assets/icon/icon1.svg);
  mask-repeat: no-repeat;
  mask-position: -176px 0px;
}

.icon-trash {
  width: 16px;
  height: 16px;
  mask-position: -208px 0px;
  background-color: #ef4444;
  mask-image: url(@/assets/icon/icon1.svg);
  mask-repeat: no-repeat;
}
.icon-edit {
  width: 16px;
  height: 16px;
  mask-image: url(@/assets/icon/iconn.svg);
  mask-position: -36px -48px;
  mask-repeat: no-repeat;
  background-color: #4b5563;
}
.icon-reload {
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/iconn.svg);
  mask-position: -8px -48px;
  mask-repeat: no-repeat;
  background-color: #4b5563;
}
.icon-add {
  width: 16px;
  height: 16px;
  mask-image: url(@/assets/icon/icon1.svg);
  mask-position: -79px 0px;
  mask-repeat: no-repeat;
  background-color: #fff;
}
</style>

<style>
/* Global styles for pagination dropdown */
.pagination-select-dropdown .el-select-dropdown__item {
  height: 32px;
  line-height: 32px;
  padding: 0 12px;
  font-size: 14px;
}

.pagination-select-dropdown .el-select-dropdown__item.selected {
  background-color: #e5fcf4 !important;
  color: #009b71 !important;
  font-weight: normal;
}

.pagination-select-dropdown .el-select-dropdown__item:hover {
  background-color: #f5f5f5;
}

.pagination-select-dropdown .option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.pagination-select-dropdown .check-icon {
  color: #009b71;
  font-size: 14px;
}
.ml-2 {
  margin-left: 8px;
}
.gap-2 {
  gap: 8px;
}
.cursor-pointer {
  cursor: pointer;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #f3f4f6;
  border: none;
  border-radius: 4px;
  padding: 0 8px;
  font-size: 13px;
  color: #1f1f1f;
  white-space: nowrap;
  height: 28px;
}

.tag-operator {
  color: #009b71;
  font-weight: 500;
}

.tag-value {
}

.tag-close {
  margin-left: 4px;
  cursor: pointer;
  color: #757575;
  font-size: 12px;
}

.tag-close:hover {
  color: #ef4444;
}

.clear-all-filters {
  font-size: 13px;
  font-weight: 500;
}
.clear-all-filters:hover {
  text-decoration: underline;
}
</style>
