<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-grid">
      <div class="form-group">
        <label for="fullName">Họ và tên *</label>
        <input id="fullName" v-model="formData.CandidateName" type="text" required />
      </div>
      <div class="form-group">
        <label for="phoneNumber">Số điện thoại</label>
        <input id="phoneNumber" v-model="formData.Mobile" type="text" />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="formData.Email" type="email" />
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="btn-secondary" @click="handleCancel">Hủy</button>
      <button type="submit" class="btn-primary">Lưu</button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit', 'cancel'])

// Dữ liệu của form
const formData = ref({
  CandidateName: '',
  Mobile: '',
  Email: '',
  // Thêm các trường khác ở đây
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
  grid-template-columns: repeat(3, 1fr); /* Chia thành 3 cột */
  gap: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  margin-bottom: 8px;
  font-weight: 500;
}
.form-group input {
  height: 36px;
  padding: 0 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
