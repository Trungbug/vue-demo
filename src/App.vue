<template>
  <div class="container d-flex flex-direction-column">
    <Header />
    <div class="content w-100 d-flex flex1">
      <Sidebar />
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Header from './components/TheHeader.vue'
import Sidebar from './components/TheSideBar.vue'
</script>

<style>
/* @import './assets/css/filter.css';
@import './assets/css/common.css';
@import './assets/css/style.css';
@import './assets/css/icon.css';
@import './assets/css/avatar.css'; */
</style>
