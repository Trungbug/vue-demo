<template>
  <div class="input-container">
    <input
      type="text"
      class="texteditor-input"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },

  placeholder: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.input-container {
  display: flex;
  align-items: center;
  position: relative;
  width: 250px;
  height: 36px;
  border: 1px solid #dddde4;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.input-container:hover {
  border-color: #2680eb;
}

.texteditor-input {
  flex: 1;
  height: 100%;
  padding: 6px 16px 6px 36px;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 14px;
}
</style>
