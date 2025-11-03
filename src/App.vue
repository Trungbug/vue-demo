<template>
  <div class="layout-container">
    <!-- Header trên cùng -->
    <Header />

    <!-- Phần nội dung chính: sidebar + content -->
    <div class="layout-body">
      <Sidebar />
      <div class="layout-content">
        <!-- Nội dung của route (Candidate.vue) sẽ hiển thị ở đây -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from './layout/header/TheHeader.vue'
import Sidebar from './layout/sidebar/TheSidebar.vue'
</script>

<style scoped>
/* Container chính của toàn bộ ứng dụng */
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Chiếm toàn bộ chiều cao màn hình */
  width: 100vw; /* Chiếm toàn bộ chiều rộng màn hình */
  overflow: hidden; /* Ngăn cuộn ở cấp cao nhất */
}

/* Phần body (dưới header) chứa sidebar và content */
.layout-body {
  display: flex;
  flex: 1; /* Chiếm toàn bộ không gian còn lại dưới header */
  height: calc(100vh - 50px); /* Chiều cao = 100% viewport - chiều cao header (50px) */
  overflow: hidden; /* Ngăn cuộn ở body */
}

/* Phần nội dung chính (bên phải sidebar) */
.layout-content {
  flex: 1; /* Chiếm toàn bộ không gian còn lại bên phải sidebar */
  height: 100%; /* Chiều cao bằng layout-body */
  overflow-y: auto; /* Cho phép cuộn nội dung nếu dài hơn */
  background-color: #f3f4f6; /* Màu nền cho phần content */
}
</style>
