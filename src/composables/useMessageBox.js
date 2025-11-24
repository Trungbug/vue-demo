import { createApp, h } from 'vue'
import MessageBox from '@/components/messagebox/MessageBox.vue'

let messageBoxInstance = null
let messageBoxApp = null

/**
 * Composable để sử dụng MessageBox
 */
export default function useMessageBox() {
  /**
   * Khởi tạo MessageBox instance nếu chưa có
   */
  const ensureInstance = () => {
    if (!messageBoxInstance) {
      // Tạo container
      const container = document.createElement('div')
      document.body.appendChild(container)

      // Tạo Vue app với MessageBox component
      messageBoxApp = createApp({
        render() {
          return h(MessageBox, {
            ref: 'messageBox',
          })
        },
      })

      // Mount app
      const vm = messageBoxApp.mount(container)
      messageBoxInstance = vm.$refs.messageBox
    }
    return messageBoxInstance
  }

  /**
   * Hiển thị MessageBox confirm
   * @param {string} message - Nội dung thông báo
   * @param {string} title - Tiêu đề
   * @param {object} options - Các tùy chọn khác
   * @returns {Promise}
   */
  const confirm = (message, title, options = {}) => {
    const instance = ensureInstance()
    return instance.show({
      message,
      title,
      type: options.type || 'warning',
      confirmButtonText: options.confirmButtonText || 'Đồng ý',
      cancelButtonText: options.cancelButtonText || 'Hủy',
      ...options,
    })
  }

  /**
   * Đóng MessageBox
   */
  const close = () => {
    if (messageBoxInstance) {
      messageBoxInstance.close()
    }
  }

  return {
    confirm,
    close,
  }
}
