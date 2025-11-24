<template>
  <form class="workshift-form-container">
    <div class="form-content">
      <div class="form-layout">
        <el-tooltip
          :content="errors.shiftCode"
          placement="bottom"
          effect="dark"
          :disabled="!errors.shiftCode"
        >
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
        </el-tooltip>

        <el-tooltip
          :content="errors.shiftName"
          placement="bottom"
          effect="dark"
          :disabled="!errors.shiftName"
        >
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
        </el-tooltip>

        <div class="form-row">
          <el-tooltip
            :content="errors.shiftBeginTime"
            placement="bottom"
            effect="dark"
            :disabled="!errors.shiftBeginTime"
          >
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
          </el-tooltip>

          <el-tooltip
            :content="errors.shiftEndTime"
            placement="bottom"
            effect="dark"
            :disabled="!errors.shiftEndTime"
          >
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
          </el-tooltip>
        </div>

        <div class="form-row">
          <el-tooltip
            :content="errors.shiftBeginBreakTime"
            placement="bottom"
            effect="dark"
            :disabled="!errors.shiftBeginBreakTime"
          >
            <DatetimePicker
              class="inline half"
              v-model="formData.shiftBeginBreakTime"
              label="Bắt đầu nghỉ giữa ca"
              placeholder="HH:MM"
              :minute-step="30"
              :error="errors.shiftBeginBreakTime"
            />
          </el-tooltip>

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
            :modelValue="formatToIntegerDisplay(workTimeHours)"
            label="Thời gian làm việc (giờ)"
            :disabled="true"
          />
          <BaseInput
            class="inline half break-time"
            :modelValue="formatToIntegerDisplay(breakTimeHours)"
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
import useMessageBox from '@/composables/useMessageBox.js'
const props = defineProps({
  initialData: {
    type: Object,
    default: () => null,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const { confirm: showMessageBox } = useMessageBox()

/**
 * Hàm tạo object dữ liệu mặc định cho form (dùng khi thêm mới hoặc reset)
 * @returns {Object} - Object chứa các trường khởi tạo rỗng
 * createdby: Bảo Trung
 */
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
const initialFormData = ref(createEmptyForm())
const errors = ref({})

/**
 * Computed tính toán tổng thời gian làm việc dựa trên giờ bắt đầu và kết thúc
 * Có xử lý trường hợp ca làm việc qua đêm (ví dụ: 22:00 -> 06:00 hôm sau)
 * @returns {number} - Tổng số giờ làm việc (làm tròn 4 chữ số thập phân)
 * createdby: Bảo Trung
 */
const workTimeHours = computed(() => {
  const start = parseTime(formData.value.shiftBeginTime)
  const end = parseTime(formData.value.shiftEndTime)
  if (start === null || end === null) return ''

  let durationMin = 0
  if (end >= start) {
    // Ca trong ngày
    durationMin = end - start
  } else {
    // Ca qua đêm (ví dụ: 22:00 - 06:00)
    const minutesInDay = 24 * 60
    durationMin = minutesInDay - start + end
  }
  return parseFloat((durationMin / 60).toFixed(4))
})

/**
 * Computed tính toán tổng thời gian nghỉ giữa ca
 * Có xử lý trường hợp nghỉ qua đêm
 * @returns {number} - Tổng số giờ nghỉ (làm tròn 4 chữ số thập phân)
 * createdby: Bảo Trung
 */
const breakTimeHours = computed(() => {
  const start = parseTime(formData.value.shiftBeginBreakTime)
  const end = parseTime(formData.value.shiftEndBreakTime)
  if (start === null || end === null) return ''

  let durationMin = 0
  if (end >= start) {
    // Ca trong ngày
    durationMin = end - start
  } else {
    // Ca qua đêm
    const minutesInDay = 24 * 60
    durationMin = minutesInDay - start + end
  }
  return parseFloat((durationMin / 60).toFixed(4))
})

/**
 * Computed kiểm tra xem form có thay đổi so với dữ liệu ban đầu hay không
 * @returns {boolean} - True nếu có thay đổi, False nếu không
 * createdby: Bảo Trung
 */
const hasChanges = computed(() => {
  const current = formData.value
  const initial = initialFormData.value

  return (
    current.shiftCode !== initial.shiftCode ||
    current.shiftName !== initial.shiftName ||
    current.shiftBeginTime !== initial.shiftBeginTime ||
    current.shiftEndTime !== initial.shiftEndTime ||
    current.shiftBeginBreakTime !== initial.shiftBeginBreakTime ||
    current.shiftEndBreakTime !== initial.shiftEndBreakTime ||
    current.shiftDescription !== initial.shiftDescription ||
    current.shiftStatus !== initial.shiftStatus
  )
})

// Watcher để cập nhật formdata khi prop initialData thay đổi (chế độ Sửa)
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      // gán dữ liệu edit vào form
      formData.value = { ...newData }

      // loại bỏ giây nếu backend trả cả HH:mm:ss
      ;['shiftBeginTime', 'shiftEndTime', 'shiftBeginBreakTime', 'shiftEndBreakTime'].forEach(
        (key) => {
          if (formData.value[key] && formData.value[key].length > 5) {
            formData.value[key] = formData.value[key].substring(0, 5)
          }
        },
      )

      // Lưu trạng thái ban đầu để so sánh (deep clone)
      initialFormData.value = JSON.parse(JSON.stringify(formData.value))
    } else {
      formData.value = createEmptyForm()
      initialFormData.value = JSON.parse(JSON.stringify(createEmptyForm()))
      errors.value = {}
    }
  },
  {
    immediate: true,
    deep: false,
  },
)

