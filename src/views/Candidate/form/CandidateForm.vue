<template>
  <div class="candidate-form-container">
    <form @submit.prevent="handleSave" class="modal-body grid-2">
      <div class="left-column">
        <div class="avatar">
          <img :src="avatarPreview" alt="Ảnh ứng viên" />
        </div>
        <input
          type="file"
          @change="handleFileChange"
          accept="image/*"
          ref="fileInput"
          style="display: none"
        />
        <button type="button" class="btn-upload" @click="triggerFileInput">Tải ảnh lên</button>
      </div>

      <div class="right-column">
        <div class="form-section">
          <div class="form-group">
            <label>Họ và tên *</label>
            <input v-model="form.fullName" type="text" placeholder="Nhập họ và tên" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Ngày sinh</label>
              <input v-model="form.dob" type="date" />
            </div>
            <div class="form-group">
              <label>Giới tính</label>
              <select v-model="form.gender">
                <option value="" disabled>Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Khu vực</label>
            <div class="input-group">
              <select v-model="form.region">
                <option value="" disabled>Chọn khu vực</option>
                <option value="hanoi">Hà Nội</option>
                <option value="hcm">TP. Hồ Chí Minh</option>
              </select>
              <button type="button" class="btn-more">...</button>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Số điện thoại</label>
              <input v-model="form.phone" type="text" placeholder="Nhập số điện thoại" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="form.email" type="email" placeholder="Nhập email" />
            </div>
          </div>

          <div class="form-group">
            <label>Địa chỉ</label>
            <input v-model="form.address" type="text" placeholder="Nhập địa chỉ" />
          </div>
        </div>

        <div class="form-section education">
          <h3>Học vấn</h3>
          <div class="form-group">
            <label>Trình độ đào tạo</label>
            <input v-model="form.degree" type="text" placeholder="Trình độ đào tạo" />
          </div>
          <div class="form-group">
            <label>Nơi đào tạo</label>
            <input v-model="form.university" type="text" placeholder="Nơi đào tạo" />
          </div>
          <div class="form-group">
            <label>Chuyên ngành</label>
            <input v-model="form.major" type="text" placeholder="Chuyên ngành" />
          </div>
        </div>
      </div>
    </form>

    <div class="modal-footer">
      <button class="btn-cancel" @click="handleCancel">Hủy</button>
      <button class="btn-save" @click="handleSave">Lưu</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['cancel', 'submit'])

// State cho form, tương ứng với các input trong template
const form = ref({
  fullName: '',
  dob: '',
  gender: '',
  region: '',
  phone: '',
  email: '',
  address: '',
  degree: '',
  university: '',
  major: '',
  avatarFile: null,
})

// Ref để truy cập DOM element của input file
const fileInput = ref(null)

// Tạo URL xem trước cho ảnh
const avatarPreview = computed(() => {
  if (form.value.avatarFile) {
    return URL.createObjectURL(form.value.avatarFile)
  }
  // Ảnh mặc định
  return 'https://via.placeholder.com/150'
})

// Xử lý khi người dùng chọn một file ảnh
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.avatarFile = file
  }
}

// Trigger sự kiện click cho input file ẩn
const triggerFileInput = () => {
  fileInput.value.click()
}

const handleCancel = () => {
  emit('cancel')
}

const handleSave = () => {
  if (!form.value.fullName) {
    alert('Họ và tên là trường bắt buộc.')
    return
  }
  // Gửi dữ liệu form đến component cha (Candidate.vue)
  emit('submit', form.value)
}
</script>

<style scoped>
/* Toàn bộ CSS từ file style.css của bạn được chuyển vào đây */
.candidate-form-container {
  /* Container này sẽ được đặt bên trong .dialog-body */
  display: flex;
  flex-direction: column;
}

.modal-body {
  /* modal-body bây giờ là thẻ form, nó sẽ tự động giãn ra và được cuộn bởi .dialog-body */
}

/* Các style còn lại được giữ nguyên từ file style.css của bạn */
.grid-2 {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 32px;
}

.left-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 1px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: #f8f8f8;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-upload {
  background: #f3f4f6;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
}

.right-column {
  display: flex;
  flex-direction: column;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}
.form-group label {
  margin-bottom: 4px;
  font-weight: 500;
}

.form-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.input-group {
  display: flex;
  gap: 6px;
}

input,
select {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
  width: 100%;
  box-sizing: border-box;
}

h3 {
  margin-top: 20px;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
  /* Giữ footer ở dưới cùng */
  flex-shrink: 0;
}

.btn-cancel {
  background: #f3f4f6;
  border: 1px solid #ccc;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-save {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
