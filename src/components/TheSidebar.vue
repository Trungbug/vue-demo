<template>
  <div class="sidebar h-100">
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
      <div class="collape-btn align-items-center d-flex" title="Thu gọn sidebar">
        <div class="icon icon-collape"></div>
        <div class="title">Thu gọn</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const menu = [
  { title: 'Tin tuyển dụng', icon: 'fa-light fa-memo-pad' },
  { title: 'Ứng viên', icon: 'icon icon-candidate', active: true },
  { title: 'Lịch', icon: 'fa-solid fa-calendar' },
  { title: 'Kho tiềm năng', icon: 'icon icon-sb-talent' },
  { title: 'Chiến dịch tuyển dụng', icon: 'icon icon-list' },
  { title: 'Công việc', icon: 'icon-recruitment-campaign-active' },
  { title: 'aiMarketing', icon: 'icon-email-ai-marketing' },
]
</script>
