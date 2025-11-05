<template>
  <div class="header d-flex justify-content-space-between align-items-center">
    <div class="header-left d-flex align-items-center">
      <div class="icon-switch-app"></div>
      <div class="navbar-wrap">
        <div class="icon-logo"></div>
      </div>
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
      <div class="icon-notification"></div>
      <div class="icon-cart"></div>
      <div class="apui-user-controlpanel-item"></div>
      <div class="icon-chat"></div>
      <div class="icon-mess"></div>
      <div class="misa-helpmenu-trigger"></div>
      <div class="icon-more"></div>
      <div class="icon-know"></div>
      <div class="icon icon-user"></div>
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
  margin-left: -20px;
}

/*  */
.search-box {
  display: flex;
  align-items: center;
  position: relative;
  width: 370px;
  height: 36px;
  border: 1px solid #dddde4;
  border-radius: 4px;
  transition: border-color 0.3s ease;
  padding-left: 10px;
  background: rgba(0, 0, 0, 0);
  color: #333;
}

.search-box input {
  padding-left: 10px !important;
  padding-top: 1px !important;
  padding-bottom: 1px !important;
  width: 100%;
  height: 100%;
  border: none;
}

.search-box input:focus {
  outline: none;
}
.search-box i {
}

/* Icon styles from icon.css and style.css */
/* .icon {
  background-image: url('../assets/ICON.svg');
  background-repeat: no-repeat;
  background-color: transparent;
  width: 20px;
  height: 20px;
} */

.world-section {
  min-width: 153px;
}
.icon-logo {
  background-position: -53px -411px;
  width: 54px;
  height: 54px;
}
.icon-search {
}
.icon-mess {
  background-image: url('@/assets/icon/mess.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 24px;
  position: relative;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.icon-world {
  width: 20px;
  height: 21px;
  min-width: 20px;
  -webkit-mask-image: url(https://amisplatform.misacdn.net/apps/recruit/assets/images/ICON.svg);
  -webkit-mask-position: 0px -608px;
  -webkit-mask-repeat: no-repeat;
  margin-right: 10px;
  margin-top: 3px;
  background-color: #7a8188 !important;
}
.icon-more {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-position: center;
  background-size: 24px;
  background-repeat: no-repeat;
  overflow: unset;
  cursor: pointer;
  background-image: url('@/assets/icon/moremenu.svg');
}
.icon-cart {
  height: 20px;
  aspect-ratio: 1 / 1;
  background: url('@/assets/icon/cs-icon-store.svg') no-repeat center;
  background-size: 20px 20px;
  cursor: pointer;
}
.icon-know {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-position: center;
  background-size: 24px;
  background-repeat: no-repeat;
  overflow: unset;
  cursor: pointer;
  background-image: url('@/assets/icon/knowledge.svg');
}
.icon-chat {
  background: url('@/assets/icon/chat.svg');
  background-repeat: no-repeat;
  background-position: center;
}

.icon-notification {
  background: url(https://amisplatform.misacdn.net/apps/recruit/icon-notification-version.d5e3dc604036ed5b.svg);
  background-repeat: no-repeat;
  background-size: cover;
  width: 24px;
  height: 24px;
}
. .icon-user {
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
  width: 32px;
  height: 32px;
  margin-right: 12px !important;
  margin-top: 0 !important;
  border-radius: 16px;
  background-position: center;
  background-size: 24px;
  background-repeat: no-repeat;
  overflow: unset;
  cursor: pointer;
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
.icon-logo {
  background-image: url(@/assets/icon/logo-recruitment-new.d56a0096f9a2229b.svg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 32px;
  height: 32px;
  margin-top: 8px;
}
.navbar-wrap {
  height: 48px;
  width: 80px;
  display: flex;
  justify-items: center;
  bottom: 4px;
  z-index: 2;
  margin-left: 5px;
}
</style>
