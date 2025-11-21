<template>
  <div class="form-group">
    <label v-if="label" class="form-label">
      {{ label }}
      <span v-if="required" class="text-required">*</span>
    </label>
    <input
      :type="type"
      class="texteditor-input"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
      :class="{ 'input-error': error }"
      :disabled="disabled"
      :maxlength="maxLength"
    />
  </div>
</template>

<script setup>
defineProps({
  // Hỗ trợ v-model để truyền và cập nhật giá trị từ component cha
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'text',
  },
  error: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  maxLength: {
    type: [Number, String],
    default: null,
  },
})

defineEmits(['update:modelValue', 'blur'])
</script>

<style scoped>
/* Container cho mỗi trường input */
.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #1f1f1f;
}

.text-required {
  color: #e53935;
}

/* Style cho ô input */
.texteditor-input {
  width: 100%;
  height: 25px;
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  transition: border-color 0.3s ease;
  font-size: 14px;
  box-sizing: border-box; /* Đảm bảo padding không làm vỡ layout */
}

/* Hiệu ứng khi hover */
.texteditor-input:hover {
  border-color: #9ca3af; /* Màu viền xanh khi hover */
}

/* Hiệu ứng khi focus */
.texteditor-input:focus {
  border-color: #009b71;
  outline: none;
}

.input-error {
  border-color: #e53935;
}

.error-message {
  font-size: 12px;
  color: #e53935;
  margin-top: 4px;
}
.texteditor-input:disabled {
  background-color: #eff1f3; /* Màu nền xám nhạt */
  color: #586074; /* Màu chữ xám đậm hơn */
  cursor: not-allowed; /* Con trỏ chuột hiển thị cấm */
  border-color: #e0e0e0;
}

.texteditor-input:disabled:hover {
  border-color: #e0e0e0; /* Không đổi màu viền khi hover */
}
</style>
