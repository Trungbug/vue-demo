<template>
  <div class="header d-flex justify-content-space-between align-items-center">
    <div class="header-left d-flex align-items-center">
      <div class="nav-item-logo">
        <div class="icon-switch-app"></div>
        <div class="navbar-wrap">
          <div class="icon-logo"></div>
          <div class="title-name .m-r-24">Sản xuất</div>
        </div>
      </div>
    </div>
    <div class="header-right d-flex align-items-center">
      <div class="nav-item-content">
        <div class="nav-item-content-left">
          <div class="company">
            <div class="company-wrap">
              <span class="name-company-title">CÔNG TY TNHH KURITA - GK VIỆT NAM </span>
              <span></span>
            </div>
          </div>
        </div>
        <div class="nav-item-content-right">
          <div class="icon-cart"></div>
          <div class="nav-separator"></div>
          <div class="icon-package"></div>

          <div class="apui-user-controlpanel-item"></div>

          <div class="icon-mess"></div>
          <div class="misa-helpmenu-trigger"></div>
          <div class="icon-more"></div>
          <div class="icon-know"></div>
          <div class="icon icon-user"></div>
        </div>
      </div>
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
  height: 48px;
  background-color: #fff;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.nav-item-logo {
  display: flex;
  align-items: center;
}

.header-right {
  flex: 1;
  padding: 0 16px 0 20px;
}
.nav-item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}
.nav-item-content-left {
  display: flex;
  align-items: center;
}
.company {
  font-size: 13px;
  font-weight: 700;
  margin-top: 2px;
  display: inline-flex;
  align-items: center;
  position: relative;
}
.company-wrap {
  max-width: 440px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 0.25rem;
  cursor: pointer;
}
.name-company-title {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  font-family: 'Inter';
  max-width: 440px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-item-content-right {
  display: flex;
  height: 100%;
  align-items: center;
}
.title-name {
  font-size: 18px;
  margin-left: 12px;
  font-weight: 700;
  color: #262626;
  white-space: nowrap;
}

/*  */

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
/* .icon-logo {
  background-position: -53px -411px;
  width: 54px;
  height: 54px;
} */
.icon-search {
}
.icon-mess {
  background-image: url('@/assets/icon/mess.svg');
  height: 24px;
  width: 24px;
  min-height: 24px;
  min-width: 24px;
  position: relative;
  margin-left: 12px;
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
.nav-separator {
  width: 1px;
  height: 16px;
  background: #d1d5db;
  align-self: center;
  border-radius: 1px;
}
.icon-more {
  margin-left: 12px;
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
  background: url('@/assets/icon/cs-icon-store.svg') no-repeat center;
  height: 24px;
  width: 24px;
  min-height: 24px;
  min-width: 24px;
  position: relative;
  margin-right: 12px;
}
.icon-know {
  margin-left: 12px;
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

.icon-package {
  background: url('@/assets/icon/ic_package.svg') no-repeat;
  height: 24px;
  width: 24px;
  min-height: 24px;
  min-width: 24px;
  position: relative;
  margin-left: 12px;
}
.icon-user {
  background-position: -123px -139px;
  width: 18px;
  height: 18px;
  margin-left: 16px;
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
  margin-left: 12px !important;
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
  margin-left: 12px;
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
  background-image: url('@/assets/icon/logo_shift.svg');
  width: 30px;
  height: 30px;
  background-repeat: no-repeat;
  background-size: contain;
}
.navbar-wrap {
  margin-left: 16px;
  display: flex;
  align-items: center;
  width: 128px;
  cursor: pointer;
}
</style>
