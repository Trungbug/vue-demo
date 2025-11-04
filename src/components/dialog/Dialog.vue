<template>
  <div v-if="show" class="dialog-overlay" @click.self="close">
    <div class="dialog-content">
      <div class="dialog-header">
        <h3 class="dialog-title">{{ title }}</h3>
        <button class="close-btn" @click="close">&times;</button>
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

const emit = defineEmits(['update:show'])

const close = () => {
  emit('update:show', false)
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
  max-width: 920px;
  max-height: 610px;
  display: flex; /* Đảm bảo layout flex */
  flex-direction: column;
  width: 560px;
  height: 610px;
}
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24px 16px 0 24px;
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
  padding: 24px;
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
</style>
