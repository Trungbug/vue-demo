<template>
  <div class="sidebar h-100" :class="{ collapsed: isCollapsed }">
    <div
      class="sidebar-item"
      v-for="item in menu"
      :key="item.title"
      :class="{ active: item.active }"
    >
      <i :class="item.icon"></i>
      <div class="title">{{ item.title }}</div>
    </div>

    <div class="bottom-area">
      <div
        class="collape-btn align-items-center d-flex"
        title="Thu gọn sidebar"
        @click="toggleSidebar"
      >
        <div class="icon icon-collape"></div>
        <div class="title">Thu gọn</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const menu = [
  { title: 'Tin tuyển dụng', icon: 'icon icon-list' }, // Sửa lại icon cho phù hợp
  { title: 'Ứng viên', icon: 'icon icon-candidate', active: true },
  { title: 'Lịch', icon: 'fa-solid fa-calendar' },
  { title: 'Kho tiềm năng', icon: 'icon icon-sb-talent' },
  { title: 'Chiến dịch tuyển dụng', icon: 'icon icon-list' },
  { title: 'Công việc', icon: 'icon-recruitment-campaign-active' },
  { title: 'aiMarketing', icon: 'icon-email-ai-marketing' },
]
</script>

<style scoped>
/* Common styles */
.d-flex {
  display: flex;
}
.align-items-center {
  align-items: center;
}
.h-100 {
  height: 100%;
}

/* Sidebar styles from style.css */
.sidebar {
  width: 230px;
  height: calc(100vh - 60px);
  position: relative;
  background-image: url('https://amisplatform.misacdn.net/apps/recruit2/event-sidebar.1a602823bdf63dc5.svg');
  transition: width 0.18s ease;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #2e3a59;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding-top: 32px;
}

.sidebar-item {
  margin-left: 12px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 8px 12px;
  margin: 12px;
  margin-top: unset;
  transition: background 0.2s;
  border: none;
  box-shadow: none;
  outline: none;
  cursor: pointer;
  gap: 8px;
}

.sidebar-item:hover {
  color: #c5ccd5;
}
.sidebar-item.active {
  background-color: #2680eb;
}
.sidebar .title {
  font-size: 14px;
  margin-left: 12px;
}

.bottom-area {
  position: absolute;
  bottom: 16px;
  padding: 0 12px;
  width: 100%;
}

.collape-btn {
  height: 40px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 8px;
  color: #fff;
  cursor: pointer;
}

/* Collapsed styles */
.sidebar.collapsed {
  width: 64px;
}
.sidebar.collapsed .title {
  display: none;
}
.sidebar.collapsed .sidebar-item {
  justify-content: center;
  padding-left: 0;
  padding-right: 0;
}
.sidebar.collapsed .collape-btn {
  justify-content: center;
}
</style>
