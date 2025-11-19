<template>
  <!-- Component này không cần render UI, chỉ dùng để gọi API của Element Plus -->
  <div style="display: none;"></div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

/**
 * Hiển thị thông báo thành công
 * @param {string} message Nội dung thông báo
 */
const success = (message) => {
  ElMessage({
    message: message,
    type: 'success',
    duration: 3000,
    showClose: true,
  })
}

/**
 * Hiển thị thông báo lỗi
 * @param {string} message Nội dung thông báo
 */
const error = (message) => {
  ElMessage({
    message: message,
    type: 'error',
    duration: 5000,
    showClose: true,
  })
}

/**
 * Hiển thị thông báo cảnh báo
 * @param {string} message Nội dung thông báo
 */
const warning = (message) => {
  ElMessage({
    message: message,
    type: 'warning',
    duration: 4000,
    showClose: true,
  })
}

/**
 * Hiển thị thông báo thông tin
 * @param {string} message Nội dung thông báo
 */
const info = (message) => {
  ElMessage({
    message: message,
    type: 'info',
    duration: 3000,
    showClose: true,
  })
}

// Expose các hàm ra ngoài để component cha có thể gọi
defineExpose({
  success,
  error,
  warning,
  info,
})
</script>
