<template>
  <form class="workshift-form-container">
    <div class="form-content">
      <div class="form-layout">
        <BaseInput
          class="inline"
          v-model="formData.shiftCode"
          label="Mã ca"
          :required="true"
          placeholder=""
          :error="errors.shiftCode"
          maxLength="20"
          @blur="handleBlur('shiftCode')"
        />

        <BaseInput
          class="inline"
          v-model="formData.shiftName"
          label="Tên ca"
          :required="true"
          placeholder=""
          :error="errors.shiftName"
          maxLength="50"
          @blur="handleBlur('shiftName')"
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
            @blur="handleBlur('shiftBeginTime')"
          />

          <DatetimePicker
            class="inline half"
            v-model="formData.shiftEndTime"
            label="Giờ hết ca"
            :required="true"
            placeholder="HH:MM"
            :minute-step="30"
            :error="errors.shiftEndTime"
            @blur="handleBlur('shiftEndTime')"
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
              placeholder=""
            ></textarea>
          </div>
        </div>
        <div class="form-group span-row-4 inline" v-if="formData.shiftId">
          <label class="form-label">Trạng thái</label>
          <div class="radio-group">
            <label class="radio-item">
              <input
                type="radio"
                :value="WorkShiftStatus.ACTIVE"
                v-model="formData.shiftStatus"
                name="shiftStatus"
              />
              <span class="radio-label">Đang sử dụng</span>
            </label>

            <label class="radio-item">
              <input
                type="radio"
                :value="WorkShiftStatus.INACTIVE"
                v-model="formData.shiftStatus"
                name="shiftStatus"
              />
              <span class="radio-label">Ngưng sử dụng</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import BaseInput from '@/components/input/Input.vue'
import { WorkShiftStatus } from '@/constants/enums.js'
import { parseTime } from '@/ultils/formatter.js'
import DatetimePicker from '@/components/datetime/DatetimePicker.vue'
import { ElMessageBox } from 'element-plus'
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
 * Tính toán thời gian làm việc (có xử lý qua đêm)
 * Trả về số giờ (dạng 8.5)
 */
const workTimeHours = computed(() => {
  const start = parseTime(formData.value.shiftBeginTime)
  const end = parseTime(formData.value.shiftEndTime)
  if (start === 0 || end === 0) return ''

  let durationMin = 0
  if (end >= start) {
    // Ca trong ngày
    durationMin = end - start
  } else {
    // Ca qua đêm (ví dụ: 22:00 - 06:00)
    const minutesInDay = 24 * 60
    durationMin = minutesInDay - start + end
  }
  return Math.round(durationMin / 60) // Làm tròn số tự nhiên
})

/**
 * Tính toán thời gian nghỉ (có xử lý qua đêm)
 * Trả về số giờ (dạng 1.0)
 */
