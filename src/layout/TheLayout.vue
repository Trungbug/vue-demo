<template>
  <div class="layout-container">
    <TheHeader />
    <div class="layout-body">
      <TheSidebar />
      <div class="layout-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import TheHeader from './header/TheHeader.vue'
import TheSidebar from './sidebar/TheSidebar.vue'
</script>

<style scoped>
/* Copy style layout từ App.vue cũ sang đây */
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.layout-body {
  display: flex;
  flex: 1;
  height: calc(100vh - 50px);
}
.layout-content {
  flex: 1;
  overflow: auto;
  background-color: #f3f4f6;
}
</style>
