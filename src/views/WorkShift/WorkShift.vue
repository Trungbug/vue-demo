<template>
  <div class="content">
    <div class="title-header">
      <div class="title-left">Ca làm việc</div>
      <div class="title-right">
        <button class="btn" @click="openAddDialog">
          <div class="icon icon-add"></div>
          <span class="title-name pl-2">Thêm</span>
        </button>
      </div>
    </div>

    <BaseDialog v-model:show="isFormVisible" :title="dialogTitle">
      <CandidateForm
        ref="candidateFormRef"
        @cancel="handleCancelForm"
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
                  <div class="icon icon-check-circle"></div>
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
                  <div class="icon icon-trash"></div>
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
          :rows="shiftRows"
          v-model:selectedIds="selectedIds"
          rowKey="shiftId"
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
          <template #cell-updatedDate="{ value }">
            {{ formatDateOnly(value) }}
          </template>
        </TheTable>
      </div>

      <div class="paging">
        <div class="paging-left">
          Tổng số: <strong>{{ totalRecords }}</strong> bản ghi
        </div>
        <div class="paging-right">
          <span class="text-label">Số dòng/trang</span>
          <el-select v-model="pageSize" class="page-size-select">
            <el-option :value="5" label="5" />
            <el-option :value="20" label="20" />
            <el-option :value="30" label="30" />
            <el-option :value="50" label="50" />
            <el-option :value="100" label="100" />
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
import TheTable from '@/components/table/Table.vue'
import BaseDialog from '@/components/dialog/Dialog.vue'
import CandidateForm from '@/views/WorkShift/form/WorkShiftForm.vue'
import Notification from '@/components/notification/Notification.vue'
import ShiftAPI from '@/api/ShiftAPI.js'
import { WorkShiftStatusText, WorkShiftStatus } from '@/constants/enums.js'
import {
  mapShiftsFromBackend,
  mapShiftFromBackend,
  mapShiftToBackend,
  formatTime,
  formatDateOnly,
  formatInteger,
  formatTimeForPayload,
  generateUUID,
} from '@/ultils/formatter.js'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  EditPen,
  MoreFilled,
  CopyDocument,
  CircleClose,
  Delete,
  CircleCheck,
  DArrowLeft,
  DArrowRight,
  ArrowLeft,
  ArrowRight,
} from '@element-plus/icons-vue'
import useDialog from '@/composables/useDialog.js'
import useToast from '@/composables/useToast.js'

const isFormVisible = ref(false)
const candidateFormRef = ref(null)
const notificationRef = ref(null)
const shiftToEdit = ref(null)
const dialogTitle = ref('Thêm ca làm việc')
const selectedIds = ref([]) // Danh sách ID các dòng được chọn
const isSaveAndAdd = ref(false)
const { isDialogVisible, selectedItem, showDialog, hideDialog } = useDialog()
const { showToast } = useToast()
// --- PHẦN DỮ LIỆU BẢNG ---

// 1. Định nghĩa các cột cho Bảng Ca làm việc
// Các key phải khớp với ShiftDto.cs (ví dụ: shiftCode, shiftName)
//
const shiftFields = ref([
  { key: 'shiftCode', label: 'Mã ca', width: '120px' },
  { key: 'shiftName', label: 'Tên ca', width: '250px' },
  { key: 'shiftBeginTime', label: 'Giờ vào ca', type: 'text', width: '130px' }, // Dùng 'text' vì formatter có thể xử lý
  { key: 'shiftEndTime', label: 'Giờ hết ca', type: 'text', width: '130px' },
  { key: 'shiftBeginBreakTime', label: 'Bắt đầu nghỉ giữa ca', type: 'text', width: '200px' },
  { key: 'shiftEndBreakTime', label: 'Kết thúc nghỉ giữa ca', type: 'text', width: '210px' },
  { key: 'workTimeHours', label: 'Thời gian làm việc (giờ)', type: 'number', width: '210px' },
  { key: 'breakTimeHours', label: 'Thời gian nghỉ giữa ca (giờ)', type: 'number', width: '230px' },
  // Thêm các trường khác từ file docx nếu muốn (Trạng thái, Người tạo...)
  { key: 'shiftStatus', label: 'Trạng thái', width: '200px' },
  { key: 'createdBy', label: 'Người tạo', width: '160px' },
  { key: 'createdDate', label: 'Ngày tạo', width: '160px' },
  { key: 'updatedBy', label: 'Người sửa', width: '16px' },
  { key: 'updatedDate', label: 'Ngày cập nhật', width: '160px' },
])

