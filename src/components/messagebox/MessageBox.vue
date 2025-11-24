<template>
  <Teleport to="body">
    <Transition name="msgbox-fade">
      <div v-if="visible" class="msgbox-overlay" @click.self="handleCancel">
        <Transition name="msgbox-bounce">
          <div v-if="visible" class="msgbox-container">
            <!-- Close button - top right corner -->
            <button class="msgbox-close-x" @click="handleCancel" title="Đóng">×</button>

            <!-- Content with icon and title -->
            <div class="msgbox-content">
              <div v-if="type" class="msgbox-icon" :class="`msgbox-icon--${type}`">
                <!-- Info icon -->
              </div>
              <div class="msgbox-text">
                <div class="msgbox-title">{{ title }}</div>
                <div class="msgbox-message">{{ message }}</div>
              </div>
            </div>

            <!-- Footer -->
            <div class="msgbox-footer">
              <button class="msgbox-btn msgbox-btn--cancel" @click="handleCancel">
                {{ cancelButtonText }}
              </button>
              <button class="msgbox-btn msgbox-btn--confirm" @click="handleConfirm">
                {{ confirmButtonText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const title = ref('')
const message = ref('')
const type = ref('info')
const confirmButtonText = ref('Đồng ý')
const cancelButtonText = ref('Hủy')

let resolvePromise = null
let rejectPromise = null

/**
 * Hiển thị MessageBox
 */
const show = (options) => {
  return new Promise((resolve, reject) => {
    title.value = options.title || ''
    message.value = options.message || ''
    type.value = options.type || 'info'
    confirmButtonText.value = options.confirmButtonText || 'Đồng ý'
    cancelButtonText.value = options.cancelButtonText || 'Hủy'

    visible.value = true
    resolvePromise = resolve
    rejectPromise = reject
  })
}

/**
 * Xử lý khi người dùng click Confirm
 */
const handleConfirm = () => {
  visible.value = false
  if (resolvePromise) {
    resolvePromise('confirm')
  }
}

/**
 * Xử lý khi người dùng click Cancel
 */
const handleCancel = () => {
  visible.value = false
  if (rejectPromise) {
    rejectPromise('cancel')
  }
}

/**
 * Đóng MessageBox
 */
const close = () => {
  visible.value = false
}

defineExpose({
  show,
  close,
})
</script>

<style scoped>
/* Overlay */
.msgbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

/* Container */
.msgbox-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  box-shadow: 0 3px 20px #00000014;
  border-radius: 4px;
  padding: 16px;
  width: 432px;
  font-size: 14px;
}

/* Close X button - top right */
.msgbox-close-x {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  color: #909399;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: color 0.2s;
}

.msgbox-close-x:hover {
  color: #606266;
}

/* Content */
.msgbox-content {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-right: 24px;
}

.msgbox-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.msgbox-icon--info,
.msgbox-icon--warning {
  color: #409eff;
}

.msgbox-text {
  flex: 1;
}

.msgbox-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
  line-height: 1.4;
}

.msgbox-message {
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

/* Footer */
.msgbox-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.msgbox-btn {
  padding: 9px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid;
  outline: none;
  font-weight: 500;
}

/* Nút Hủy (Cancel) - Màu trắng với border */
.msgbox-btn--cancel {
  background-color: #fff;
  color: #111827;
  border-color: #dcdfe6;
}

.msgbox-btn--cancel:hover {
  color: #111827;
  border-color: #c6e2ff;
  background-color: #f3f4f6;
}

.msgbox-btn--cancel:active {
  color: #3a8ee6;
  border-color: #3a8ee6;
}

/* Nút Đồng ý (Confirm) - Màu xanh lá cây */
.msgbox-btn--confirm {
  background-color: #009b71;
  color: #fff;
  border-color: #009b71;
}

.msgbox-btn--confirm:hover {
  background-color: #00b882;
  border-color: #00b882;
}

.msgbox-btn--confirm:active {
  background-color: #007b5d;
  border-color: #007b5d;
}

/* Animations */
.msgbox-fade-enter-active,
.msgbox-fade-leave-active {
  transition: opacity 0.3s;
}

.msgbox-fade-enter-from,
.msgbox-fade-leave-to {
  opacity: 0;
}

.msgbox-bounce-enter-active {
  animation: msgbox-bounce-in 0.3s;
}

.msgbox-bounce-leave-active {
  animation: msgbox-bounce-out 0.3s;
}

@keyframes msgbox-bounce-in {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes msgbox-bounce-out {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.9);
    opacity: 0;
  }
}
</style>
