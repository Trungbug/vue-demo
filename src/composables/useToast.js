import { reactive, toRefs } from 'vue'

const state = reactive({
  isShow: false,
  message: '',
  type: 'success',
})

let timeout = null

export default function useToast() {
  /**
   * Hiển thị toast message
   * @param {string} msg Nội dung message
   * @param {string} msgType Loại message (success, error, warning, info)
   * createdby: Bảo Trung
   */
  const showToast = (msg, msgType = 'success') => {
    state.isShow = true
    state.message = msg
    state.type = msgType

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      state.isShow = false
    }, 3000)
  }

  /**
   * Ẩn toast message
   * createdby: Bảo Trung
   */
  const hideToast = () => {
    state.isShow = false
  }

  return { ...toRefs(state), showToast, hideToast }
}
