<template>
  <div class="layout-container">
    <!-- Header trên cùng -->
    <Header />

    <!-- Phần nội dung chính: sidebar + content -->
    <div class="layout-body">
      <Sidebar />
      <div class="layout-content">
        <!-- Nội dung của route (Candidate.vue)  -->
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
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.layout-body {
  display: flex;
  flex: 1;
  height: calc(100vh - 50px);
  overflow: hidden;
}

.layout-content {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  background-color: #f3f4f6;
}
</style>
