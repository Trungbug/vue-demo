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
              <div class="search-container">
                <div class="icon icon-search"></div>
                <input
                  type="text"
                  class="texteditor-input"
                  placeholder="Tìm kiếm nhanh trong danh sách"
                />
              </div>
              <div class="wrap-icon-button-toolbar" title="Lọc">
                <div class="icon icon-filter"></div>
              </div>
              <div class="wrap-icon-button-toolbar" title="Xuất khẩu">
                <div class="icon icon-export"></div>
              </div>
              <div class="wrap-icon-button-toolbar" title="Lịch sử tương tác">
                <div class="icon icon-interactive-history"></div>
              </div>
              <div class="wrap-icon-button-toolbar" title="Tùy chỉnh cột">
                <div class="icon icon-setting-column"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="table-area">
        <div class="data-grid">
          <div class="datagrid-header">
            <div class="datagrid-content">
              <table class="datagrid-table">
                <tbody>
                  <tr>
                    <td>jahhahouha</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="datagird-view">nội dung</div>
        </div>
      </div>
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
/* Các phần con trong wrapper */
.toolbar {
  background-color: #fff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.toolbar-container {
  padding: 12px 16px;
  min-height: 64px;
}

.toolbar-grid-default {
  display: flex;
  justify-content: space-between; /* Quan trọng: Đẩy 2 khối left/right ra xa nhau */
  align-items: center;
  width: 100%;
}

/* Kiểu cho khối bên trái (ô tìm kiếm) */
.grid-right .search-container {
  display: flex;
  align-items: center;
  position: relative;
  width: 250px; /* Độ rộng ô tìm kiếm */
  height: 36px;
  border: 1px solid #dddde4;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.grid-right .search-container:hover {
  border-color: #2680eb;
}

.grid-right .icon-search {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #666; /* Màu cho icon */
}

.grid-right .texteditor-input {
  flex: 1;
  height: 100%;
  padding: 6px 16px 6px 36px; /* Chừa khoảng trống cho icon */
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 14px;
}

/* Kiểu cho khối bên phải (các icon) */
.grid-right {
  display: flex;
  align-items: center;
  gap: 8px; /* Khoảng cách giữa các icon */
}

.wrap-icon-button-toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #e0e6ec;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.wrap-icon-button-toolbar:hover {
  background-color: #f0f0f0;
}
.wrap-icon-button-toolbar .icon {
  background-color: #666;
}

/* Các style cũ cho table và paging */
.table-area {
  flex: 1;
  background-color: #fff; /* Đổi màu nền bảng thành trắng */
  border-radius: 4px;
  text-align: center;
  overflow: auto;
  border-left: 1px solid #e0e6ec;
  border-right: 1px solid #e0e6ec;
}
.data-grid {
  width: 100%;
  height: 100%;
  color: #000000;
}
.datagrid-header {
  background-color: #f1f2f6 !important;
  color: #959595;
  font-weight: 400;
  touch-action: pinch-zoom;
}
.datagrid-content {
  margin-bottom: -1px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}
.datagrid-table {
  max-width: none;
  position: relative;
  border-collapse: collapse;
  border-spacing: 0;
  margin: 0;
}
.paging {
  background-color: #fff; /* Đổi màu nền phân trang thành trắng */
  border-radius: 4px;
  padding: 16px;
  text-align: center;
  border: 1px solid #e0e6ec;
  border-top: none;
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
</style>
