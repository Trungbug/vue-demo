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
/**
 * Định nghĩa các Props (thuộc tính) đầu vào cho component Input
 * @property {String} modelValue - Giá trị liên kết 2 chiều (v-model)
 * @property {String} label - Tiêu đề hiển thị của ô nhập liệu
 * @property {String} placeholder - Nội dung gợi ý khi chưa nhập
 * @property {Boolean} required - Đánh dấu trường bắt buộc (hiển thị dấu *)
 * @property {String} type - Loại input (text, password, email...)
 * @property {String} error - Trạng thái lỗi (nếu có chuỗi lỗi thì viền đỏ)
 * @property {Boolean} disabled - Trạng thái vô hiệu hóa nhập liệu
 * @property {Number|String} maxLength - Độ dài tối đa cho phép nhập
 * createdby: Bảo Trung
 */
defineProps({
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

/**
 * Định nghĩa các sự kiện (Events) emit ra component cha
 * @event update:modelValue - Sự kiện cập nhật giá trị v-model khi nhập liệu
 * @event blur - Sự kiện khi con trỏ chuột rời khỏi ô input
 * createdby: Bảo Trung
 */
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
