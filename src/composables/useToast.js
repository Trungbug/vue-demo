import { reactive, toRefs } from 'vue'

const state = reactive({
  isShow: false,
  message: '',
  type: 'success',
})

let timeout = null

export default function useToast() {
  const showToast = (msg, msgType = 'success') => {
    state.isShow = true
    state.message = msg
    state.type = msgType

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      state.isShow = false
    }, 3000)
  }

  const hideToast = () => {
    state.isShow = false
  }

  return { ...toRefs(state), showToast, hideToast }
}
