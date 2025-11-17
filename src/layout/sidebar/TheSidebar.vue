<template>
  <div class="sidebar h-100" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-container">
      <div class="menu-items-list">
        <template v-for="item in menu" :key="item.title || item.type">
          <div v-if="item.type === 'separator'" class="menu-separator"></div>

          <div v-else class="menu-item-container" :class="{ active: item.active }">
            <div class="w-full block">
              <div class="menu-item-admin">
                <div class="menu-item-icon">
                  <i :class="item.icon"></i>
                </div>
                <div class="menu-item-title title">{{ item.title }}</div>

                <div v-if="!isCollapsed" class="flex flex-end pr-1">
                  <i
                    v-if="item.type === 'dropdown'"
                    class="fa-solid fa-chevron-down icon-arrow"
                  ></i>
                  <i v-if="item.type === 'flyout'" class="fa-solid fa-chevron-right icon-arrow"></i>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="bottom-area">
          <div class="menu-item-admin collape-btn" title="Thu gọn sidebar" @click="toggleSidebar">
            <div class="menu-item-icon">
              <i class="fa-solid fa-angles-left"></i>
            </div>
            <div class="menu-item-title title">Thu gọn</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const menu = [
  { title: 'Tổng quan', icon: 'fa-solid fa-house', type: 'link' },
  { title: 'Đơn đặt hàng', icon: 'fa-solid fa-file-invoice', type: 'link' },
  { title: 'Kế hoạch sản xuất', icon: 'fa-solid fa-calendar-days', type: 'dropdown' },
  { title: 'Điều phối và thực thi', icon: 'fa-solid fa-truck-fast', type: 'dropdown' },
  { title: 'Kiểm tra chất lượng', icon: 'fa-solid fa-check-double', type: 'link' },
  { title: 'Kho vật tư', icon: 'fa-solid fa-warehouse', type: 'dropdown' },

  { type: 'separator' }, // <-- Đường kẻ 1

  { title: 'Báo cáo', icon: 'fa-solid fa-flag', type: 'link' },

  { type: 'separator' }, // <-- Đường kẻ 2

  { title: 'Sản phẩm, NVL', icon: 'fa-solid fa-box', type: 'dropdown' },
  { title: 'Quy trình sản xuất', icon: 'fa-solid fa-diagram-project', type: 'dropdown' },
  { title: 'Năng lực sản xuất', icon: 'fa-solid fa-bolt', type: 'dropdown' },
  {
    title: 'Danh mục khác',
    icon: 'icon icon-list', // icon-list từ file icon.css của bạn
    type: 'flyout', // <-- Loại "sang phải"
    active: true, // <-- Đang được chọn
  },
  { title: 'Thiết lập', icon: 'fa-solid fa-gear', type: 'flyout' }, // <-- Loại "sang phải"
]
</script>

<style scoped>
/* Common styles */
.h-100 {
  height: 100%;
}

/* -- Cấu trúc Sidebar chính -- */
.sidebar {
  width: 238px; /* Độ rộng khi mở */
  background: #111827; /* Màu nền dark theo ảnh */
  color: #fff;
  transition: width 0.2s;
  display: flex;
  flex-direction: column;
}

.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Ngăn container chính bị cuộn */
}

/* 1. Danh sách menu (phần có thể cuộn) */
.menu-items-list {
  display: flex;
  flex-direction: column;
  padding: 12px 12px 0;
  row-gap: 4px;
  overflow-y: overlay;
  flex: 1;
  min-height: 0;
  cursor: pointer;
}

/* -- Cấu trúc một Menu Item -- */
.menu-item-admin {
  position: relative;
  padding: 9px 0;
  height: 36px;
  font-size: 13px;
  display: flex;
  align-items: center;
  -moz-column-gap: 8px;
  column-gap: 8px;
  width: 100%;
}

/* Icon wrapper */
.menu-item-icon {
  display: flex;
  align-items: center;
  width: 20px;
  height: 20px;
  justify-content: center;
  margin-left: 8px;
}

.menu-item-icon i {
  font-size: 18px; /* Kích thước icon */
  color: #9ca3af; /* Màu icon xám */
}

/* Tiêu đề item */
.menu-item-title {
  font-size: 13px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  z-index: 1;
  color: #9ca3af;
}

.sidebar .title {
  margin-left: 8px;
}

/* -- Trạng thái Active và Hover -- */

