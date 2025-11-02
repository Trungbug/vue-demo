<template>
  <div class="content">
    <div class="list-candidate">
      <!-- Tiêu đề -->
      <div class="title-header">
        <div class="title-left">Ứng viên</div>
        <div class="title-right">+ Thêm ứng viên</div>
      </div>

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
  padding: 16px;
  box-sizing: border-box;
  background-color: #f3f4f6;
  overflow: auto; /* cho phép cuộn nếu dài */
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #c7d2fe; /* xanh nhạt */
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 12px;
}
.title-left {
  font-weight: bold;
}
.title-right {
  background-color: #2563eb;
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
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
</style>
