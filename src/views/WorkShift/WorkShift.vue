<template>
  <div class="content">
    <div class="title-header">
      <div class="title-left">Ứng viên</div>
      <div class="title-right">
        <button class="btn" @click="openAddDialog">
          <div class="icon icon-add"></div>
          <span class="title-name pl-2">Thêm ứng viên</span>
        </button>
      </div>
    </div>

    <BaseDialog v-model:show="isFormVisible" :title="dialogTitle">
      <CandidateForm
        ref="candidateFormRef"
        @cancel="handleCancelForm"
        @submit="handleAddCandidate"
        :initialData="candidateToEdit"
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
            <div class="grid-left"></div>

            <div class="grid-right">
              <div class="search-container">
                <div class="icon icon-search"></div>
                <input
                  type="text"
                  class="texteditor-input"
                  v-model="searchQuery"
                  @keydown.enter.prevent="performSearch"
                  placeholder="Tìm kiếm nhanh trong danh sách"
                />
              </div>
              <div class="wrap-icon-button-toolbar" title="Lọc">
                <div class="icon icon-filter"></div>
              </div>
              <div class="wrap-icon-button-toolbar" title="Xuất khẩu">
                <div class="icon icon-export"></div>
              </div>
              <div class="wrap-icon-button-toolbar" title="Lịch sử tương tác">
                <div class="icon icon-interactive-history"></div>
              </div>
              <div class="wrap-icon-button-toolbar" title="Tùy chỉnh cột">
                <div class="icon icon-setting-column"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="table-area">
        <TheTable
          :fields="candidateFields"
          :rows="candidateRows"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>

      <div class="paging">
        <div class="total-records">
          Tổng: <strong>{{ candidateRows.length }}</strong> bản ghi
        </div>
        <div class="pagination-controls">
          <span>Số bản ghi/trang</span>
          <select>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span
            ><strong>1 - {{ candidateRows.length }}</strong> bản ghi</span
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
import CandidateForm from '@/views/WorkShift/form/WorkShiftForm.vue'

const isFormVisible = ref(false)
const candidateFormRef = ref(null)

// State cho chức năng Sửa
const candidateToEdit = ref(null)
const dialogTitle = ref('Thêm ứng viên')

const candidateFields = ref([
  { key: 'CandidateName', label: 'Họ tên' },
  { key: 'Mobile', label: 'Số điện thoại' },
  { key: 'Email', label: 'Email' },
  { key: 'RecruitmentCampaignNames', label: 'Chiến dịch tuyển dụng' },
  { key: 'JobPositionName', label: 'Vị trí tuyển dụng' },
  { key: 'RecruitmentName', label: 'Tin tuyển dụng' },
  { key: 'RecruitmentRoundName', label: 'Vòng tuyển dụng' },
  { key: 'Score', label: 'Đánh giá', type: 'number' },
  { key: 'ChannelName', label: 'Nguồn ứng viên' },
  { key: 'EducationDegreeName', label: 'Trình độ đào tạo' },
  { key: 'EducationPlaceName', label: 'Nơi đào tạo' },
  { key: 'EducationMajorName', label: 'Chuyên ngành' },
  { key: 'WorkPlaceRecent', label: 'Nơi làm việc gần đây' },
  { key: 'AttractivePersonnel', label: 'Nhân sự khai thác' },
])

const searchQuery = ref('')
const masterCandidateList = ref([]) // Đã sửa lỗi typo: masterCadidateList
const candidateRows = ref([])
const STORAGE_KEY = 'candidates'

/**
 * Lấy dữ liệu ứng viên
 */
onMounted(() => {
  const storedData = localStorage.getItem(STORAGE_KEY)
  if (storedData) {
    const data = JSON.parse(storedData)
    masterCandidateList.value = data
    candidateRows.value = data
  } else {
    fetchAndStoreCandidates()
  }
})

/**
 * Hàm fetch dữ liệu từ file JSON và lưu vào localStorage
 */
const fetchAndStoreCandidates = async () => {
  try {
    const response = await fetch('/api/candidate-data.json')
    if (!response.ok) {
      throw new Error('Không thể tải dữ liệu')
    }
    const data = await response.json()

    masterCandidateList.value = data
    candidateRows.value = data

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Lỗi khi fetch dữ liệu ứng viên:', error)
  }
}

/**
 * Hàm tìm kiếm
 */
