import { ref } from 'vue'

export default function useDialog() {
  const isDialogVisible = ref(false)
  const selectedItem = ref(null)

  const showDialog = (item = null) => {
    selectedItem.value = item
    isDialogVisible.value = true
  }

  const hideDialog = () => {
    isDialogVisible.value = false
    selectedItem.value = null
  }

  return { isDialogVisible, selectedItem, showDialog, hideDialog }
}
