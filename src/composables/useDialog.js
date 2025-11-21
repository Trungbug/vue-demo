import { ref } from 'vue'

export default function useDialog() {
  const isDialogVisible = ref(false)
  const selectedItem = ref(null)

  /**
   * Hiển thị dialog
   * @param {any} item Item được chọn (nếu có)
   * createdby: Bảo Trung
   */
  const showDialog = (item = null) => {
    selectedItem.value = item
    isDialogVisible.value = true
  }

  /**
   * Ẩn dialog
   * createdby: Bảo Trung
   */
  const hideDialog = () => {
    isDialogVisible.value = false
    selectedItem.value = null
  }

  return { isDialogVisible, selectedItem, showDialog, hideDialog }
}
