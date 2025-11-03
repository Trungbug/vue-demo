<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-layout">
      <BaseInput
        v-model="formData.CandidateName"
        label="Họ và tên"
        :required="true"
        class="span-2"
        placeholder="Nhập họ và tên"
      />
      <BaseInput v-model="formData.Birthday" label="Ngày sinh" placeholder="dd/MM/yyyy" />
      <BaseInput v-model="formData.Gender" label="Giới tính" placeholder="Chọn giới tính" />

      <BaseInput
        v-model="formData.Area"
        label="Khu vực"
        placeholder="Chọn giá trị"
        class="span-1"
      />
      <BaseInput
        v-model="formData.Mobile"
        label="Số điện thoại"
        placeholder="Nhập số điện thoại"
        class="span-1"
      />
      <BaseInput
        v-model="formData.Email"
        label="Email"
        type="email"
        placeholder="Nhập Email"
        class="span-2"
      />

      <BaseInput
        v-model="formData.Address"
        label="Địa chỉ"
        placeholder="Nhập địa chỉ"
        class="span-4"
      />

      <div class="form-section-header span-4">HỌC VẤN</div>

      <BaseInput
        v-model="formData.EducationDegreeName"
        label="Trình độ đào tạo"
        placeholder="Nhập trình độ đào tạo"
        class="span-2"
      />
      <BaseInput
        v-model="formData.EducationPlaceName"
        label="Nơi đào tạo"
        placeholder="Nhập nơi đào tạo"
        class="span-2"
      />

      <BaseInput
        v-model="formData.EducationMajorName"
        label="Chuyên ngành"
        placeholder="Nhập chuyên ngành"
        class="span-2"
      />
      <div class="form-section-header span-4"></div>
      <BaseInput
        v-model="formData.ApplyDate"
        label="Ngày ứng tuyển"
        :required="true"
        placeholder="dd/MM/yyyy"
        class="span-2"
      />
      <BaseInput
        v-model="formData.ChannelName"
        label="Nguồn ứng viên"
        placeholder="Chọn nguồn ứng viên"
        class="span-2"
      />

      <BaseInput
        v-model="formData.AttractivePersonnel"
        label="Nhân sự khai thác"
        placeholder="Chọn nhân sự"
        class="span-2"
      />
      <BaseInput
        v-model="formData.Collaborator"
        label="Cộng tác viên"
        placeholder="Chọn cộng tác viên"
        class="span-2"
      />

      <BaseInput
        v-model="formData.WorkPlaceRecent"
        label="Nơi làm việc gần đây"
        placeholder="Nhập nơi làm việc gần đây"
        class="span-4"
      />

      <div class="form-section-header span-4">KINH NGHIỆM LÀM VIỆC</div>
      <BaseInput
        v-model="formData.ExperienceWorkplace"
        label="Nơi làm việc"
        placeholder="Nhập nơi làm việc"
        class="span-2"
      />
      <div class="form-group span-2">
        <label class="form-label">Thời gian</label>
        <div class="date-range">
          <BaseInput v-model="formData.ExperienceFrom" placeholder="MM/yyyy" />
          <span>-</span>
          <BaseInput v-model="formData.ExperienceTo" placeholder="MM/yyyy" />
        </div>
      </div>

      <BaseInput
        v-model="formData.ExperienceJobTitle"
        label="Vị trí công việc"
        placeholder="Nhập vị trí công việc"
        class="span-2"
      />
      <BaseInput
        vmodel="formData.ExperienceDescription"
        label="Mô tả công việc"
        placeholder="Nhập mô tả công việc"
        class="span-2"
      />
    </div>

    <div class="form-actions">
      <button type="button" class="btn-secondary" @click="handleCancel">Hủy</button>
      <button type="submit" class="btn-primary">Lưu</button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import BaseInput from '@/components/input/Input.vue'

// Tạm thời comment các component chưa tạo
// import BaseSelect from '@/components/base/BaseSelect.vue'
// import BaseDatePicker from '@/components/base/BaseDatePicker.vue'

const emit = defineEmits(['submit', 'cancel'])

// Mở rộng formData để chứa tất cả các trường trong form
const formData = ref({
  CandidateName: '',
  Birthday: '',
  Gender: '',
  Area: '',
  Mobile: '',
  Email: '',
  Address: '',
  EducationDegreeName: '',
  EducationPlaceName: '',
  EducationMajorName: '',
  ApplyDate: '',
  ChannelName: '',
  AttractivePersonnel: '',
  Collaborator: '',
  WorkPlaceRecent: '',
  ExperienceWorkplace: '',
  ExperienceFrom: '',
  ExperienceTo: '',
  ExperienceJobTitle: '',
  ExperienceDescription: '',
})

const handleSubmit = () => {
  // TODO: Thêm logic validate ở đây
  // Gửi dữ liệu form lên component cha
  emit('submit', formData.value)
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.form-layout {
  display: grid;
  /* Tạo layout 4 cột linh hoạt */
  grid-template-columns: repeat(4, 1fr);
  gap: 16px 24px; /* 16px cho khoảng cách hàng, 24px cho khoảng cách cột */
  max-height: 65vh; /* Giới hạn chiều cao và cho phép cuộn */
  overflow-y: auto; /* Bật cuộn dọc */
  padding: 0 4px; /* Thêm padding để thanh cuộn không quá sát */
}

/* Các class co dãn cột */
.span-1 {
  grid-column: span 1;
}
.span-2 {
  grid-column: span 2;
}
.span-3 {
  grid-column: span 3;
}
.span-4 {
  grid-column: span 4;
}

/* Tiêu đề cho các nhóm trường */
.form-section-header {
  grid-column: span 4;
  font-size: 16px;
  font-weight: 700;
  color: #1f1f1f;
  margin-top: 16px;
  margin-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
}

/* Dùng cho trường thời gian (Từ - Đến) */
.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}
.date-range span {
  flex-shrink: 0;
}

/* Nút bấm */
.form-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
}
.btn-primary,
.btn-secondary {
  height: 36px;
  padding: 0 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
  font-weight: 500;
}
.btn-primary {
  background-color: #2680eb;
  color: white;
  border-color: #2680eb;
}
.btn-secondary {
  background-color: #fff;
  border-color: #dddde4;
}
.btn-secondary:hover {
  background-color: #f0f0f0;
}
</style>
