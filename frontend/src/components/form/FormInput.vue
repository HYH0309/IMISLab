<script setup lang="ts">
import FormField, { type FormFieldProps } from './FormField.vue'

interface InputProps extends FormFieldProps {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  min?: number
  max?: number
  step?: number
  width?: 'full' | 'auto' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
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
      <input
        :id="id"
        :class="className"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        :min="min"
        :max="max"
        :step="step"
        @input="handleInput"
      />
    </template>
  </FormField>
</template>
