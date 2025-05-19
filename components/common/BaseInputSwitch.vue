<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Boolean,
  },
  placeholder: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const { value, handleBlur, errorMessage } = useField(() => props.name, undefined, {
  initialValue: props.modelValue,
  syncVModel: true,
})

const onUpdateModelValue = (value: any) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="input-field">
    <ToggleSwitch
      input
      fluid
      :invalid="errorMessage ? true : false"
      :disabled="disabled"
      v-model="value"
      @blur="handleBlur($event, true)"
      @update:modelValue="onUpdateModelValue"
    />
    <Message severity="error" size="small" variant="simple" v-if="errorMessage">
      {{ errorMessage }}
    </Message>
  </div>
</template>