const performSearch = () => {
  const query = searchQuery.value.trim().toLowerCase()

  if (query === '') {
    candidateRows.value = masterCandidateList.value
    return
  }

  candidateRows.value = masterCandidateList.value.filter((candidate) => {
    return (
      (candidate.CandidateName?.toLowerCase() || '').includes(query) ||
      (candidate.Mobile?.toLowerCase() || '').includes(query) ||
      (candidate.Email?.toLowerCase() || '').includes(query) ||
      (candidate.RecruitmentCampaignNames?.toLowerCase() || '').includes(query) ||
      (candidate.JobPositionName?.toLowerCase() || '').includes(query) ||
      (candidate.RecruitmentName?.toLowerCase() || '').includes(query) ||
      (candidate.RecruitmentRoundName?.toLowerCase() || '').includes(query) ||
      (candidate.ChannelName?.toLowerCase() || '').includes(query) ||
      (candidate.EducationDegreeName?.toLowerCase() || '').includes(query) ||
      (candidate.EducationPlaceName?.toLowerCase() || '').includes(query) ||
      (candidate.EducationMajorName?.toLowerCase() || '').includes(query) ||
      (candidate.WorkPlaceRecent?.toLowerCase() || '').includes(query) ||
      (candidate.AttractivePersonnel?.toLowerCase() || '').includes(query)
    )
  })
}

const openAddDialog = () => {
  candidateToEdit.value = null // <-- Quan trọng: Đặt về null
  dialogTitle.value = 'Thêm ứng viên'
  isFormVisible.value = true
}

const handleEdit = (row) => {
  candidateToEdit.value = { ...row }
  dialogTitle.value = 'Chỉnh sửa thông tin ứng viên'
  isFormVisible.value = true
}

const handleCancelForm = () => {
  isFormVisible.value = false
  candidateToEdit.value = null // <-- Quan trọng: Reset khi hủy
}

// Gọi hàm submit của form con
const handleSubmitForm = () => {
  if (candidateFormRef.value) {
    candidateFormRef.value.handleSubmit()
  }
}

/**
 * Hàm Lưu (Thêm mới hoặc Cập nhật)
 */
const handleSave = (formData) => {
  if (candidateToEdit.value) {
    // Chế độ Sửa
    const index = masterCandidateList.value.findIndex(
      (c) => c.CandidateID === candidateToEdit.value.CandidateID,
    )
    if (index !== -1) {
      masterCandidateList.value[index] = { ...masterCandidateList.value[index], ...formData }
    }
  } else {
    const newCandidate = {
      ...formData,
      CandidateID: new Date().getTime(),
      Avatar: null,
      AvatarColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      RecruitmentRoundName: 'Ứng tuyển',
      Score: 0,
    }
    masterCandidateList.value.unshift(newCandidate)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(masterCandidateList.value))

  performSearch()

  handleCancelForm()
}

/**
 * Hàm Xóa
 */
const handleDelete = (row) => {
  if (confirm(`Bạn có chắc muốn xóa ứng viên "${row.CandidateName}" không?`)) {
    masterCandidateList.value = masterCandidateList.value.filter(
      (item) => item.CandidateID !== row.CandidateID,
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(masterCandidateList.value))
    performSearch()
  }
}
const handleAddCandidate = (formData) => {
  handleSave(formData)
}
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: #f3f4f6;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.title-header {
  padding: 16px 24px 0 24px;
}
.candidates-wrapper {
  flex: 1;
  padding: 24px;
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
  font-size: 20px;
  font-weight: 700;
  padding-top: 8px;
  padding-bottom: 4px;
}
.toolbar-container {
  padding: 12px 16px;
  min-height: 64px;
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
  display: flex;
  align-items: center;
  position: relative;
  width: 250px;
  height: 36px;
  border: 1px solid #dddde4;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}
.search-container:hover {
  border-color: #2680eb;
}
.icon-search {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}
.texteditor-input {
  flex: 1;
  height: 100%;
  padding: 6px 16px 6px 36px;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 14px;
}
.wrap-icon-button-toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #e0e6ec;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.wrap-icon-button-toolbar:hover {
  background-color: #f0f0f0;
}
.btn {
  width: auto;
  font-weight: 500;
  font-size: 14px !important;
  height: 36px !important;
  padding: 8px 12px !important;
  border-radius: 4px !important;
  background-color: #2680eb !important;
  color: #ffffff !important;
  border: 1px solid #e0e6ec;
  border-color: transparent !important;
  display: flex;
  align-items: center;
  gap: 8px;
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
</style>
