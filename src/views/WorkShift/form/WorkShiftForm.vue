<template>
  <form class="workshift-form-container">
    <div class="form-content">
      <div class="form-layout">
        <BaseInput
          v-model="formData.shiftCode"
          label="Mã ca"
          :required="true"
          placeholder="Nhập mã ca"
          :error="errors.shiftCode"
          class="span-1"
        />

        <BaseInput
          v-model="formData.shiftName"
          label="Tên ca"
          :required="true"
          placeholder="Nhập tên ca"
          :error="errors.shiftName"
          class="span-1"
        />

        <BaseInput
          v-model="formData.shiftBeginTime"
          label="Giờ vào ca"
          :required="true"
          type="time"
          :error="errors.shiftBeginTime"
          class="span-1"
        />

        <BaseInput
          v-model="formData.shiftEndTime"
          label="Giờ hết ca"
          :required="true"
          type="time"
          :error="errors.shiftEndTime"
          class="span-1"
        />

        <BaseInput
          v-model="formData.shiftBeginBreakTime"
          label="Bắt đầu nghỉ giữa ca"
          type="time"
          class="span-1"
        />

        <BaseInput
          v-model="formData.shiftEndBreakTime"
          label="Kết thúc nghỉ giữa ca"
          type="time"
          class="span-1"
        />

        <BaseInput
          v-model="workTimeHours"
          label="Thời gian làm việc (giờ)"
          :disabled="true"
          class="span-1"
        />

        <BaseInput
          v-model="breakTimeHours"
          label="Thời gian nghỉ giữa ca (giờ)"
          :disabled="true"
          class="span-1"
        />

        <BaseInput
          v-model="formData.shiftDescription"
          label="Mô tả"
          placeholder="Nhập mô tả"
          class="span-2"
        />
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import BaseInput from '@/components/input/Input.vue'

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
  shiftBeginTime: null, // Dùng null cho input time
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
  try {
    const [hours, minutes] = timeString.split(':').map(Number)
    return hours * 60 + minutes
  } catch (e) {
    return 0
  }
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
 * [cite_start]Các rule dựa trên Đề đánh giá và Shift.cs [cite: 25, 27, 28]
 */
const validateForm = () => {
  errors.value = {}
  let isValid = true
  const data = formData.value[cite_start] // 1. Mã ca [cite: 25, 27]
  if (!data.shiftCode?.trim()) {
    errors.value.shiftCode = 'Mã ca không được để trống'
    isValid = false
  } else if (data.shiftCode.length > 20) {
    errors.value.shiftCode = 'Mã ca không được vượt quá 20 ký tự'
    isValid = false
  }

  ;[cite_start] // 2. Tên ca [cite: 25, 28]
  if (!data.shiftName?.trim()) {
    errors.value.shiftName = 'Tên ca không được để trống'
    isValid = false
  } else if (data.shiftName.length > 50) {
    errors.value.shiftName = 'Tên ca không được vượt quá 50 ký tự'
    isValid = false
  }

  ;[cite_start] // 3. Giờ vào ca [cite: 25]
  if (!data.shiftBeginTime) {
    errors.value.shiftBeginTime = 'Giờ vào ca không được để trống'
    isValid = false
  }

  ;[cite_start] // 4. Giờ hết ca [cite: 25]
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
    ;[cite_start] // Thêm các giá trị tính toán vào object trước khi gửi đi [cite: 23]
    const dataToSubmit = {
      ...formData.value,
      workTimeHours: parseFloat(workTimeHours.value),
      breakTimeHours: parseFloat(breakTimeHours.value),
    }
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

// Expose các hàm để component cha gọi
defineExpose({
  handleSubmit,
  handleCancel,
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
  /* padding-right: 24px; Đã có padding ở dialog rồi */
  padding: 16px 24px;
}

.form-layout {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2 cột bằng nhau */
  gap: 16px 24px; /* 16px theo chiều dọc, 24px theo chiều ngang */
  width: 100%;
}

/* class tiện ích để 1 trường chiếm 2 cột */
.span-2 {
  grid-column: span 2;
}
</style>
