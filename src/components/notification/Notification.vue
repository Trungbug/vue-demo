<template>
  <div v-if="isShow" class="notification" :class="type">
    <div class="notification-content">
      <div class="notification-icon"></div>
      <span class="notification-text">{{ message }}</span>
    </div>
    <span class="close-icon" @click="hideToast">✕</span>
  </div>
</template>

<script setup>
import useToast from '@/composables/useToast.js'
const { isShow, message, type, hideToast } = useToast()
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999; /* Ensure it's on top of everything */
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  padding: 12px 16px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  animation: slideIn 0.3s ease-out forwards;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-text {
  font-size: 14px;
  font-weight: 500;
  color: #1f1f1f;
}

.close-icon {
  cursor: pointer;
  font-size: 16px;
  color: #999;
  margin-left: 12px;
}

.close-icon:hover {
  color: #333;
}

/* Success Type */
.notification.success {
  border-left: 4px solid #009b71; /* Green */
}
.notification.success .notification-icon {
  width: 20px;
  height: 20px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23009b71"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
}

/* Error Type */
.notification.error {
  border-left: 4px solid #ef4444; /* Red */
}
.notification.error .notification-icon {
  width: 20px;
  height: 20px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ef4444"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
}

/* Warning Type */
.notification.warning {
  border-left: 4px solid #f59e0b; /* Orange */
}
.notification.warning .notification-icon {
  width: 20px;
  height: 20px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f59e0b"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
}

/* Info Type */
.notification.info {
  border-left: 4px solid #3b82f6; /* Blue */
}
.notification.info .notification-icon {
  width: 20px;
  height: 20px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%233b82f6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
}

@keyframes slideIn {
  from {
    top: -50px;
    opacity: 0;
  }
  to {
    top: 20px;
    opacity: 1;
  }
}
</style>