const searchQuery = ref('')
const shiftRows = ref([])
const totalRecords = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)

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

// 2. Hàm gọi API - Lấy dữ liệu theo trang
onMounted(() => {
  loadShifts()
})

const loadShifts = async () => {
  try {
    const response = await ShiftAPI.getPaging(pageSize.value, currentPage.value, searchQuery.value)

    if (response.data.success) {
      const data = response.data.data
      shiftRows.value = mapShiftsFromBackend(data.data)
      totalRecords.value = data.totalRecords
    } else {
      console.error('Lỗi từ API:', response.data.message)
    }
  } catch (err) {
    console.error('❌ Lỗi gọi API:', err)
    if (err.code === 'ERR_CERT_AUTHORITY_INVALID') {
      notificationRef.value.error(
        'LỖI SSL: Bạn chưa chấp nhận chứng chỉ HTTPS (self-signed) của BE. Hãy mở BE URL (https://localhost:7248/api/Shift) trên tab mới và nhấn "Proceed".',
      )
    } else if (err.code === 'ERR_CONNECTION_REFUSED') {
      notificationRef.value.error('LỖI KẾT NỐI: Backend của bạn chưa chạy?')
    }
  }
}

// Watchers
watch([currentPage, pageSize], () => {
  loadShifts()
})

let searchTimeout
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadShifts()
  }, 500)
})
// --- PHẦN FORM/DIALOG ---

const openAddDialog = () => {
  shiftToEdit.value = null
  dialogTitle.value = 'Thêm Ca làm việc'
  isFormVisible.value = true
}

const handleEdit = (row) => {
  // Row đã được map từ API, không cần map lại
  shiftToEdit.value = { ...row }
  dialogTitle.value = 'Sửa ca làm việc'
  isFormVisible.value = true
}

const handleCancelForm = () => {
  isFormVisible.value = false
  shiftToEdit.value = null
}

// Gọi hàm submit của form con
const handleSaveOnly = () => {
  isSaveAndAdd.value = false
  if (candidateFormRef.value && candidateFormRef.value.handleSubmit) {
    candidateFormRef.value.handleSubmit()
  }
}

const handleSaveAndAdd = () => {
  isSaveAndAdd.value = true
  if (candidateFormRef.value && candidateFormRef.value.handleSubmit) {
    candidateFormRef.value.handleSubmit()
  }
}

/**
 * Chuẩn bị payload
 */
const preparePayload = (formData) => {
  const payload = { ...formData }
  payload.shiftBeginTime = formatTimeForPayload(payload.shiftBeginTime)
  payload.shiftEndTime = formatTimeForPayload(payload.shiftEndTime)
  payload.shiftBeginBreakTime = formatTimeForPayload(payload.shiftBeginBreakTime)
  payload.shiftEndBreakTime = formatTimeForPayload(payload.shiftEndBreakTime)
  return payload
}

/**
 * Xử lý thêm mới
 */
const createShift = async (payload) => {
  const now = new Date().toISOString()
  payload.shiftId = payload.shiftId || generateUUID()
  payload.shiftStatus = payload.shiftStatus ?? 1
  payload.createdBy = payload.createdBy || 'admin'
  payload.createdDate = payload.createdDate || now
  payload.modifiedBy = payload.modifiedBy || 'admin'
  payload.modifiedDate = payload.modifiedDate || now

  const backendPayload = mapShiftToBackend(payload)
  await ShiftAPI.insert(backendPayload)
}

/**
 * Xử lý cập nhật
 */
const updateShift = async (payload) => {
  const now = new Date().toISOString()
  // shiftToEdit.value chắc chắn tồn tại và có ID ở đây
  payload.shiftId = shiftToEdit.value.shiftId || payload.shiftId
  payload.modifiedBy = payload.modifiedBy || 'admin'
  payload.modifiedDate = now

  const backendPayload = mapShiftToBackend(payload)
  await ShiftAPI.update(payload.shiftId, backendPayload)
}

/**
 * Xử lý khi lưu thành công
 */
