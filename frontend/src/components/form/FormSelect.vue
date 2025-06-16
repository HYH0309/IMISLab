<script setup lang="ts">
import FormField, { type FormFieldProps } from './FormField.vue'

interface Option {
  value: string | number
  label: string
  disabled?: boolean
}

interface SelectProps extends FormFieldProps {
  modelValue?: string | number
  options?: Option[]
  placeholder?: string
  disabled?: boolean
  width?: 'full' | 'auto' | 'sm' | 'md' | 'lg' | 'xl'
}

defineProps<SelectProps>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <FormField
    :label="label"
    :name="name"
    :required="required"
    :error="error"
    :help="help"
    :size="size"
    :variant="variant"
    :width="width"
  >
    <template #default="{ id, class: className }">
      <select
        :id="id"
        :class="className"
        :value="modelValue"
        :disabled="disabled"
        @change="handleChange"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
    </template>
  </FormField>
</template>
