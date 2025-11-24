<template>
  <div class="sidebar h-100" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-container">
      <div class="menu-items-list">
        <template v-for="item in menu" :key="item.title || item.type">
          <div v-if="item.type === 'separator'" class="menu-separator"></div>

          <!-- Mega Menu (Danh mục khác) - Flyout Type -->
          <div v-else-if="item.type === 'flyout'" class="menu-item-wrapper">
            <el-popover
              placement="right-start"
              :width="700"
              trigger="hover"
              popper-class="mega-menu-popper"
              :show-arrow="false"
              :offset="0"
              :popper-options="{
                modifiers: [
                  {
                    name: 'flip',
                    enabled: false,
                  },
                ],
              }"
            >
              <template #reference>
                <div class="menu-item-container" :class="{ active: isActive(item) }">
                  <div class="w-full block">
                    <div class="menu-item-admin">
                      <div class="menu-item-icon">
                        <i :class="item.icon"></i>
                      </div>
                      <div class="menu-item-title title">{{ item.title }}</div>

                      <div v-if="!isCollapsed" class="flex flex-end pr-1">
                        <i class="icon-flyout"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Mega Menu Content -->
              <div class="mega-menu-container">
                <div class="mega-column">
                  <div class="mega-group-title">Đối tượng</div>
                  <router-link to="/customers" class="mega-link" active-class="active-link">
                    <i class="sub-nav"></i> Khách hàng
                  </router-link>
                  <router-link to="/employees" class="mega-link" active-class="active-link">
                    <i class="sub-nav"></i> Nhân viên
                  </router-link>
                  <router-link to="/cost-objects" class="mega-link" active-class="active-link">
                    <i class="sub-nav"></i> Đối tượng tập hợp chi phí
                  </router-link>
                </div>
                <div class="mega-column">
                  <div class="mega-group-title">Lịch làm việc</div>
                  <router-link to="/work-shift" class="mega-link" active-class="active-link">
                    <i class="sub-nav"></i> Ca làm việc
                  </router-link>
                  <router-link to="/time-off" class="mega-link" active-class="active-link">
                    <i class="sub-nav"></i> Ngày nghỉ
                  </router-link>
                  <router-link to="/work-schedule" class="mega-link" active-class="active-link">
                    <i class="sub-nav"></i> Lịch làm việc
                  </router-link>
                </div>
                <div class="mega-column">
                  <div class="mega-group-title">Khác</div>
                  <router-link to="/organization" class="mega-link" active-class="active-link">
                    <i class="sub-nav"></i> Cơ cấu tổ chức
                  </router-link>
                  <router-link to="/inventory" class="mega-link" active-class="active-link">
                    <i class="sub-nav"></i> Kho
                  </router-link>
                  <router-link to="/units" class="mega-link" active-class="active-link">
                    <i class="sub-nav"></i> Đơn vị tính
                  </router-link>
                  <router-link to="/stop-reasons" class="mega-link" active-class="active-link">
                    <i class="sub-nav"></i> Lý do dừng công việc
                  </router-link>
                </div>
              </div>
            </el-popover>
          </div>

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
      </div>
      <div class="bottom-area">
        <div class="menu-item-admin collape-btn" title="Thu gọn sidebar" @click="toggleSidebar">
          <div class="menu-item-icon">
            <i :class="isCollapsed ? 'icon-collapse-right' : 'icon-collapse-left'"></i>
          </div>
          <div class="menu-item-title title">Thu gọn</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isCollapsed = ref(false)

/**
 * Hàm kiểm tra trạng thái active của menu item (dùng cho Flyout Menu)
 * Logic: Kiểm tra nếu route hiện tại bắt đầu bằng path của item
 * hoặc thuộc danh sách relatedPaths (các path con trong Mega Menu)
 * @param {Object} item - Đối tượng cấu hình menu
 * @returns {Boolean} - True nếu item đó đang được chọn
 * createdby: Bảo Trung
 */
const isActive = (item) => {
  if (item.path && route.path.startsWith(item.path)) return true
  if (item.relatedPaths && item.relatedPaths.some((p) => route.path.startsWith(p))) return true
  return false
}