const handleSaveSuccess = () => {
  loadShifts()

  const isEdit = shiftToEdit.value && shiftToEdit.value.shiftId
  const message = isEdit ? 'Cập nhật thành công!' : 'Thêm mới thành công!'

  if (isSaveAndAdd.value) {
    notificationRef.value.success(message)

    if (candidateFormRef.value && candidateFormRef.value.resetForm) {
      candidateFormRef.value.resetForm()
    }
    // Reset về chế độ thêm mới
    shiftToEdit.value = null
    dialogTitle.value = 'Thêm ca làm việc'
  } else {
    handleCancelForm()
    notificationRef.value.success(message)
  }
}

/**
 * Xử lý lỗi khi lưu
 */
const handleSaveError = (error) => {
  console.error('Lỗi khi lưu:', error)
  let errMsg = 'Có lỗi xảy ra, vui lòng thử lại.'

  if (error && error.response) {
    const resp = error.response
    const respData = resp.data

    if (respData && respData.errors) {
      const mapped = {}
      Object.keys(respData.errors).forEach((k) => {
        const v = respData.errors[k]
        if (Array.isArray(v) && v.length > 0) mapped[k] = String(v[0])
        else mapped[k] = String(v)
      })

      if (candidateFormRef.value && candidateFormRef.value.setErrors) {
        candidateFormRef.value.setErrors(mapped)
      }
      errMsg = respData.title || 'Có lỗi validate, vui lòng kiểm tra form.'
    } else if (respData) {
      if (typeof respData === 'string') {
        errMsg = respData
      } else if (respData.message) {
        errMsg = respData.message
      } else if (respData.title) {
        errMsg = respData.title
      } else {
        try {
          errMsg = JSON.stringify(respData)
        } catch {
          errMsg = String(respData)
        }
      }
    } else {
      errMsg = resp.statusText || errMsg
    }
  } else if (error && error.message) {
    errMsg = error.message
  }

  notificationRef.value.error(`Lỗi: ${errMsg}`)
}

/**
 * Hàm Lưu (Thêm mới hoặc Cập nhật)
 */
const handleSave = async (formData) => {
  try {
    const payload = preparePayload(formData)

    if (shiftToEdit.value && shiftToEdit.value.shiftId) {
      await updateShift(payload)
    } else {
      await createShift(payload)
    }

    handleSaveSuccess()
  } catch (error) {
    handleSaveError(error)
  }
}

/**
 * Hàm Xóa
 */

/**
 * Hàm Xóa
 */
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `Ca làm việc ${row.shiftName} sau khi bị xóa sẽ không thể khôi phục. Bạn có muốn tiếp tục xóa không?`,
    'Xóa ca làm việc',
    {
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      type: 'warning',
      confirmButtonClass: 'el-button--danger', // Optional: style the delete button red
    },
  )
    .then(async () => {
      try {
        await ShiftAPI.delete(row.shiftId)
        loadShifts()
        ElMessage({
          type: 'success',
          message: 'Xóa thành công!',
        })
      } catch (error) {
        console.error('Lỗi khi xóa:', error)
        ElMessage({
          type: 'error',
          message: 'Có lỗi xảy ra, không thể xóa.',
        })
      }
    })
    .catch(() => {
      // User clicked Cancel
    })
}

// Hàm emit từ form
const handleAddCandidate = (formData) => {
  handleSave(formData)
}

// --- BULK ACTIONS ---

// Lấy danh sách object đầy đủ của các dòng đang chọn
const selectedRows = computed(() => {
  if (!selectedIds.value.length) return []
  return shiftRows.value.filter((shift) => selectedIds.value.includes(shift.shiftId))
})

// Logic hiển thị nút
const showActiveButton = computed(() => {
  // Hiển thị nút "Sử dụng" nếu có ít nhất 1 dòng đang là "Ngừng sử dụng"
  return selectedRows.value.some((row) => row.shiftStatus === WorkShiftStatus.INACTIVE)
})

const showInactiveButton = computed(() => {
  // Hiển thị nút "Ngừng sử dụng" nếu có ít nhất 1 dòng đang là "Đang sử dụng"
  return selectedRows.value.some((row) => row.shiftStatus === WorkShiftStatus.ACTIVE)
})