/**
 * Hàm validate toàn bộ dữ liệu form trước khi submit
 * Kiểm tra các trường bắt buộc và logic nghiệp vụ (giờ nghỉ phải nằm trong giờ làm việc)
 * @returns {boolean} - True nếu dữ liệu hợp lệ, False nếu có lỗi
 * createdby: Bảo Trung
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

/**
 * Hàm xử lý sự kiện khi người dùng focus out khỏi ô input (Blur)
 * Kiểm tra và hiển thị/xóa lỗi cho từng trường cụ thể
 * @param {string} field - Tên trường dữ liệu (vd: 'shiftCode', 'shiftName')
 * createdby: Bảo Trung
 */
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
 * Hàm xử lý sự kiện submit form (được gọi từ component cha hoặc nút Lưu)
 * Thực hiện validate, format dữ liệu và emit sự kiện 'submit' ra ngoài
 * @returns (void)
 * createdby: Bảo Trung
 */
const handleSubmit = () => {
  if (validateForm()) {
    // Thêm các giá trị tính toán vào object trước khi gửi đi
    const dataToSubmit = {
      ...formData.value,
      workTimeHours: Number(workTimeHours.value),
      breakTimeHours: Number(breakTimeHours.value),
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
 * Hàm xử lý sự kiện hủy bỏ/đóng form
 * Kiểm tra xem có thay đổi không, nếu có thì hiển thị hộp thoại xác nhận
 * @returns (void)
 * createdby: Bảo Trung
 */
const handleCancel = async () => {
  if (hasChanges.value) {
    try {
      await showMessageBox(
        'Nếu bạn thoát, các dữ liệu đang nhập liệu sẽ không được lưu lại.',
        'Thoát và không lưu?',
        {
          confirmButtonText: 'Đồng ý',
          cancelButtonText: 'Hủy',
          type: 'info',
        },
      )
      // Nếu người dùng chọn "Đồng ý", emit sự kiện cancel
      emit('cancel')
    } catch {
      // Nếu người dùng chọn "Hủy", không làm gì (giữ form mở)
    }
  } else {
    // Không có thay đổi, đóng form ngay
    emit('cancel')
  }
}

// Cho phép component cha gán lỗi validation từ server
/**
 * Hàm gán danh sách lỗi từ Server trả về vào Form để hiển thị
 * @param {Object} serverErrors - Object lỗi từ API (key: fieldName, value: array/string)
 * createdby: Bảo Trung
 */
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

/**
 * Hàm reset form về trạng thái rỗng ban đầu và xóa các thông báo lỗi
 * @returns (void)
 * createdby: Bảo Trung
 */
const resetForm = () => {
  formData.value = createEmptyForm()
  initialFormData.value = createEmptyForm()
  errors.value = {}
}

defineExpose({
  handleSubmit,
  handleCancel,
  setErrors,
  resetForm,
})

/**
 * Hàm format giá trị số thành chuỗi hiển thị (làm tròn)
 * Dùng để hiển thị thời gian làm việc/nghỉ trên giao diện
 * @param {number|string} val - Giá trị cần format
 * @returns {string} - Chuỗi số đã làm tròn
 * createdby: Bảo Trung
 */
const formatToIntegerDisplay = (val) => {
  if (val === '' || val === null || val === undefined) return ''
  // Dùng Math.round để làm tròn (8.5 -> 9), hoặc Math.floor nếu muốn làm tròn xuống
  return String(Math.round(Number(val)))
}
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
  font-size: 12px;
}
.form-group.inline .form-label.break-time {
  width: 160px;
}

/* Input chiếm hết phần còn lại */
.form-group.inline :deep(.texteditor-input),
.form-group.inline .control-wrapper,
.form-group.inline .text-input,
.form-group.inline :deep(.custom-time-select),
.form-group.inline :deep(.el-date-editor),
.form-group.inline :deep(.time-input) {
  flex: 1;
  width: 100%;
}

.form-group.inline :deep(.custom-time-select),
.form-group.inline :deep(.el-date-editor),
.form-row .form-group.inline :deep(.texteditor-input),
.form-group.inline :deep(.time-input) {
  max-width: 122px !important;
}

/* Layout 2 cột (Giờ vào/ra, Thời gian làm việc...) */
.form-row {
  display: flex;
  justify-content: space-between;
  gap: 24px; /* Khoảng cách giữa 2 cột lớn hơn */
}

.form-row .form-group {
  width: auto !important;
  flex: 0 0 auto;
}

/* Label của cột bên phải rộng 160px */
.form-row > .form-group:nth-child(2) :deep(.form-label) {
  width: 160px !important;
}

/* Label trong 2 cột cũng cần width cố định nhưng nhỏ hơn hoặc auto?
   Theo ảnh thì label "Giờ hết ca" nằm ngay trước input.
   Để đẹp thì nên chia đều: [Label Input] -gap- [Label Input]
*/
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
