<template>
  <form class="workshift-form-container">
    <div class="form-content">
      <div class="form-layout">
        <BaseInput
          class="inline"
          v-model="formData.shiftCode"
          label="Mã ca"
          :required="true"
          placeholder="Nhập mã ca"
          :error="errors.shiftCode"
        />

        <BaseInput
          class="inline"
          v-model="formData.shiftName"
          label="Tên ca"
          :required="true"
          placeholder="Nhập tên ca"
          :error="errors.shiftName"
        />

        <div class="form-row">
          <DatetimePicker
            class="inline half"
            v-model="formData.shiftBeginTime"
            label="Giờ vào ca"
            :required="true"
            placeholder="HH:MM"
            :minute-step="30"
            :error="errors.shiftBeginTime"
          />

          <DatetimePicker
            class="inline half"
            v-model="formData.shiftEndTime"
            label="Giờ hết ca"
            :required="true"
            placeholder="HH:MM"
            :minute-step="30"
            :error="errors.shiftEndTime"
          />
        </div>

        <div class="form-row">
          <DatetimePicker
            class="inline half"
            v-model="formData.shiftBeginBreakTime"
            label="Bắt đầu nghỉ giữa ca"
            placeholder="HH:MM"
            :minute-step="30"
          />

          <DatetimePicker
            class="inline half"
            v-model="formData.shiftEndBreakTime"
            label="Kết thúc nghỉ giữa ca"
            placeholder="HH:MM"
            :minute-step="30"
          />
        </div>

        <div class="form-row">
          <BaseInput
            class="inline half"
            v-model="workTimeHours"
            label="Thời gian làm việc (giờ)"
            :disabled="true"
          />
          <BaseInput
            class="inline half"
            v-model="breakTimeHours"
            label="Thời gian nghỉ giữa ca (giờ)"
            :disabled="true"
          />
        </div>

        <div class="form-group span-row-4 inline">
          <label class="form-label">Mô tả</label>
          <div class="control-wrapper">
            <textarea
              v-model="formData.shiftDescription"
              class="text-input"
              placeholder="Nhập mô tả"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import BaseInput from '@/components/input/Input.vue'
import DatetimePicker from '@/components/datetime/DatetimePicker.vue'
const props = defineProps({
  initialData: {
    type: Object,
    default: () => null,
  },
})

const emit = defineEmits(['submit', 'cancel'])

// Hàm tạo form rỗng (đúng với Shift)
const createEmptyForm = () => ({
  shiftCode: '',
  shiftName: '',
  shiftBeginTime: null,
  shiftEndTime: null,
  shiftBeginBreakTime: null,
  shiftEndBreakTime: null,
  shiftDescription: '',
})

const formData = ref(createEmptyForm())
const errors = ref({})

/**
 * Hàm parse chuỗi "HH:mm" sang số phút trong ngày
 * @param {string} timeString - Chuỗi thời gian (ví dụ: "08:30")
 */
const parseTime = (timeString) => {
  if (!timeString) return 0
  const parts = String(timeString).split(':').map(Number)
  if (parts.length < 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) return 0
  const [hours, minutes] = parts
  return hours * 60 + minutes
}

/**
 * Tính toán thời gian làm việc (có xử lý qua đêm)
 * Trả về số giờ (dạng 8.5)
 */
const workTimeHours = computed(() => {
  const start = parseTime(formData.value.shiftBeginTime)
  const end = parseTime(formData.value.shiftEndTime)
  if (start === 0 || end === 0) return 0

  let durationMin = 0
  if (end >= start) {
    // Ca trong ngày
    durationMin = end - start
  } else {
    // Ca qua đêm (ví dụ: 22:00 - 06:00)
    const minutesInDay = 24 * 60
    durationMin = minutesInDay - start + end
  }
  return (durationMin / 60).toFixed(1) // Làm tròn 1 chữ số thập phân
})

/**
 * Tính toán thời gian nghỉ (có xử lý qua đêm)
 * Trả về số giờ (dạng 1.0)
 */
const breakTimeHours = computed(() => {
  const start = parseTime(formData.value.shiftBeginBreakTime)
  const end = parseTime(formData.value.shiftEndBreakTime)
  if (start === 0 || end === 0) return 0

  let durationMin = 0
  if (end >= start) {
    // Ca trong ngày
    durationMin = end - start
  } else {
    // Ca qua đêm
    const minutesInDay = 24 * 60
    durationMin = minutesInDay - start + end
  }
  return (durationMin / 60).toFixed(1)
})

