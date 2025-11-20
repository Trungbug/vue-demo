<template>
  <div class="placeholder-view">
    <h1>{{ title }}</h1>
    <p>Tính năng đang được phát triển.</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.placeholder-view {
  padding: 20px;
}
</style>
