<template>
  <div class="layout">
    <!-- Header trên cùng -->
    <Header />

    <!-- Phần nội dung chính: sidebar + content -->
    <div class="layout-body">
      <Sidebar />
      <div class="layout-content">
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
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