/**
 * Hàm toggle trạng thái thu gọn/mở rộng sidebar
 * Thay đổi giá trị biến isCollapsed
 * @returns (void)
 * createdby: Bảo Trung
 */
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

/**
 * Cấu hình danh sách menu hiển thị trên Sidebar
 * @property {string} title - Tên hiển thị
 * @property {string} icon - Class CSS của icon (dùng mask-image)
 * @property {string} type - Loại menu: 'link' (thường), 'dropdown' (có mũi tên xuống), 'flyout' (mega menu), 'separator' (kẻ ngang)
 * @property {string} path - Đường dẫn router
 * @property {Array} relatedPaths - Các đường dẫn con để giữ trạng thái active cho mục cha (dùng cho flyout)
 * createdby: Bảo Trung
 */
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
    relatedPaths: ['/work-shift', '/customers', '/employees', '/time-off'], // Đã bổ sung thêm các path con
  },
  {
    title: 'Thiết lập',
    icon: 'icon-setting',
    type: 'link', // <-- Đổi từ 'flyout' sang 'link'
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
  width: 234px; /* Độ rộng khi mở */
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
  row-gap: 3px;
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
  border-radius: 4px;
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
  width: 100%;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  /* Căn nội dung ra giữa */
  justify-content: center;
  cursor: pointer;
  color: #9ca3af;
  background: transparent;
  position: relative;
  font-size: 13px;
  column-gap: 8px;
}
.collape-btn .menu-item-icon i {
  font-size: 13px;
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
  justify-content: center; /* Đưa icon ra giữa khi thu gọn */
  padding: 0;
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
  width: 20px; /* Kích thước chuẩn giống các icon menu trên */
  height: 20px;
  border: none; /* QUAN TRỌNG: Bỏ viền vuông */
  border-radius: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  /* Bỏ margin-left để căn giữa chuẩn */
  margin-left: 0;
  flex-shrink: 0;
  transition: transform 0.2s;
}
/* Xoay icon "Thu gọn" */
.sidebar.collapsed .collape-btn .menu-item-icon i {
  margin-left: 0;
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
  mask-position: -60px -28px;
  mask-repeat: no-repeat;
  background-color: #9ca3af;
}
.icon-flyout {
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/iconn.svg);
  mask-position: -35px -28px;
  mask-repeat: no-repeat;
  background-color: #9ca3af;
}
.icon-collapse-left {
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/icon1.svg);
  mask-position: -140px -16px;
  mask-repeat: no-repeat;
  background-color: #9ca3af;
}
.icon-collapse-right {
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/icon1.svg);
  mask-position: -160px -16px;
  mask-repeat: no-repeat;
  background-color: #9ca3af;
}
.collape-btn .menu-item-title {
  flex: none;
  width: auto;
}

/* Đảm bảo icon không bị dính margin trái (nếu chưa được override) */
.collape-btn .menu-item-icon {
  margin-left: 0;
}
</style>

<style>
/* Global styles for Mega Menu Popper */
.mega-menu-popper {
  background-color: #111827 !important;
  border: 1px solid #374151 !important;
  padding: 0 !important;
  color: #fff !important;
}

.mega-menu-container {
  display: flex;
  padding: 8px;
  gap: 8px;
}

.mega-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mega-group-title {
  font-weight: 600;
  color: #6b7280;

  font-size: 14px;
  padding-left: 36px;
}

.mega-link {
  color: #d1d5db;
  cursor: pointer;
  height: 32px;
  padding: 0 12px 0 36px;
  border-radius: 6px;
  font-size: 14px;
  text-decoration: none;
  display: flex;
  align-items: center;
  position: relative;
}

.mega-link:hover {
  background-color: #374151;
  color: #fff;
}

.mega-link.active-link {
  background-color: #374151;
  color: #fff;
}

.mr-2 {
  margin-right: 8px;
}
.sub-nav {
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  mask-image: url(@/assets/icon/iconn.svg);
  mask-repeat: no-repeat;
  mask-position: -58px -67px;
  background-color: #fff;
  z-index: 2;
  display: none;
}

.mega-link:hover .sub-nav,
.mega-link.active-link .sub-nav {
  display: block;
}
</style>
