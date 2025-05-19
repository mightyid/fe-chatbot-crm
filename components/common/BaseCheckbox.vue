<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    default: '',
    required: true,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },

  label: {
    type: String,
  },
  inputStyle: {
    type: Object,
    default: () => ({}),
  },
  classInput: {
    type: [String, Object, Array],
    default: '',
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const { value, errorMessage } = useField(() => props.name, props.rules, {
  type: 'checkbox',
  // checkedValue: props.modelValue as Boolean,
  initialValue: props.modelValue as Boolean,
  syncVModel: true,
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex gap-4">
      <Checkbox
        :inputId="props.name"
        :class="[classInput, errorMessage ? 'p-invalid' : '']"
        :style="inputStyle"
        :binary="true"
        v-model="value"
        :disabled="props.disabled"
      />
      <label
        class="flex items-center gap-2 text-base font-normal c-black-90 cursor-pointer"
        :for="props.name"
        v-if="label"
      >
        {{ label }}
      </label>
    </div>
    <small class="p-error" v-show="errorMessage">{{ errorMessage || '&nbsp;' }}</small>
  </div>
</template>
