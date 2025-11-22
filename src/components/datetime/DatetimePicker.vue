<template>
  <div class="form-group">
    <label v-if="label" class="form-label">
      {{ label }}
      <span v-if="required" class="text-required">*</span>
    </label>

    <el-time-select
      ref="timeSelectRef"
      v-model="internalValue"
      :start="start"
      :end="end"
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
import { ref, watch, computed, nextTick } from 'vue'
import { ElTimeSelect } from 'element-plus'
import 'element-plus/es/components/time-select/style/css'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: String,
  placeholder: { type: String, default: 'HH:mm' },
  required: { type: Boolean, default: false },
  error: { type: String, default: '' },
  start: { type: String, default: '00:00' },
  end: { type: String, default: '23:59' },
})

const emit = defineEmits(['update:modelValue', 'blur'])
const internalValue = ref(props.modelValue)
const timeSelectRef = ref(null)

// Đồng bộ từ props vào internalValue
watch(
  () => props.modelValue,
  (v) => {
    if (v !== internalValue.value) {
      internalValue.value = v
    }
  },
)

// Watch internalValue để xử lý real-time formatting
watch(internalValue, (newVal) => {
  if (!newVal) {
    emit('update:modelValue', '')
    return
  }

  // 1. Lọc chỉ lấy số
  const cleanVal = newVal.replace(/\D/g, '').slice(0, 4)

  // 2. Format hiển thị (HH:M hoặc HH:MM)
  let formatted = cleanVal
  if (cleanVal.length >= 3) {
    formatted = cleanVal.slice(0, 2) + ':' + cleanVal.slice(2)
  }

  // 3. Nếu giá trị format khác giá trị hiện tại (ví dụ user nhập "123" -> formatted "12:3")
  // Ta cập nhật lại internalValue để UI hiển thị dấu :
  if (formatted !== newVal) {
    internalValue.value = formatted
  }

  // 4. Emit giá trị chuẩn cho v-model (HH:MM)
  // Logic:
  // - 12:3 -> 12:03 (để lưu data đúng chuẩn)
  // - 12:34 -> 12:34
  // - 12 -> 12:00
  let dataVal = formatted
  if (cleanVal.length === 3) {
    dataVal = cleanVal.slice(0, 2) + ':0' + cleanVal.slice(2)
  } else if (cleanVal.length === 2) {
    dataVal = cleanVal + ':00'
  }

  // Emit dataVal (hoặc formatted nếu muốn giữ nguyên input của user trong model cho đến khi blur)
  // Tuy nhiên, user yêu cầu "nhập đến đâu định dạng đến đấy", thường là UI.
  // Model value nên là giá trị hợp lệ hoặc đồng bộ với UI.
  // Để an toàn và tránh conflict khi user đang gõ, ta emit formatted (giống UI)
  // hoặc dataVal (đã chuẩn hóa).
  // Nếu emit dataVal (12:03) khi user thấy 12:3, có thể gây confuse nếu parent component format lại.
  // Tạm thời emit formatted để parent nắm được state hiện tại.
  emit('update:modelValue', formatted)
})

/* ----------------------------------------------
   1. ON KEYDOWN — VALIDATE CHẶT CHẼ
----------------------------------------------- */
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
  if (allowedKeys.includes(e.key)) return

  // Chỉ cho phép nhập số
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault()
    return
  }

  const el = e.target
  // Lấy giá trị số hiện tại (bỏ qua :)
  const val = el.value.replace(/\D/g, '')
  const key = e.key

  // Chặn nếu đã đủ 4 số và không bôi đen (selection)
  // Lưu ý: el.selectionStart === el.selectionEnd nghĩa là không bôi đen
  if (val.length >= 4 && el.selectionStart === el.selectionEnd) {
    e.preventDefault()
    return
  }

  // Logic validate từng vị trí số
  // Ta cần biết user đang nhập vào vị trí số thứ mấy (0, 1, 2, 3)
  // Điều này hơi phức tạp vì có dấu : xen giữa.
  // Cách đơn giản: Dự đoán chuỗi số kết quả

  // Tuy nhiên, logic đơn giản của user trước đó:
  // Rule 1: Ký tự đầu tiên (Giờ chục) - Chỉ 0, 1, 2
  if (val.length === 0) {
    if (!['0', '1', '2'].includes(key)) e.preventDefault()
  }
  // Rule 2: Ký tự thứ 2 (Giờ đơn vị)
  else if (val.length === 1) {
    if (val[0] === '2' && key > '3') e.preventDefault()
  }
  // Rule 3: Ký tự thứ 3 (Phút chục) - Chỉ 0-5
  else if (val.length === 2) {
    if (key > '5') e.preventDefault()
  }
}

/* ----------------------------------------------
   2. ON BLUR — CHUẨN HÓA CUỐI CÙNG
----------------------------------------------- */
const onBlur = (e) => {
  let val = e.target.value.replace(/\D/g, '')

  if (!val) {
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
    // Nếu user nhập 123 (hiển thị 12:3), blur sẽ thành 12:30
    h = val.slice(0, 2)
    m = val.slice(2) + '0'
  } else if (val.length >= 4) {
    h = val.slice(0, 2)
    m = val.slice(2, 4)
  }

  const finalTime = `${h}:${m}`
  internalValue.value = finalTime
  emit('update:modelValue', finalTime)
  emit('blur', e)
}
</script>

<style scoped>
/* Giữ nguyên style cũ của bạn */
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
:deep(.el-input__wrapper) {
  border: 1px solid #dddde4;
  border-radius: 4px;
  height: 30px !important;
}
:deep(.el-input__wrapper.is-focus) {
  border-color: #2680eb;
}
.input-error :deep(.el-input__wrapper) {
  border-color: #e53935 !important;
}
</style>
