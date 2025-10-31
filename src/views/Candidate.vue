<template>
  <div class="main-content h-100 flex1">
    <div class="content-header d-flex justify-content-space-between align-items-center">
      <h2>Ứng viên</h2>
      <button class="btn btn-primary" @click="showModal = true">+ Thêm ứng viên</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showModal = ref(false)
</script>
