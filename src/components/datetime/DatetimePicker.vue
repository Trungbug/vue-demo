<template>
  <div class="form-group">
    <label v-if="label" class="form-label">
      {{ label }}
      <span v-if="required" class="text-required">*</span>
    </label>

    <div class="time-picker-wrapper" ref="wrapperRef">
      <input
        ref="inputRef"
        v-model="displayValue"
        type="text"
        :placeholder="placeholder"
        class="time-input"
        :class="{ 'input-error': error }"
        @input="onInput"
        @keydown="onKeydown"
        @blur="onBlur"
        @focus="onFocus"
      />
      <span class="dropdown-icon" @click.stop="toggleDropdown">
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"
          />
        </svg>
      </span>

      <Teleport to="body">
        <div
          v-if="showDropdown"
          ref="dropdownRef"
          class="time-dropdown"
          :style="dropdownStyle"
          @mousedown.prevent
        >
          <div
            v-for="time in timeOptions"
            :key="time"
            class="time-option"
            :class="{ active: time === displayValue }"
            @mousedown.prevent="selectTime(time)"
          >
            {{ time }}
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: String,
  placeholder: { type: String, default: 'HH:mm' },
  required: { type: Boolean, default: false },
  error: { type: String, default: '' },
  start: { type: String, default: '00:00' },
  end: { type: String, default: '23:00' },
  minuteStep: { type: Number, default: 30 },
})

const emit = defineEmits(['update:modelValue', 'blur'])
const inputRef = ref(null)
const wrapperRef = ref(null)
const dropdownRef = ref(null) // Ref cho dropdown khi teleport
const displayValue = ref(props.modelValue || '')
const showDropdown = ref(false)
const dropdownStyle = ref({}) // Style động để định vị dropdown

// Generate time options based on step
const timeOptions = computed(() => {
  const options = []
  const stepMinutes = props.minuteStep

  for (let h = 0; h <= 23; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
      options.push(time)
    }
  }
  return options
})

// Đồng bộ modelValue -> displayValue
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== displayValue.value) {
      displayValue.value = newVal || ''
    }
  },
)

// Hàm tính toán vị trí Dropdown
const updateDropdownPosition = () => {
  if (inputRef.value) {
    const rect = inputRef.value.getBoundingClientRect()
    dropdownStyle.value = {
      position: 'fixed', // Dùng fixed để bám theo cửa sổ view, không phụ thuộc cha
      top: `${rect.bottom + 4}px`, // Cách đáy input 4px
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: 9999, // Z-index cực cao để nổi lên trên Dialog
    }
  }
}

const onFocus = (e) => {
  // Input focus không mở dropdown, chỉ focus để nhập liệu
  // Dropdown chỉ mở khi click vào icon
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  if (showDropdown.value) {
    nextTick(() => {
      updateDropdownPosition()
      inputRef.value?.focus()
    })
  }
}

const selectTime = (time) => {
  displayValue.value = time
  emit('update:modelValue', time)
  showDropdown.value = false
}

const onInput = (e) => {
  // Logic xử lý nhập liệu giữ nguyên như cũ
  const cursorPos = e.target.selectionStart
  let val = e.target.value
  val = val.replace(/[^\d:]/g, '')
  const cleanDigits = val.replace(/\D/g, '')

  if (cleanDigits.length > 4) return

  let formatted = ''
  if (cleanDigits.length === 0) {
    formatted = ''
  } else if (cleanDigits.length <= 2) {
    formatted = cleanDigits
  } else {
    const hours = cleanDigits.slice(0, 2)
    const minutes = cleanDigits.slice(2)
    formatted = `${hours}:${minutes}`
  }

  displayValue.value = formatted
  e.target.value = formatted
  if (cleanDigits.length === 2 && cursorPos === 2) {
    e.target.setSelectionRange(2, 2)
  } else if (cleanDigits.length === 3 && formatted.includes(':')) {
    e.target.setSelectionRange(4, 4)
  }
}

