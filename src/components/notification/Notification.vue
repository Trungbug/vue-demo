<template>
  <div v-if="isShow" class="notification" :class="type">
    <div class="notification-content">
      <div class="notification-icon"></div>
      <span class="notification-text">{{ message }}</span>
    </div>
    <span class="close-icon" @click="hideToast">✕</span>
  </div>
</template>

<script setup>
import useToast from '@/composables/useToast.js'
const { isShow, message, type, hideToast } = useToast()
</script>