/* Container của item active */
.menu-item-container.active .menu-item-admin {
  background-color: #04a984; /* <-- ĐỔI SANG MÀU XANH LÁ CÂY (như ảnh) */
}

.menu-item-container.active .menu-item-icon i,
.menu-item-container.active .menu-item-title {
  color: #fff; /* Chữ/icon trắng khi active */
}

/* Hover (không phải active) */
.menu-item-container:not(.active) .menu-item-admin:hover {
  background-color: #374151; /* Màu xám đậm khi hover */
}
.menu-item-container:not(.active) .menu-item-admin:hover .menu-item-icon i {
  color: #fff;
}
.menu-item-container:not(.active) .menu-item-admin:hover .menu-item-title {
  color: #fff;
}

/* 2. Nút "Thu gọn" (cố định) */
.bottom-area {
  /* Đây là VÙNG BAO QUANH nút (giống .btn-collapse-footer) */
  width: 100%;
  height: 56px;
  padding: 10px 12px; /* Padding 10px trên/dưới, 12px trái/phải */
  display: flex;
  align-items: center;
  /* Border-top giống hệt trong ảnh */
  border-top: 1px solid rgba(209, 213, 219, 0.3);
  background: #111827; /* Nền của sidebar */
  box-sizing: border-box; /* Đảm bảo padding không làm vỡ layout */
}
.collape-btn {
  /* Đây là NÚT BẤM (giống .btn-collapse) */
  width: 100%;
  height: 36px; /* Giống trong ảnh */
  border-radius: 4px; /* Giống trong ảnh */
  display: flex;
  align-items: center;
  padding-left: 8px; /* Giữ padding trái cho icon */
  padding-right: 8px;
  cursor: pointer;
  color: #9ca3af; /* Màu chữ xám */
  /* Nền mặc định (giống .bottom-area) */
  background: transparent;
  /* Kế thừa từ .menu-item-admin */
  position: relative;
  font-size: 13px;
  -moz-column-gap: 8px;
  column-gap: 8px;
}
.collape-btn .menu-item-icon i {
  font-size: 14px;
  color: #9ca3af; /* Màu icon xám */
  transition: transform 0.2s; /* Hiệu ứng xoay icon */
}
.collape-btn:hover {
  background-color: #374151;
}

/* -- Trạng thái Thu gọn (Collapsed) -- */
.sidebar.collapsed {
  width: 72px;
}
.sidebar.collapsed .collape-btn {
  justify-content: center; /* Căn giữa icon khi thu gọn */
  padding-left: 0; /* Bỏ padding 2 bên */
  padding-right: 0;
}

/* Ẩn tiêu đề đi */
.sidebar.collapsed .menu-item-title {
  display: none;
}

/* Căn giữa icon khi thu gọn */
.sidebar.collapsed .menu-item-admin {
  padding: 10px 12px;
  justify-content: center;
}

.collape-btn .menu-item-icon {
  width: 26px;
  height: 26px;
  border: 1px solid rgba(156, 163, 175, 0.5); /* viền mờ */
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0;
  /* Đảm bảo icon không bị co lại */
  flex-shrink: 0;
}
/* Xoay icon "Thu gọn" */
.sidebar.collapsed .collape-btn .menu-item-icon i {
  transform: rotate(180deg);
}

/* --- MÔ PHỎNG CÁC CLASS TAILWIND --- */
.w-full {
  width: 100%;
}
.block {
  display: block;
}
.flex {
  display: flex;
}
.flex-end {
  justify-content: flex-end;
}
.pr-1 {
  padding-right: 8px; /* Giống pr-[8px] */
}

/* --- CÁC CLASS MỚI --- */

/* Đường kẻ ngăn cách */
.menu-separator {
  height: 1px;
  background-color: #374151; /* Màu xám đậm */
  margin: 8px 12px;
}
.sidebar.collapsed .menu-separator {
  margin: 8px 4px; /* Thu hẹp lề khi thu gọn */
}

/* Style cho icon mũi tên (chung) */
.icon-arrow {
  font-size: 12px;
  color: #9ca3af;
  transition: transform 0.2s;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* Không bị co lại */
}
.
/* Màu mũi tên khi active */
.menu-item-container.active .icon-arrow {
  color: #fff;
}

/* Ẩn mũi tên khi sidebar thu gọn */
.sidebar.collapsed .icon-arrow {
  display: none;
}
</style>
