<script setup lang="ts">
import FormField, { type FormFieldProps } from './FormField.vue'

interface TextareaProps extends FormFieldProps {
  modelValue?: string
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  rows?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  width?: 'full' | 'auto' | 'sm' | 'md' | 'lg' | 'xl'
}

withDefaults(defineProps<TextareaProps>(), {
  rows: 4,
  resize: 'vertical'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const resizeClasses = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize'
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
      <textarea
        :id="id"
        :class="[className, resizeClasses[resize]]"
        :value="modelValue"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        :rows="rows"
        @input="handleInput"
      />
    </template>
  </FormField>
</template>
