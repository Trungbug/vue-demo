<template>
  <form @submit.prevent="handleSubmit" class="candidate-form-container">
    <div class="form-content">
      <div class="avatar-candidate">
        <div class="form-group avatar-section">
          <div class="avatar-placeholder" @click="triggerAvatarUpload">
            <span>Ảnh</span>
            <input
              type="file"
              ref="avatarInput"
              @change="handleAvatarChange"
              style="display: none"
              accept="image/*"
            />
          </div>
        </div>
      </div>
      <div class="form-layout">
        <BaseInput
          v-model="formData.CandidateName"
          label="Họ và tên"
          :required="true"
          class="full-width"
          placeholder="Nhập họ và tên"
          :error="errors.CandidateName"
        />
        <div class="form-row">
          <BaseDatePicker
            v-model="formData.Birthday"
            label="Ngày sinh"
            placeholder="Chọn ngày sinh"
          />

          <BaseInput
            v-model="formData.Gender"
            label="Giới tính"
            placeholder="Chọn giới tính"
            class="half-width"
          />
        </div>

        <BaseInput
          v-model="formData.Area"
          label="Khu vực"
          placeholder="Chọn giá trị"
          class="span-1"
        />
        <div class="form-row">
          <BaseInput
            v-model="formData.Mobile"
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            class="half-width"
            :error="errors.Mobile"
          />
          <BaseInput
            v-model="formData.Email"
            label="Email"
            type="email"
            placeholder="Nhập Email"
            class="half-width"
            :error="errors.Email"
          />
        </div>

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
        <BaseDatePicker
          v-model="formData.Birthday"
          label="Ngày sinh"
          placeholder="Chọn ngày sinh"
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
            <BaseDatePicker
              v-model="formData.ExperienceFrom"
              placeholder="Từ tháng/năm"
              type="month"
              format="MM/YYYY"
            />
            <span>-</span>
            <BaseDatePicker
              v-model="formData.ExperienceTo"
              placeholder="Đến tháng/năm"
              type="month"
              format="MM/YYYY"
            />
            <BaseDatePicker
              v-model="formData.ExperienceTo"
              placeholder="Đến tháng/năm"
              type="month"
              format="MM/YYYY"
            />
          </div>
        </div>

        <BaseInput
          v-model="formData.ExperienceJobTitle"
          label="Vị trí công việc"
          placeholder="Nhập vị trí công việc"
          class="span-2"
        />
        <BaseInput
          v-model="formData.ExperienceDescription"
          label="Mô tả công việc"
          placeholder="Nhập mô tả công việc"
          class="span-2"
        />
      </div>
    </div>
  </form>
</template>

<script setup>
// *** THÊM 'watch' VÀO ĐÂY ***
import { ref, watch } from 'vue'
import BaseInput from '@/components/input/Input.vue'
import BaseDatePicker from '@/components/datetime/DateTimePicker.vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => null,
  },
})

const emit = defineEmits(['submit', 'cancel'])

// Hàm tạo form rỗng
const createEmptyForm = () => ({
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

const formData = ref(createEmptyForm())
const errors = ref({})

// *** THÊM WATCHER ĐỂ CẬP NHẬT FORMDATA KHI PROP THAY ĐỔI ***
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.value = { ...newData }
    } else {
      formData.value = createEmptyForm()
      errors.value = {}
    }
  },
  {
    immediate: true, // Chạy ngay khi component được tạo
    deep: true, // Cần thiết nếu `initialData` có object lồng nhau (mặc dù ở đây không)
  },
)

const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!formData.value.CandidateName?.trim()) {
    errors.value.CandidateName = 'Họ và tên không được để trống'
    isValid = false
  }

  if (formData.value.Email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.value.Email)) {
      errors.value.Email = 'Email không đúng định dạng'
      isValid = false
    }
  }

  if (formData.value.Mobile) {
    const phoneRegex = /^[0-9\s+]{10,15}$/
    if (!phoneRegex.test(formData.value.Mobile.replace(/ /g, ''))) {
      errors.value.Mobile = 'Số điện thoại không đúng định dạng'
      isValid = false
    }
  }
  if (formData.value.Birthday) {
    const birthday = new Date(formData.value.Birthday)
    const today = new Date()
    if (birthday > today) {
      errors.value.Birthday = 'Ngày sinh không thể lớn hơn ngày hiện tại'
      isValid = false
    }
  }

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', formData.value)
  } else {
    alert('Vui lòng kiểm tra lại thông tin nhập liệu!')
  }
}

const handleCancel = () => {
  emit('cancel')
}

defineExpose({
  handleSubmit,
  handleCancel,
})
</script>

<style scoped>
.candidate-form-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  font-size: 14px;
}

.form-content {
  display: flex;
  flex: 1;
  overflow-y: auto;
  padding-right: 24px;
}

.form-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.avatar-candidate {
  margin-right: 24px;
}

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

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}
.date-range span {
  flex-shrink: 0;
}

.avatar-section {
  flex: 0 0 120px;
}

.avatar-placeholder {
  width: 63px;
  height: 63px;
  border: 2px dashed #dddde4;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-align: center;
  color: #999;
  padding: 8px;
  box-sizing: border-box;
}
.avatar-placeholder:hover {
  border-color: #2680eb;
}
.avatar-placeholder i {
  font-size: 40px;
  color: #c5ccd5;
}
.avatar-placeholder span {
  font-size: 12px;
  margin-top: 8px;
}
.full-width {
  width: 100%;
}
.form-row {
  display: flex;
  justify-content: space-between;
  gap: 16px; /* khoảng cách giữa 2 input */
  width: 100%;
}

.half-width {
  flex: 1;
  width: 50%;
}
</style>
