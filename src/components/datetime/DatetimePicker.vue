<template>
  <div class="form-group">
    <label v-if="label" class="form-label">
      {{ label }}
      <span v-if="required" class="text-required">*</span>
    </label>

    <el-time-select
      v-model="internalValue"
      :start="start"
      :end="end"
      :step="computedStep"
      :placeholder="placeholder"
      :editable="true"
      class="custom-time-select"
      :class="{ 'input-error': error }"
      :clearable="true"
      @keydown="onKeydown"
      @blur="onBlur"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ElTimeSelect } from 'element-plus'
import 'element-plus/es/components/time-select/style/css'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: String,
  placeholder: { type: String, default: 'HH:mm' },
  required: { type: Boolean, default: false },
  error: { type: String, default: '' },
  start: { type: String, default: '00:00' },
  end: { type: String, default: '23:30' },
  minuteStep: { type: Number, default: 30 },
})

const emit = defineEmits(['update:modelValue', 'blur'])

const internalValue = ref(props.modelValue)

// Chuyển đổi số phút (30) thành chuỗi ("00:30")
const computedStep = computed(() => {
  const mm = props.minuteStep
  const h = Math.floor(mm / 60)
    .toString()
    .padStart(2, '0')
  const m = (mm % 60).toString().padStart(2, '0')
  return `${h}:${m}`
})

// Đồng bộ v-model
watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val
  },
)
watch(internalValue, (val) => {
  emit('update:modelValue', val)
})

// 1. Chặn ký tự không phải số
const onKeydown = (e) => {
  const allowedKeys = [
    'Backspace',
    'Tab',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
    'Delete',
    'Home',
    'End',
  ]
  if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) {
    e.preventDefault()
  }
}

// 2. Format dữ liệu khi Blur
const onBlur = (e) => {
  let val = e.target.value.replace(/\D/g, '') // Chỉ lấy số
  if (!val) return

  let h = '',
    m = ''

  // Logic đoán giờ phút
  if (val.length === 1) {
    h = '0' + val
    m = '00'
  } else if (val.length === 2) {
    h = val
    m = '00'
  } else if (val.length === 3) {
    h = val.slice(0, 2)
    m = val.slice(2) + '0'
  } else {
    h = val.slice(0, 2)
    m = val.slice(2, 4)
  }

  // Validate giới hạn
  if (parseInt(h) > 23) h = '23'
  if (parseInt(m) > 59) m = '59'

  const finalTime = `${h}:${m}`

  internalValue.value = finalTime
  e.target.value = finalTime
  emit('blur', e)
}
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #1f1f1f;
}

.text-required {
  color: #e53935;
  margin-left: 4px;
}

.error-message {
  font-size: 12px;
  color: #e53935;
  margin-top: 4px;
}

/* --- Tùy chỉnh Element Plus --- */

/* Input Box */
:deep(.el-input__wrapper) {
  box-shadow: none !important;
  border: 1px solid #dddde4;
  border-radius: 4px;
  height: 25px !important; /* Force height */
  min-height: 25px !important;
  padding: 0 30px 0 12px;
  transition: border-color 0.3s;
  width: 100%;
  background-color: white;
}

:deep(.el-input__wrapper:hover) {
  border-color: #2680eb;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #2680eb;
  box-shadow: 0 0 0 1px #2680eb !important;
}

/* Input Text bên trong */
:deep(.el-input__inner) {
  font-size: 13px;
  color: #1f1f1f;
  height: 25px !important;
  line-height: 25px !important; /* Ensure text is centered vertically */
  font-family: inherit;
  padding: 0 !important; /* Remove default padding */
}

/* Ẩn icon mặc định bên trái của Element Plus */
:deep(.el-input__prefix) {
  display: none;
}

/* Icon lỗi */
.input-error :deep(.el-input__wrapper) {
  border-color: #e53935;
}
.input-error :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #e53935 !important;
}

/* Định vị icon đồng hồ custom sang phải */
.icon-time-wrapper {
  position: absolute;
  right: 10px;
  top: 32px; /* Adjusted for 25px height (was 38px) */
  pointer-events: none;
  color: #666;
  font-size: 14px;
}
.form-group:not(:has(.form-label)) .icon-time-wrapper {
  top: 5px; /* Adjusted for 25px height (was 10px) */
}
</style>

<style>
/* Global styles cho Dropdown */
.el-select-dropdown__item.selected {
  color: #2680eb !important;
  font-weight: 600;
}
.el-time-panel {
  border-radius: 4px;
}
</style>