// Watcher để cập nhật formdata khi prop initialData thay đổi (chế độ Sửa)
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.value = { ...newData }

      // Backend (Shift.cs) dùng TimeSpan, nó có thể trả về "HH:mm:ss"
      // Cần cắt bỏ ":ss" nếu có để input time (HH:mm) hiểu
      if (formData.value.shiftBeginTime && formData.value.shiftBeginTime.length > 5) {
        formData.value.shiftBeginTime = formData.value.shiftBeginTime.substring(0, 5)
      }
      if (formData.value.shiftEndTime && formData.value.shiftEndTime.length > 5) {
        formData.value.shiftEndTime = formData.value.shiftEndTime.substring(0, 5)
      }
      if (formData.value.shiftBeginBreakTime && formData.value.shiftBeginBreakTime.length > 5) {
        formData.value.shiftBeginBreakTime = formData.value.shiftBeginBreakTime.substring(0, 5)
      }
      if (formData.value.shiftEndBreakTime && formData.value.shiftEndBreakTime.length > 5) {
        formData.value.shiftEndBreakTime = formData.value.shiftEndBreakTime.substring(0, 5)
      }
    } else {
      formData.value = createEmptyForm()
      errors.value = {}
    }
  },
  {
    immediate: true,
    deep: true,
  },
)

/**
 * Validate form trước khi submit
 * Các rule dựa trên Đề đánh giá và Shift.cs
 */
const validateForm = () => {
  errors.value = {}
  let isValid = true
  const data = formData.value

  // 1. Mã ca
  if (!data.shiftCode?.trim()) {
    errors.value.shiftCode = 'Mã ca không được để trống'
    isValid = false
  } else if (data.shiftCode.length > 20) {
    errors.value.shiftCode = 'Mã ca không được vượt quá 20 ký tự'
    isValid = false
  }

  // 2. Tên ca
  if (!data.shiftName?.trim()) {
    errors.value.shiftName = 'Tên ca không được để trống'
    isValid = false
  } else if (data.shiftName.length > 50) {
    errors.value.shiftName = 'Tên ca không được vượt quá 50 ký tự'
    isValid = false
  }

  // 3. Giờ vào ca
  if (!data.shiftBeginTime) {
    errors.value.shiftBeginTime = 'Giờ vào ca không được để trống'
    isValid = false
  }

  // 4. Giờ hết ca
  if (!data.shiftEndTime) {
    errors.value.shiftEndTime = 'Giờ hết ca không được để trống'
    isValid = false
  }

  return isValid
}

/**
 * Hàm này được gọi từ component cha (WorkShift.vue)
 * Nó sẽ validate, nếu OK thì emit 'submit'
 */
const handleSubmit = () => {
  if (validateForm()) {
    // Thêm các giá trị tính toán vào object trước khi gửi đi
    const dataToSubmit = {
      ...formData.value,
      workTimeHours: parseFloat(workTimeHours.value),
      breakTimeHours: parseFloat(breakTimeHours.value),
    }
    // Thêm .value vào formData
    console.log('Dữ liệu gửi đi:', JSON.stringify(formData.value, null, 2))
    emit('submit', dataToSubmit)
  } else {
    console.log('Validate thất bại', errors.value)
    alert('Vui lòng kiểm tra lại thông tin nhập liệu!')
  }
}

/**
 * Hàm này cũng được gọi từ cha
 */
const handleCancel = () => {
  emit('cancel')
}

// Expose methods to parent (handleSubmit, handleCancel, setErrors)

// Cho phép component cha gán lỗi validation từ server
const setErrors = (serverErrors) => {
  const mapped = {}
  if (serverErrors && typeof serverErrors === 'object') {
    Object.keys(serverErrors).forEach((key) => {
      const val = serverErrors[key]
      if (Array.isArray(val) && val.length > 0) mapped[key] = String(val[0])
      else mapped[key] = String(val)
    })
  }
  errors.value = mapped
}

defineExpose({
  handleSubmit,
  handleCancel,
  setErrors,
})
</script>

<style scoped>
.workshift-form-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  font-size: 14px;
}

.form-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
}

/* Sử dụng CSS Grid cho layout 3 cột */
.form-layout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

/* Custom styling cho <textarea>
  (Sao chép từ BaseInput để nhất quán)
*/
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}
.form-group.inline :deep(.form-label) {
  width: 160px;
  margin-bottom: 0;
  flex-shrink: 0; /* Đảm bảo label không bị co lại */
}
.form-group.inline {
  flex-direction: row;
  align-items: center;
  gap: 12px;
}
.form-group.inline .form-label {
  width: 160px;
  margin-bottom: 0;
}
.form-group.inline .texteditor-input {
  width: 100%;
}
.form-row {
  display: flex;
  gap: 12px;
}
.form-row .form-group.half {
  flex: 1 1 0;
}
.form-label {
  font-weight: 500;
  color: #1f1f1f;
}
.control-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}
.text-input {
  border: 1px solid #dddde4;
  border-radius: 4px;
  padding: 9px 12px;
  height: 100%; /* Quan trọng: làm textarea co giãn */
  min-height: 100px; /* Đặt chiều cao tối thiểu */
  box-sizing: border-box;
  font-family: inherit;
  font-size: 14px;
  resize: vertical; /* Cho phép thay đổi kích thước theo chiều dọc */
}
.text-input:hover {
  border-color: #2680eb;
}
.text-input:focus {
  border-color: #2680eb;
  outline: none;
}
/* ----- Hết phần custom ----- */

/* Lớp tiện ích để "Mô tả" chiếm 4 hàng */
.span-row-4 {
  grid-row: span 4;
  display: flex; /* Cần thiết để textarea bên trong co giãn 100% */
  flex-direction: column;
}
</style>
