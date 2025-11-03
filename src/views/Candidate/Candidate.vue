<template>
  <div class="content">
    <div class="title-header">
      <div class="title-left">Ứng viên</div>
      <div class="title-right">
        <button class="btn" @click="isFormVisible = true">
          <div class="icon icon-add"></div>
          <span class="title-name pl-2">Thêm ứng viên</span>
        </button>
      </div>
    </div>
    <BaseDialog v-model:show="isFormVisible" title="Thêm ứng viên mới">
      <CandidateForm @cancel="isFormVisible = false" @submit="handleAddCandidate" />
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
import { ref } from 'vue'
import TheTable from '@/components/table/Table.vue'
import candidateData from '@/api/candidate-data.json'
import BaseDialog from '@/components/dialog/Dialog.vue'
import CandidateForm from '@/views/Candidate/form/CandidateForm.vue'

const isFormVisible = ref(false)

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
const handleAddCandidate = (formData) => {
  const newCandidate = {
    ...formData,
    CandidateID: new Date().getTime(),
  }
  candidateRows.value.unshift(newCandidate)
  isFormVisible.value = false
}

const candidateRows = ref(candidateData)

const handleEdit = (row) => {
  console.log('Edit:', row)
}

const handleDelete = (row) => {
  console.log('Delete:', row)
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

/* ... các style khác giữ nguyên ... */
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
</style>