const handleUnselect = () => {
  selectedIds.value = []
}

const handleBulkUpdate = async (newStatus) => {
  try {
    const rowsToUpdate = selectedRows.value.filter((row) => row.shiftStatus !== newStatus)

    if (rowsToUpdate.length === 0) return

    const idsToUpdate = rowsToUpdate.map((row) => row.shiftId)

    await ShiftAPI.bulkUpdateStatus(idsToUpdate, newStatus)

    notificationRef.value.success('Cập nhật trạng thái thành công!')
    loadShifts()
    handleUnselect()
  } catch (error) {
    console.error('Lỗi bulk update:', error)
    let msg = 'Có lỗi xảy ra khi cập nhật trạng thái.'
    if (error.response && error.response.data) {
      msg =
        error.response.data.userMsg ||
        error.response.data.devMsg ||
        JSON.stringify(error.response.data)
    } else if (error.message) {
      msg = error.message
    }
    notificationRef.value.error(msg)
  }
}

const handleDuplicate = (row) => {
  const duplicatedData = { ...row }
  duplicatedData.shiftId = null
  duplicatedData.shiftCode = ''
  // duplicatedData.shiftName = ''
  // duplicatedData.createdBy = null
  // duplicatedData.createdDate = null
  // duplicatedData.modifiedBy = null
  // duplicatedData.modifiedDate = null
  shiftToEdit.value = duplicatedData
  dialogTitle.value = 'Thêm ca làm việc'
  isFormVisible.value = true
}

const handleToggleStatus = async (row, newStatus) => {
  try {
    await ShiftAPI.bulkUpdateStatus([row.shiftId], newStatus)
    notificationRef.value.success('Cập nhật trạng thái thành công!')
    loadShifts()
  } catch (error) {
    console.error('Lỗi cập nhật trạng thái:', error)
    let msg = 'Có lỗi xảy ra khi cập nhật trạng thái.'
    if (error.response && error.response.data) {
      msg =
        error.response.data.userMsg ||
        error.response.data.devMsg ||
        JSON.stringify(error.response.data)
    } else if (error.message) {
      msg = error.message
    }
    notificationRef.value.error(msg)
  }
}

const handleBulkDelete = () => {
  ElMessageBox.confirm(`Bạn có chắc chắn muốn xóa các bản ghi đã chọn không?`, 'Xóa hàng loạt', {
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
    type: 'warning',
    confirmButtonClass: 'el-button--danger',
  })
    .then(async () => {
      try {
        await ShiftAPI.deleteMany(selectedIds.value)
        notificationRef.value.success('Xóa thành công!')
        loadShifts()
        handleUnselect()
      } catch (error) {
        console.error('Lỗi bulk delete:', error)
        let msg = 'Có lỗi xảy ra khi xóa.'
        if (error.response && error.response.data) {
          msg =
            error.response.data.userMsg ||
            error.response.data.devMsg ||
            JSON.stringify(error.response.data)
        } else if (error.message) {
          msg = error.message
        }
        notificationRef.value.error(msg)
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
  background-color: #fff;
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
  -webkit-mask-repeat: no-repeat;
  background-color: #4b5563;
  mask-position: 0px 0px;
  mask-image: url('./pas.Icon Warehouse-e29a964d.svg?v=3.1.0.6');
  -webkit-mask-image: url('./pas.Icon Warehouse-e29a964d.svg?v=3.1.0.6');
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
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
}

.status-active {
  color: #009b71;
  background-color: #edfdf8;
  border: 1px solid #009b71;
}

.status-inactive {
  color: #6b7280;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
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
  color: #ef4444;
  border-color: #fca5a5;
  background-color: #fef2f2;
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
  width: 32px;
  height: 32px;
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
  mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" /></svg>');
  -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" /></svg>');
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
}

.icon-ban {
  width: 16px;
  height: 16px;
  background-color: #ef4444;
  mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clip-rule="evenodd" /></svg>'); /* Using x-circle as ban placeholder */
  -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clip-rule="evenodd" /></svg>');
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
}

.icon-trash {
  width: 16px;
  height: 16px;
  background-color: #ef4444;
  mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" /></svg>');
  -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" /></svg>');
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
}
.icon-edit {
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/iconn.svg);
  mask-position: -33px -48px;
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
</style>
