<template>
  <div class="header d-flex justify-content-space-between align-items-center">
    <div class="header-left d-flex align-items-center">
      <div class="icon-switch-app"></div>
      <div class="icon icon-logo"></div>
      <div class="title-name .m-r-24">Tuyển dụng</div>
      <div class="search-box">
        <div class="icon icon-search"></div>
        <input type="text" class="texteditor-input" placeholder="Tìm kiếm nhanh trong danh sách" />
      </div>
    </div>
    <div class="header-right d-flex align-items-center">
      <div class="world-section d-flex align-items-center">
        <div class="icon icon-world"></div>
        <span>Website tuyển dụng</span>
      </div>
      <div class="icon icon-cart"></div>
      <div class="apui-user-controlpanel-item"></div>
      <div class="icon icon-chat"></div>
      <div class="icon icon-notification"></div>
      <div class="icon icon-user"></div>
      <div class="misa-helpmenu-trigger"></div>
    </div>
  </div>
</template>

<script setup>
// Nơi để thêm logic cho component sau này
</script>

<style scoped>
/* Common styles from common.css */
.d-flex {
  display: flex;
}
.align-items-center {
  align-items: center;
}
.justify-content-space-between {
  justify-content: space-between;
}

/* Header styles from style.css */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  background-color: #fff;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.title-name {
  color: #1f1f1f;
  /* font-family: Inter; */
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  -webkit-user-select: none;
  user-select: none;
  margin-left: -12px;
}

/* Search box styles from style.css */
.search-box {
  position: relative;
  width: 300px;
}

.search-box input {
  width: 100%;
  padding: 8px 12px;
  padding-left: 32px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  outline: none;
}

.search-box i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

/* Icon styles from icon.css and style.css */
.icon {
  background-image: url('../assets/ICON.svg');
  background-repeat: no-repeat;
  background-color: transparent;
  width: 20px;
  height: 20px;
}
.icon-search {
  -webkit-mask-image: url('../icon/ICON.svg');
  -webkit-mask-position: -16px -79px; /* Sửa từ mask-repeat */
  -webkit-mask-repeat: no-repeat;
  width: 18px;
  height: 19px;
}

.icon-logo {
  background-position: -53px -411px;
  width: 54px;
  height: 54px;
}

.icon-world {
  background-position: -113px 0;
  width: 14px;
  height: 16px;
  display: flex;
  align-items: center;
}

.icon-cart {
  background-position: -22px -1266px;
  width: 16px;
  height: 16px;
}

.icon-chat {
  background-position: -7px -1097px;
  width: 34px;
  height: 34px;
}

.icon-notification {
  background-position: -2px -634px;
  width: 20px;
  height: 21px;
}

.icon-user {
  background-position: -123px -139px;
  width: 18px;
  height: 18px;
}

.icon-switch-app {
  width: 24px;
  height: 24px;
  min-width: 24px;
  background-image: url(https://amisplatform.misacdn.net/apps/recruit/icon-swich-app.9361b9384db46956.svg);
}

.apui-user-controlpanel-item {
  position: relative;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTEuNSIgY3k9IjUuNSIgcj0iMy41IiBzdHJva2U9IiM3NTc1NzUiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMy41MDYyOSAxNS43NDEzTDMuMTA2NTIgMTYuMjk2NUMxLjM5MTk2IDE4LjY3NzggMy4wOTM2OCAyMiA2LjAyODA0IDIySDE1Ljk3MkMxOC45MDYzIDIyIDIwLjYwOCAxOC42Nzc4IDE4Ljg5MzUgMTYuMjk2NUwxOC40OTM3IDE1Ljc0MTNDMTYuODAyNCAxMy4zOTIyIDE0LjA4NDUgMTIgMTEuMTg5OSAxMkgxMC44MTAxQzcuOTE1NTMgMTIgNS4xOTc2MSAxMy4zOTIyIDMuNTA2MjkgMTUuNzQxM1oiIHN0cm9rZT0iIzc1NzU3NSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTIxIDVWN1Y5IiBzdHJva2U9IiMyQ0EwMUMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik0xOSA3SDIxSDIzIiBzdHJva2U9IiMyQ0EwMUMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=);
}
.misa-helpmenu-trigger {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-position: center;
  background-size: 24px;
  background-repeat: no-repeat;
  overflow: unset;
  cursor: pointer;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+DQogIDxkZWZzPg0KICAgIDxjbGlwUGF0aCBpZD0iY2xpcC1wYXRoIj4NCiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMjgxNTkiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDI4MTU5IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ0IDc5KSIgZmlsbD0iI2ZmZiIvPg0KICAgIDwvY2xpcFBhdGg+DQogIDwvZGVmcz4NCiAgPGcgaWQ9Ikdyb3VwXzgyNzg0IiBkYXRhLW5hbWU9Ikdyb3VwIDgyNzg0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDY5OSAtMTcwKSI+DQogICAgPGcgaWQ9Ikdyb3VwXzgyNzc4IiBkYXRhLW5hbWU9Ikdyb3VwIDgyNzc4IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0NjU1IDkxKSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtcGF0aCkiPg0KICAgICAgPHBhdGggaWQ9IlBhdGhfODkwNjQiIGRhdGEtbmFtZT0iUGF0aCA4OTA2NCIgZD0iTTUzLjQsODguMzE1YTIuNjg1LDIuNjg1LDAsMCwxLDUuMjE4LjlDNTguNjEzLDkxLDU2LDkxLjksNTYsOTEuOXYuOSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNmU3MzdhIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMS44Ii8+DQogICAgICA8cGF0aCBpZD0iUGF0aF84OTA2NSIgZGF0YS1uYW1lPSJQYXRoIDg5MDY1IiBkPSJNNTYsMTAwYTksOSwwLDEsMC05LTlBOSw5LDAsMCwwLDU2LDEwMFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZlNzM3YSIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjIiLz4NCiAgICAgIDxwYXRoIGlkPSJQYXRoXzg5MDY2IiBkYXRhLW5hbWU9IlBhdGggODkwNjYiIGQ9Ik01Niw5N2ExLDEsMCwxLDAtMS0xQTEsMSwwLDAsMCw1Niw5N1oiIGZpbGw9IiM2ZTczN2EiLz4NCiAgICA8L2c+DQogIDwvZz4NCjwvc3ZnPg0K);
}
</style>
