<template>
  <div class="form-group">
    <label v-if="label" class="form-label">{{ label }}</label>
    <DatePicker
      v-model="internalValue"
      :type="type"
      :format="format"
      value-type="format"
      :placeholder="placeholder"
      class="date-picker"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'

const props = defineProps({
  modelValue: String,
  label: String,
  placeholder: String,
  format: {
    type: String,
    default: 'DD/MM/YYYY',
  },
  type: {
    type: String,
    default: 'date',
  },
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val
  },
)

watch(internalValue, (val) => {
  emit('update:modelValue', val)
})
</script>

<style scoped>
.date-picker {
  width: 100%;
}
</style>
