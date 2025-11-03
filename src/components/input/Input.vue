<template>
  <div class="input-container">
    <input
      type="text"
      class="texteditor-input"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
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
  // Cho phép tùy chỉnh placeholder từ bên ngoài
  placeholder: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
/* Container cho ô tìm kiếm */
.input-container {
  display: flex;
  align-items: center;
  position: relative;
  width: 250px; /* Bạn có thể điều chỉnh độ rộng nếu cần */
  height: 36px;
  border: 1px solid #dddde4;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

/* Hiệu ứng khi hover */
.input-container:hover {
  border-color: #2680eb; /* Màu viền xanh khi hover */
}

/* Style cho ô input */
.texteditor-input {
  flex: 1; /* Chiếm hết không gian còn lại */
  height: 100%;
  padding: 6px 16px 6px 36px; /* Căn lề để không đè lên icon */
  border: none;
  outline: none;
  background-color: transparent; /* Nền trong suốt */
  font-size: 14px;
}
</style>
