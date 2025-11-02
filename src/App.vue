<template>
  <div class="layout">
    <!-- Header trên cùng -->
    <Header />

    <!-- Phần nội dung chính: sidebar + content -->
    <div class="layout-body dis-flex">
      <Sidebar />
      <div class="layout-content dis-flex">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from './components/header/TheHeader.vue'
import Sidebar from './components/sidebar/TheSidebar.vue'
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* phần dưới header chia làm 2 cột */
.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* sidebar cố định chiều rộng */
.main-layout > *:first-child {
  width: 240px; /* hoặc width: var(--sidebar-width) nếu bạn có biến CSS */
}

/* content chiếm toàn bộ phần còn lại */
.main-content {
  flex: 1;
  background-color: #f5f5f5;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