const breakTimeHours = computed(() => {
  const start = parseTime(formData.value.shiftBeginBreakTime)
  const end = parseTime(formData.value.shiftEndBreakTime)
  if (start === 0 || end === 0) return ''

  let durationMin = 0
  if (end >= start) {
    // Ca trong ngày
    durationMin = end - start
  } else {
    // Ca qua đêm
    const minutesInDay = 24 * 60
    durationMin = minutesInDay - start + end
  }
  return Math.round(durationMin / 60)
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
  }

  // 2. Tên ca
  if (!data.shiftName?.trim()) {
    errors.value.shiftName = 'Tên ca không được để trống'
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

  // 5. Validate Giờ nghỉ giữa ca phải nằm trong khoảng làm việc
  if (data.shiftBeginBreakTime && data.shiftBeginTime && data.shiftEndTime) {
    const start = parseTime(data.shiftBeginTime)
    const end = parseTime(data.shiftEndTime)
    const breakStart = parseTime(data.shiftBeginBreakTime)

    let isBreakValid = false
    if (end >= start) {
      // Ca trong ngày: Start <= Break <= End
      if (breakStart >= start && breakStart <= end) {
        isBreakValid = true
      }
    } else {
      // Ca qua đêm: Break >= Start OR Break <= End
      if (breakStart >= start || breakStart <= end) {
        isBreakValid = true
      }
    }

    if (!isBreakValid) {
      errors.value.shiftBeginBreakTime =
        'Thời gian bắt đầu nghỉ phải nằm trong khoảng thời gian làm việc'
      isValid = false
    }
  }

  return isValid
}

const handleBlur = (field) => {
  if (!field) return
  const data = formData.value

  if (field === 'shiftCode' && !data.shiftCode?.trim()) {
    errors.value.shiftCode = 'Mã ca không được để trống'
  } else if (field === 'shiftCode') {
    delete errors.value.shiftCode
  }

  if (field === 'shiftName' && !data.shiftName?.trim()) {
    errors.value.shiftName = 'Tên ca không được để trống'
  } else if (field === 'shiftName') {
    delete errors.value.shiftName
  }

  if (field === 'shiftBeginTime' && !data.shiftBeginTime) {
    errors.value.shiftBeginTime = 'Giờ vào ca không được để trống'
  } else if (field === 'shiftBeginTime') {
    delete errors.value.shiftBeginTime
  }

  if (field === 'shiftEndTime' && !data.shiftEndTime) {
    errors.value.shiftEndTime = 'Giờ hết ca không được để trống'
  } else if (field === 'shiftEndTime') {
    delete errors.value.shiftEndTime
  }

  // Clear lỗi logic khi blur khỏi các ô liên quan
  if (
    ['shiftBeginTime', 'shiftEndTime', 'shiftBeginBreakTime'].includes(field) &&
    errors.value.shiftBeginBreakTime ===
      'Thời gian bắt đầu nghỉ phải nằm trong khoảng thời gian làm việc'
  ) {
    // Tạm thời xóa lỗi để user nhập lại, hoặc có thể gọi lại validateForm() nếu muốn strict
    delete errors.value.shiftBeginBreakTime
  }
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
    // Lấy thông báo lỗi đầu tiên
    const firstErrorKey = Object.keys(errors.value)[0]
    const firstErrorMessage = errors.value[firstErrorKey]

    if (firstErrorMessage) {
      ElMessageBox.alert(firstErrorMessage, 'Cảnh báo', {
        confirmButtonText: 'Đóng',
        type: 'warning',
      })
    }
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

const resetForm = () => {
  formData.value = createEmptyForm()
  errors.value = {}
}

defineExpose({
  handleSubmit,
  handleCancel,
  setErrors,
  resetForm,
})
</script>

<style scoped>
.workshift-form-container {
  display: flex;
  flex-direction: column;
  /* height: 100%; Bỏ height 100% để form tự co giãn theo content */
  /* overflow: hidden; */
  font-size: 14px;
}

/* .form-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px; 
} */

/* Scrollbar custom */
.form-content::-webkit-scrollbar {
  width: 8px;
}
.form-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.form-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}
.form-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.form-layout {
  display: flex;
  flex-direction: column;
  gap: 16px; /* Tăng khoảng cách giữa các dòng */
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

/* Style cho layout ngang (label bên trái input) */
.form-group.inline {
  flex-direction: row;
  align-items: flex-start; /* Căn trên cùng để handle textarea */
  gap: 16px;
}

/* Label cố định width */
.form-group.inline :deep(.form-label),
.form-group.inline .form-label {
  width: 140px; /* Giảm width label một chút cho cân đối */
  /* margin-bottom: 0; */
  flex-shrink: 0;
  /* padding-top: 9px; Căn giữa text label với input height 36px */
  font-weight: 500;
  color: #1f1f1f;
  font-size: 13px;
}

/* Input chiếm hết phần còn lại */
.form-group.inline :deep(.texteditor-input),
.form-group.inline .control-wrapper,
.form-group.inline .text-input,
.form-group.inline :deep(.custom-time-select),
.form-group.inline :deep(.el-date-editor) {
  flex: 1;
  width: 100%;
}

/* Layout 2 cột (Giờ vào/ra, Thời gian làm việc...) */
.form-row {
  display: flex;
  gap: 24px; /* Khoảng cách giữa 2 cột lớn hơn */
}

/* Label trong 2 cột cũng cần width cố định nhưng nhỏ hơn hoặc auto? 
   Theo ảnh thì label "Giờ hết ca" nằm ngay trước input.
   Để đẹp thì nên chia đều: [Label Input] -gap- [Label Input]
*/
.form-row .form-group.inline {
  /* gap: 12px; */
}
.form-row .form-group.inline :deep(.form-label) {
  width: 140px; /* Để label co giãn tự nhiên trong cột hẹp */
  /* min-width: 140px; Đảm bảo tối thiểu */
}

/* Readonly input style */
:deep(.texteditor-input:disabled),
.text-input:disabled {
  background-color: #f5f5f5;
  color: #666;
  cursor: not-allowed;
  border-color: #e0e0e0;
}

.form-label {
  font-weight: 500;
  color: #1f1f1f;
}

.control-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.text-input {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px 12px;
  min-height: 65px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 13px;
  resize: none; /* Không cho resize để giữ layout đẹp */
  transition: border-color 0.2s;
}

.text-input:hover,
.text-input:focus {
  border-color: #009b71; /* Màu xanh chủ đạo */
  outline: none;
}

/* Radio Group */
.radio-group {
  display: flex;
  align-items: center;
  gap: 32px;
  height: 36px;
  padding-top: 2px;
}

.radio-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
}

.radio-item input[type='radio'] {
  width: 18px;
  height: 18px;
  accent-color: #009b71;
  cursor: pointer;
  margin: 0;
}

.radio-label {
  font-size: 14px;
  color: #1f1f1f;
}
</style>