const onKeydown = (e) => {
  // Logic keydown giữ nguyên
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

  if (allowedKeys.includes(e.key)) {
    if (e.key === 'Enter') {
      e.preventDefault()
      showDropdown.value = false
      inputRef.value?.blur()
    }
    return
  }
  if (e.key === ':') {
    e.preventDefault()
    return
  }
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault()
    return
  }

  const el = e.target
  const currentDigits = el.value.replace(/\D/g, '')
  const selectionLength = el.selectionEnd - el.selectionStart

  if (selectionLength > 0) {
    const digitsAfterReplace = currentDigits.length - selectionLength + 1
    if (digitsAfterReplace > 4) {
      e.preventDefault()
      return
    }
  } else {
    if (currentDigits.length >= 4) {
      e.preventDefault()
      return
    }
  }
}

const onBlur = (e) => {
  // Logic blur giữ nguyên
  // Delay nhỏ để click event (nếu có) kịp chạy
  setTimeout(() => {
    showDropdown.value = false
  }, 10)

  let val = displayValue.value.replace(/\D/g, '')
  if (!val) {
    displayValue.value = ''
    emit('update:modelValue', '')
    emit('blur', e)
    return
  }

  let h = '00',
    m = '00'
  if (val.length === 1) {
    h = '0' + val
  } else if (val.length === 2) {
    h = val
  } else if (val.length === 3) {
    h = val.slice(0, 2)
    m = val.slice(2) + '0'
  } else {
    h = val.slice(0, 2)
    m = val.slice(2, 4)
  }

  const finalTime = `${h}:${m}`
  displayValue.value = finalTime
  emit('update:modelValue', finalTime)
  emit('blur', e)
}

// Xử lý đóng dropdown khi click ra ngoài hoặc cuộn trang
const handleClickOutside = (e) => {
  const isClickWrapper = wrapperRef.value && wrapperRef.value.contains(e.target)
  const isClickDropdown = dropdownRef.value && dropdownRef.value.contains(e.target)

  if (!isClickWrapper && !isClickDropdown) {
    showDropdown.value = false
  }
}

const handleScrollOrResize = () => {
  if (showDropdown.value) {
    // Đóng dropdown khi cuộn hoặc resize để tránh bị lệch vị trí
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScrollOrResize, true)
  window.addEventListener('resize', handleScrollOrResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScrollOrResize, true)
  window.removeEventListener('resize', handleScrollOrResize)
})
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
}

.text-required {
  color: red;
}

.time-picker-wrapper {
  position: relative;
  width: 100%;
}

.time-input {
  border: 1px solid #dddde4;
  border-radius: 4px;
  height: 30px;
  padding: 0 30px 0 11px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  width: 100%;
}

.time-input:hover {
  border-color: #c0c4cc;
}

.time-input:focus {
  border-color: #009b71;
}

.time-input.input-error {
  border-color: #e53935 !important;
}

.time-input::placeholder {
  color: #a8abb2;
}

.dropdown-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: #a8abb2;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.dropdown-icon:hover {
  color: #606266;
}

.dropdown-icon svg {
  width: 100%;
  height: 100%;
}

/* CSS cho Dropdown khi đã Teleport */
.time-dropdown {
  /* Các thuộc tính position, top, left, width được set inline bởi JS */
  box-sizing: border-box;
  background: white;
  border: 1px solid #dddde4;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  max-height: 215px;
  overflow-y: auto;
  padding: 4px 0;
}

.time-dropdown::-webkit-scrollbar {
  width: 6px;
}

.time-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.time-dropdown::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.time-dropdown::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.time-option {
  padding: 6px 10px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  margin: 2px 4px;
  border-radius: 4px;
  color: #1f1f1f;
}

.time-option:hover {
  background-color: #f5f5f5;
  color: #1f1f1f;
}

.time-option.active {
  background-color: #009b71;
  color: #fff;
  font-weight: 500;
}
</style>
