<template>
  <div class="sidebar h-100" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-container">
      <div class="menu-items-list">
        <template v-for="item in menu" :key="item.title || item.type">
          <div v-if="item.type === 'separator'" class="menu-separator"></div>

          <router-link v-else :to="item.path" custom v-slot="{ navigate, isActive }">
            <div class="menu-item-container" :class="{ active: isActive }" @click="navigate">
              <div class="w-full block">
                <div class="menu-item-admin">
                  <div class="menu-item-icon">
                    <i :class="item.icon"></i>
                  </div>
                  <div class="menu-item-title title">{{ item.title }}</div>

                  <div v-if="!isCollapsed" class="flex flex-end pr-1">
                    <i v-if="item.type === 'dropdown'" class="icon-dropdown"></i>
                    <i v-if="item.type === 'flyout'" class="icon-flyout"></i>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
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

/**
 * Toggle trạng thái thu gọn sidebar
 * createdby: Bảo Trung
 */
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const menu = [
  {
    title: 'Tổng quan',
    icon: 'icon-dashboard',
    type: 'link',
    path: '/dashboard',
  },
  {
    title: 'Đơn đặt hàng',
    icon: 'ms-icon-cart',
    type: 'link',
    path: '/orders',
  },
  {
    title: 'Kế hoạch sản xuất',
    icon: 'ms-icon-product',
    type: 'dropdown',
    path: '/production-plan',
  },
  {
    title: 'Điều phối và thực thi',
    icon: 'ms-icon-codinination',
    type: 'dropdown',
    path: '/coordination',
  },
  {
    title: 'Kiểm tra chất lượng',
    icon: 'ms-icon-quality',
    type: 'link',
    path: '/quality-check',
  },
  {
    title: 'Kho vật tư',
    icon: 'icon-warehouse',
    type: 'dropdown',
    path: '/warehouse',
  },

  { type: 'separator' }, // <-- Đường kẻ 1

  { title: 'Báo cáo', icon: 'icon-rp', type: 'link', path: '/reports' },

  { type: 'separator' }, // <-- Đường kẻ 2

  {
    title: 'Sản phẩm, NVL',
    icon: 'icon-production-process',
    type: 'dropdown',
    path: '/products',
  },
  {
    title: 'Quy trình sản xuất',
    icon: 'icon-process',
    type: 'dropdown',
    path: '/production-process',
  },
  {
    title: 'Năng lực sản xuất',
    icon: 'icon-production-capacity',
    type: 'dropdown',
    path: '/production-capacity',
  },
  {
    title: 'Danh mục khác',
    icon: 'icon-others', // icon-list từ file icon.css của bạn
    type: 'flyout', // <-- Loại "sang phải"
    path: '/others',
  },
  {
    title: 'Thiết lập',
    icon: 'icon-setting',
    type: 'flyout', // <-- Loại "sang phải"
    path: '/settings',
  },
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
.menu-item-container.active .menu-item-icon i {
  background-color: #fff;
}

/* Hover (không phải active) */
.menu-item-container:not(.active) .menu-item-admin:hover {
  background-color: #374151; /* Màu xám đậm khi hover */
}
.menu-item-container:not(.active) .menu-item-admin:hover .menu-item-icon i {
  background-color: #fff;
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
.icon-dropdown,
.icon-flyout {
  transition: transform 0.2s;
}

/* Màu mũi tên khi active */
.menu-item-container.active .icon-dropdown,
.menu-item-container.active .icon-flyout {
  background-color: #fff;
}

/* Màu mũi tên khi hover */
.menu-item-container:not(.active) .menu-item-admin:hover .icon-dropdown,
.menu-item-container:not(.active) .menu-item-admin:hover .icon-flyout {
  background-color: #fff;
}

/* Ẩn mũi tên khi sidebar thu gọn */
.sidebar.collapsed .icon-dropdown,
.sidebar.collapsed .icon-flyout {
  display: none;
}
.icon-dashboard {
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/iconn.svg);
  mask-position: -6px -7px;
  mask-repeat: no-repeat;
  background-color: #9ca3af;
}
.ms-icon-cart {
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/iconn.svg);
  mask-position: -344px -86px;
  mask-repeat: no-repeat;
  background-color: #9ca3af;
}
.ms-icon-product {
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/iconn.svg);
  mask-position: -32px -7px;
  mask-repeat: no-repeat;
  background-color: #9ca3af;
}
.icon-warehouse {
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/iconn.svg);
  mask-position: -84px -6px;
  mask-repeat: no-repeat;
  background-color: #9ca3af;
}
.ms-icon-codinination {
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/iconn.svg);
  mask-position: -57px -7px;
  mask-repeat: no-repeat;
  background-color: #9ca3af;
}
.icon-rp {
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/iconn.svg);
  mask-position: -214px -7px;
  mask-repeat: no-repeat;
  background-color: #9ca3af;
}
.ms-icon-quality {
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/iconn.svg);
  mask-position: -110px -6px;
  mask-repeat: no-repeat;
  background-color: #9ca3af;
}

.icon-production-process {
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/iconn.svg);
  mask-position: -40px -193px;
  mask-repeat: no-repeat;
  background-color: #9ca3af;
}
.icon-process {
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/iconn.svg);
  mask-position: -162px -6px;
  mask-repeat: no-repeat;
  background-color: #9ca3af;
}
.icon-production-capacity {
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/iconn.svg);
  mask-position: -189px -6px;
  mask-repeat: no-repeat;
  background-color: #9ca3af;
}
.icon-others {
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/iconn.svg);
  mask-position: -240px -6px;
  mask-repeat: no-repeat;
  background-color: #9ca3af;
}
.icon-setting {
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/iconn.svg);
  mask-position: -266px -6px;
  mask-repeat: no-repeat;
  background-color: #9ca3af;
}
.icon-dropdown {
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/iconn.svg);
  mask-position: -63px -33px;
  mask-repeat: no-repeat;
  background-color: #9ca3af;
}
.icon-flyout {
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/iconn.svg);
  mask-position: -39px -31px;
  mask-repeat: no-repeat;
  background-color: #9ca3af;
}
</style>
