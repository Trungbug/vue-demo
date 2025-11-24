<template>
  <div v-if="show" class="dialog-overlay" @click.self="close">
    <div class="dialog-content">
      <div class="dialog-header">
        <h3 class="dialog-title">{{ title }}</h3>
        <div class="header-actions">
          <div class="misa-helpmenu-trigger"></div>
          <button class="close-btn" @click="close" title="Đóng (ESC)">&times;</button>
        </div>
      </div>
      <div class="dialog-body">
        <slot></slot>
      </div>
      <div class="dialog-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, required: true },
  title: { type: String, default: 'Dialog' },
})

const emit = defineEmits(['update:show', 'close'])

const close = () => {
  emit('close')
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.dialog-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 90%;
  /* max-width: 920px;
  max-height: 610px; */
  display: flex; /* Đảm bảo layout flex */
  flex-direction: column;
  width: 680px;
  height: auto;
  max-height: 90vh;
}
.dialog-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dialog-title {
  font-size: 24px;
  font-weight: 700;
}
.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}
.dialog-body {
  flex: 1; /* Cho phép body co dãn */
  overflow-y: auto; /* Thêm thanh cuộn khi nội dung dài */
  padding: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #ddd;
  padding: 12px 16px;
  background: #fff;
  position: sticky;
  bottom: 0;
  flex-shrink: 0; /* Ngăn footer co lại */
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.misa-helpmenu-trigger {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-position: center;
  background-size: 24px;
  background-repeat: no-repeat;
  overflow: unset;
  cursor: pointer;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+DQogIDxkZWZzPg0KICAgIDxjbGlwUGF0aCBpZD0iY2xpcC1wYXRoIj4NCiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMjgxNTkiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDI4MTU5IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ0IDc5KSIgZmlsbD0iI2ZmZiIvPg0KICAgIDwvY2xpcFBhdGg+DQogIDwvZGVmcz4NCiAgPGcgaWQ9Ikdyb3VwXzgyNzg0IiBkYXRhLW5hbWU9Ikdyb3VwIDgyNzg0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDY5OSAtMTcwKSI+DQogICAgPGcgaWQ9Ikdyb3VwXzgyNzc4IiBkYXRhLW5hbWU9Ikdyb3VwIDgyNzc4IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0NjU1IDkxKSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtcGF0aCkiPg0KICAgICAgPHBhdGggaWQ9IlBhdGhfODkwNjQiIGRhdGEtbmFtZT0iUGF0aCA4OTA2NCIgZD0iTTUzLjQsODguMzE1YTIuNjg1LDIuNjg1LDAsMCwxLDUuMjE4LjlDNTguNjEzLDkxLDU2LDkxLjksNTYsOTEuOXYuOSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNmU3MzdhIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMS44Ii8+DQogICAgICA8cGF0aCBpZD0iUGF0aF84OTA2NSIgZGF0YS1uYW1lPSJQYXRoIDg5MDY1IiBkPSJNNTYsMTAwYTksOSwwLDEsMC05LTlBOSw5LDAsMCwwLDU2LDEwMFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZlNzM3YSIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjIiLz4NCiAgICAgIDxwYXRoIGlkPSJQYXRoXzg5MDY2IiBkYXRhLW5hbWU9IlBhdGggODkwNjYiIGQ9Ik01Niw5N2ExLDEsMCwxLDAtMS0xQTEsMSwwLDAsMCw1Niw5N1oiIGZpbGw9IiM2ZTczN2EiLz4NCiAgICA8L2c+DQogIDwvZz4NCjwvc3ZnPg0K);
}
</style>
