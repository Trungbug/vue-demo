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
        <button type="button" class="btn-primary" @click="handleSubmitForm">
          {{ shiftToEdit ? 'Lưu' : 'Thêm' }}
        </button>
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
                <span class="selected-count">Đã chọn <strong>{{ selectedIds.length }}</strong></span>
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
              
              <div class="wrap-icon-button-toolbar" title="Lọc" v-if="selectedIds.length === 0">
                <div class="icon icon-filter"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="table-area">
        <TheTable
          :fields="shiftFields"
          :rows="paginatedShifts"
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
        </TheTable>
      </div>

      <div class="paging">
        <div class="total-records">
          Tổng: <strong>{{ totalRecords }}</strong> bản ghi
        </div>
        <div class="pagination-controls">
          <span>Số bản ghi/trang</span>
          <select v-model="pageSize">
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span
            ><strong>{{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalRecords) }}</strong> bản ghi</span
          >
          <button 
            class="page-nav-btn" 
            @click="currentPage > 1 && currentPage--"
            :disabled="currentPage === 1"
          >&lt;</button>
          <button 
            class="page-nav-btn" 
            @click="currentPage * pageSize < totalRecords && currentPage++"
            :disabled="currentPage * pageSize >= totalRecords"
          >&gt;</button>
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
import { WorkShiftStatusText, WorkShiftStatus } from '@/ultils/enums.js'
import {
  mapShiftsFromBackend,
  mapShiftFromBackend,
  mapShiftToBackend,
} from '@/ultils/formatters.js'
import { ElMessageBox, ElMessage } from 'element-plus'
const isFormVisible = ref(false)
const candidateFormRef = ref(null)
const notificationRef = ref(null)
const shiftToEdit = ref(null)
const dialogTitle = ref('Thêm ca làm việc')
const selectedIds = ref([]) // Danh sách ID các dòng được chọn


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
const shiftRows = ref([]) // Giữ lại để tránh lỗi reference nếu có, nhưng sẽ dùng paginatedShifts
const allShifts = ref([]) // Chứa toàn bộ dữ liệu
const totalRecords = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)

// 2. Hàm gọi API - Lấy TOÀN BỘ dữ liệu để filter client-side
onMounted(() => {
  loadShifts()
})

