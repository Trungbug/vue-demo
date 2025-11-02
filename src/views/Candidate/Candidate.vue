<template>
  <div class="content">
    <div class="title-header">
      <div class="title-left">Ứng viên</div>
      <div class="title-right">
        <button class="btn">
          <div class="icon icon-add"></div>
          <span class="title-name pl-2">Thêm ứng viên</span>
        </button>
      </div>
    </div>

    <!-- Nội dung chính -->
    <div class="candidates-wrapper">
      <div class="toolbar">
        <div class="toolbar-container">
          <div class="toolbar-grid-default">
            <div class="grid-left"></div>
            <div class="grid-right">
              <div class="search-grid">
                <div class="search-container">
                  <div class="icon icon-search"></div>
                  <input
                    type="text"
                    class="texteditor-input"
                    placeholder="Tìm kiếm nhanh trong danh sách"
                  />
                </div>

                <div class="wrap-icon-button-toolbar">
                  <div class="icon icon-filter"></div>
                </div>
                <div class="wrap-icon-button-toolbar">
                  <div class="icon icon-export"></div>
                </div>
                <div class="wrap-icon-button-toolbar">
                  <div class="icon icon-interactive-history"></div>
                </div>
                <div class="wrap-icon-button-toolbar">
                  <div class="icon icon-setting-column"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="table-area">Bảng ứng viên</div>
      <div class="paging">Phân trang</div>
    </div>
  </div>
</template>

<script setup>
// Chưa cần logic — chỉ layout
</script>

<style scoped>
/* Tổng thể content */
.content {
  width: 100%;
  height: 100%;

  box-sizing: border-box;
  background-color: #f3f4f6;
  overflow: auto; /* cho phép cuộn nếu dài */
}
.title-name {
  font-weight: 500;
  font-size: 14px !important;
}
/* Khối danh sách ứng viên */
.list-candidate {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

/* Header */
.title-header {
  height: 50px;
  display: flex;
  justify-content: space-between;
  padding: 16px 24px 0 24px;
}
.title-left {
  font-size: 20px;
  font-weight: 700;
  padding-top: 8px;
  padding-bottom: 4px;
}
.title-right {
}

/* Khu vực nội dung chính */
.candidates-wrapper {
  width: 100%;
  height: calc(100% - 50px);
  padding: 24px;
  display: flex;
  flex-direction: column;
}

/* Các phần con trong wrapper */
.toolbar {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.toolbar-container {
  color: #212121;
  padding: 16px 16px !important;
  min-height: 64px;
  white-space: nowrap;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.toolbar-grid-default {
  width: 100%;
}
.grid-right {
  display: flex;
  align-items: center;
}
.search-grid {
  width: 200px;
  border: 1px solid #dddde4 !important;
}
.search-container {
  display: flex;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  flex-grow: 1;
  align-items: baseline;
}
.texteditor-input {
  padding-left: 34px !important;
  font-weight: 400;
  font-family: Inter, Helvetica, Arial, sans-serif;
  text-overflow: ellipsis;
  border-radius: 3px;
  min-height: 32px;
  padding: 6px 16px;
  font-size: 14px !important;
  border: 1px solid #dddde4 !important;
}
.texteditor-input:hover {
  border-color: #2680eb;
}

.wrap-icon-button-toolbar {
  background-color: #ffffff;
  height: 35px;
  padding: 8px;
  border: 1px solid #e0e6ec;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
}

/* bảng */
.table-area {
  flex: 1;
  background-color: #fed7aa; /* cam nhạt */
  border-radius: 4px;
  text-align: center;
  padding: 20px;
  overflow: auto;
}
.paging {
  background-color: #fcd34d; /* vàng nhạt */
  border-radius: 4px;
  padding: 8px;
  text-align: center;
}
.btn {
  width: auto;
  font-weight: 500;
  font-size: 14px !important;
  height: 36px !important;
  padding: 8px 12px !important;
  border-radius: 4px !important;

  background-color: #2680eb !important;
  color: #ffffff !important;
  border: 1px solid #e0e6ec;
  border-color: transparent !important;
  display: flex;
  align-items: center;
  gap: 8px;
}
.icon-search {
  font: 17px / 18px DXIcons;
  position: absolute;
  top: 50%;
  margin-top: -17px;
  width: 34px;
  height: 34px;
  background-position: 8px 8px;
  background-size: 18px 18px;
  padding: 8px;
  text-align: center;
  color: #999;
}
</style>
