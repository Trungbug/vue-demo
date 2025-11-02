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
    <div class="list-candidate">
      <!-- Tiêu đề -->

      <!-- Nội dung chính -->
      <div class="candidates-wrapper">
        <div class="toolbar">Thanh tìm kiếm + filter</div>
        <div class="table-area">Bảng ứng viên</div>
        <div class="paging">Phân trang</div>
      </div>
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
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Các phần con trong wrapper */
.toolbar {
  background-color: #bbf7d0; /* xanh lá nhạt */
  padding: 8px;
  border-radius: 4px;
  text-align: center;
}
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
}
</style>