const loadShifts = async () => {
  try {
    // Lấy số lượng lớn bản ghi để filter ở client
    const response = await ShiftAPI.getPaging(10000, 1, '')

    if (response.data.success) {
      const mappedData = mapShiftsFromBackend(response.data.data.data)
      allShifts.value = mappedData
      // totalRecords sẽ được tính từ filteredShifts
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

// Computed: Filter dữ liệu
const filteredShifts = computed(() => {
  if (!searchQuery.value) return allShifts.value

  const query = searchQuery.value.toLowerCase()
  return allShifts.value.filter((shift) => {
    // 1. Tìm theo các trường text thông thường
    const textFields = ['shiftCode', 'shiftName', 'createdBy', 'updatedBy']
    const hasTextMatch = textFields.some((field) => {
      const value = shift[field]
      return value && String(value).toLowerCase().includes(query)
    })

    if (hasTextMatch) return true

    // 2. Tìm theo text của trạng thái (VD: "Đang sử dụng")
    const statusText = WorkShiftStatusText[shift.shiftStatus]
    if (statusText && statusText.toLowerCase().includes(query)) {
      return true
    }

    return false
  })
})

// Computed: Phân trang dữ liệu đã filter
const paginatedShifts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + parseInt(pageSize.value)
  return filteredShifts.value.slice(start, end)
})

// Update totalRecords dựa trên kết quả filter
watch(filteredShifts, (newVal) => {
  totalRecords.value = newVal.length
})

// Reset về trang 1 khi search thay đổi
watch(searchQuery, () => {
  currentPage.value = 1
})
// --- PHẦN FORM/DIALOG ---

const openAddDialog = () => {
  shiftToEdit.value = null
  dialogTitle.value = 'Thêm ca làm việc'
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
const handleSubmitForm = () => {
  if (candidateFormRef.value && candidateFormRef.value.handleSubmit) {
    candidateFormRef.value.handleSubmit()
  }
}

// Helper: đảm bảo time string có định dạng HH:mm:ss
const formatTimePayload = (timeStr) => {
  if (!timeStr) return null
  // Nếu có dạng HH:mm => thêm :00
  if (timeStr.length === 5) return `${timeStr}:00`
  // Nếu đã có giây hoặc khác, trả về nguyên bản
  return timeStr
}

// Simple UUID v4 generator for shiftId (frontend can generate if backend expects)
const generateUUID = () => {
  // RFC4122 version 4 compliant-ish
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
/**
 * Hàm Lưu (Thêm mới hoặc Cập nhật)
 */
const handleSave = async (formData) => {
  try {
    // Chuẩn bị payload (định dạng thời gian, các trường mặc định)
    const payload = { ...formData }

    // Format times to HH:mm:ss (backend dùng TimeSpan)
    payload.shiftBeginTime = formatTimePayload(payload.shiftBeginTime)
    payload.shiftEndTime = formatTimePayload(payload.shiftEndTime)
    payload.shiftBeginBreakTime = formatTimePayload(payload.shiftBeginBreakTime)
    payload.shiftEndBreakTime = formatTimePayload(payload.shiftEndBreakTime)

    const now = new Date().toISOString()
    if (shiftToEdit.value) {
      // Chế độ Sửa: giữ shiftId từ shiftToEdit (nếu có)
      payload.shiftId = shiftToEdit.value.shiftId || payload.shiftId
      payload.modifiedBy = payload.modifiedBy || 'admin'
      payload.modifiedDate = now
      // Map sang backend format trước khi gửi
      const backendPayload = mapShiftToBackend(payload)
      await ShiftAPI.update(payload.shiftId, backendPayload)
    } else {
      // Chế độ Thêm mới: thêm mặc định
      payload.shiftId = payload.shiftId || generateUUID()
      payload.shiftStatus = payload.shiftStatus ?? 1
      payload.createdBy = payload.createdBy || 'admin'
      payload.createdDate = payload.createdDate || now
      payload.modifiedBy = payload.modifiedBy || 'admin'
      payload.modifiedDate = payload.modifiedDate || now
      // Map sang backend format trước khi gửi
      const backendPayload = mapShiftToBackend(payload)
      await ShiftAPI.insert(backendPayload)
    }
    loadShifts() // Tải lại dữ liệu
    handleCancelForm() // Đóng form
    notificationRef.value.success(shiftToEdit.value ? 'Cập nhật thành công!' : 'Thêm mới thành công!')
  } catch (error) {
    console.error('Lỗi khi lưu:', error)
    // Cố gắng lấy thông tin lỗi có ý nghĩa từ response
    let errMsg = 'Có lỗi xảy ra, vui lòng thử lại.'
    if (error && error.response) {
      const resp = error.response
      const respData = resp.data
      // Nếu backend gửi validation errors (ASP.NET style)
      if (respData && respData.errors) {
        // Map errors (take first message for each field)
        const mapped = {}
        Object.keys(respData.errors).forEach((k) => {
          const v = respData.errors[k]
          if (Array.isArray(v) && v.length > 0) mapped[k] = String(v[0])
          else mapped[k] = String(v)
        })
        // Nếu form con tồn tại, gán lỗi để hiển thị theo field
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
  return allShifts.value.filter((shift) => selectedIds.value.includes(shift.shiftId))
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

    const idsToUpdate = rowsToUpdate.map(row => row.shiftId)
    
    await ShiftAPI.bulkUpdateStatus(idsToUpdate, newStatus)

    notificationRef.value.success('Cập nhật trạng thái thành công!')
    loadShifts()
    handleUnselect()
  } catch (error) {
    console.error('Lỗi bulk update:', error)
    let msg = 'Có lỗi xảy ra khi cập nhật trạng thái.'
    if (error.response && error.response.data) {
        msg = error.response.data.userMsg || error.response.data.devMsg || JSON.stringify(error.response.data)
    } else if (error.message) {
        msg = error.message
    }
    notificationRef.value.error(msg)
  }
}

const handleBulkDelete = () => {
  ElMessageBox.confirm(
    `Bạn có chắc chắn muốn xóa ${selectedIds.value.length} bản ghi đã chọn không?`,
    'Xóa hàng loạt',
    {
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      type: 'warning',
      confirmButtonClass: 'el-button--danger',
    },
  )
    .then(async () => {
      try {
        const promises = selectedIds.value.map((id) => ShiftAPI.delete(id))
        await Promise.all(promises)
        
        notificationRef.value.success('Xóa thành công!')
        loadShifts()
        handleUnselect()
      } catch (error) {
        console.error('Lỗi bulk delete:', error)
        notificationRef.value.error('Có lỗi xảy ra khi xóa.')
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

/* removed empty rule .title-rigtht */
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
  background-color: #2680eb;
  color: white;
  border-color: #2680eb;
}
.btn-primary:hover {
  background-color: #1a6fd1;
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
  height: 32px;
  padding: 0 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background-color: #fff;
  transition: all 0.2s ease;
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
</style>
