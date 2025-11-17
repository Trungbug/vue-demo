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
          {{ candidateToEdit ? 'Lưu' : 'Thêm' }}
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
                    @keydown.enter.prevent="performSearch"
                    placeholder="Tìm kiếm "
                  />
                </div>
              </div>
            </div>

            <div class="grid-right">
              <div class="wrap-icon-button-toolbar" title="Lọc">
                <div class="icon icon-filter"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="table-area">
        <TheTable
          :fields="shiftFields"
          :rows="shiftRows"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>

      <div class="paging">
        <div class="total-records">
          Tổng: <strong>{{ totalRecords }}</strong> bản ghi
        </div>
        <div class="pagination-controls">
          <span>Số bản ghi/trang</span>
          <select>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span
            ><strong>1 - {{ shiftRows.length }}</strong> bản ghi</span
          >
          <button class="page-nav-btn">&lt;</button>
          <button class="page-nav-btn">&gt;</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import TheTable from '@/components/table/Table.vue'
import BaseDialog from '@/components/dialog/Dialog.vue'
// TODO: Bước sau bạn sẽ cần tạo file WorkShiftForm.vue
// import WorkShiftForm from '@/views/WorkShift/form/WorkShiftForm.vue'
import CandidateForm from '@/views/WorkShift/form/WorkShiftForm.vue' // Tạm thời vẫn dùng form cũ
import ShiftAPI from '@/api/ShiftAPI.js'

const isFormVisible = ref(false)
const candidateFormRef = ref(null) // Sẽ đổi tên sau khi có WorkShiftForm
const shiftToEdit = ref(null) // Đổi tên từ candidateToEdit
const dialogTitle = ref('Thêm ca làm việc')

// --- PHẦN DỮ LIỆU BẢNG ---

// 1. Định nghĩa các cột cho Bảng Ca làm việc
// Các key phải khớp với ShiftDto.cs (ví dụ: shiftCode, shiftName)
//
const shiftFields = ref([
  { key: 'shiftCode', label: 'Mã ca' },
  { key: 'shiftName', label: 'Tên ca' },
  { key: 'shiftBeginTime', label: 'Giờ vào ca', type: 'text' }, // Dùng 'text' vì formatter có thể xử lý
  { key: 'shiftEndTime', label: 'Giờ hết ca', type: 'text' },
  { key: 'shiftBeginBreakTime', label: 'Bắt đầu nghỉ', type: 'text' },
  { key: 'shiftEndBreakTime', label: 'Kết thúc nghỉ', type: 'text' },
  { key: 'workTimeHours', label: 'TG Làm việc (giờ)', type: 'number' },
  { key: 'breakTimeHours', label: 'TG Nghỉ (giờ)', type: 'number' },
  // Thêm các trường khác từ file docx nếu muốn (Trạng thái, Người tạo...)
  // { key: 'shiftStatus', label: 'Trạng thái' },
])

const searchQuery = ref('')
const shiftRows = ref([]) // Dữ liệu API sẽ được đổ vào đây
const totalRecords = ref(0) // Để hiển thị tổng số

// 2. Hàm gọi API
onMounted(() => {
  loadShifts()
})

const loadShifts = async () => {
  try {
    const response = await ShiftAPI.getPaging(20, 1, searchQuery.value)

    // BE trả về cấu trúc { success: true, data: { totalRecords: ..., data: [...] } }
    //
    //
    //
    if (response.data.success) {
      shiftRows.value = response.data.data.data
      totalRecords.value = response.data.data.totalRecords
    } else {
      console.error('Lỗi từ API:', response.data.message)
    }
  } catch (err) {
    console.error('❌ Lỗi gọi API:', err)
    // Xử lý lỗi (ví dụ: hiển thị toast message)
    if (err.code === 'ERR_CERT_AUTHORITY_INVALID') {
      alert(
        'LỖI SSL: Bạn chưa chấp nhận chứng chỉ HTTPS (self-signed) của BE. Hãy mở BE URL (https://localhost:7248/api/Shift) trên tab mới và nhấn "Proceed".',
      )
    } else if (err.code === 'ERR_CONNECTION_REFUSED') {
      alert('LỖI KẾT NỐI: Backend của bạn chưa chạy?')
    }
  }
}

// 3. Hàm tìm kiếm
const performSearch = () => {
  loadShifts() // Chỉ cần gọi lại API với searchQuery
}

// --- PHẦN FORM/DIALOG ---

const openAddDialog = () => {
  shiftToEdit.value = null
  dialogTitle.value = 'Thêm ca làm việc'
  isFormVisible.value = true
}

const handleEdit = (row) => {
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
  if (candidateFormRef.value) {
    candidateFormRef.value.handleSubmit() // Sẽ cập nhật khi có WorkShiftForm
  }
}

/**
 * Hàm Lưu (Thêm mới hoặc Cập nhật)
 */
const handleSave = async (formData) => {
  try {
    if (shiftToEdit.value) {
      // Chế độ Sửa
      await ShiftAPI.update(shiftToEdit.value.shiftId, formData)
    } else {
      // Chế độ Thêm mới
      await ShiftAPI.insert(formData)
    }
    loadShifts() // Tải lại dữ liệu
    handleCancelForm() // Đóng form
  } catch (error) {
    console.error('Lỗi khi lưu:', error)
    if (error.response && error.response.status === 400) {
      //
      alert(`Lỗi: ${error.response.data.message}`)
    } else {
      alert('Có lỗi xảy ra, vui lòng thử lại.')
    }
  }
}

/**
 * Hàm Xóa
 */
const handleDelete = async (row) => {
  try {
    //
    if (confirm(`Bạn có chắc muốn xóa ca "${row.shiftName}" không?`)) {
      await ShiftAPI.delete(row.shiftId)
      loadShifts()
    }
  } catch (error) {
    console.error('Lỗi khi xóa:', error)
    alert('Có lỗi xảy ra, không thể xóa.')
  }
}

// Đây là hàm emit từ Form (sẽ đổi tên handleAddShift sau)
const handleAddCandidate = (formData) => {
  handleSave(formData)
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

.title-rigtht {
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
  -webkit-mask-repeat: no-repeat;
  background-color: #4b5563;
  mask-position: 0px 0px;
  -webkit-mask-image: url(./pas.Icon Warehouse-e29a964d.svg?v=3.1.0.6);
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
</style>
