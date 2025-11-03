<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-grid">
      <BaseInput v-model="formData.CandidateName" label="Họ và tên" :required="true" />
      <BaseInput v-model="formData.Mobile" label="Số điện thoại" />
      <BaseInput v-model="formData.Email" label="Email" type="email" />
    </div>

    <div class="form-actions">
      <button type="button" class="btn-secondary" @click="handleCancel">Hủy</button>
      <button type="submit" class="btn-primary">Lưu</button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'

import BaseInput from '@/components/input/Input.vue'

const emit = defineEmits(['submit', 'cancel'])

const formData = ref({
  CandidateName: '',
  Mobile: '',
  Email: '',
})

const handleSubmit = () => {
  // Gửi dữ liệu form lên component cha
  emit('submit', formData.value)
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.btn-primary,
.btn-secondary {
  height: 36px;
  padding: 0 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
}
.btn-primary {
  background-color: #2680eb;
  color: white;
  border-color: #2680eb;
}
.btn-secondary {
  background-color: #f0f0f0;
}
</style>
