<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, null] as PropType<String | null>,
  },
  placeholder: {
    type: String,
  },
  bindingInput: {
    type: Object,
    default: {},
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Object,
    default: {},
  },
})

const rules = computed(() => props.rules)

const { value, handleBlur, errorMessage } = useField(() => props.name, rules, {
  initialValue: props.modelValue as string,
  syncVModel: true,
})
</script>

<template>
  <div class="input-field">
    <Textarea
      :placeholder="placeholder || 'Nhập'"
      autoResize
      rows="5"
      cols="30"
      fluid
      :invalid="errorMessage ? true : false"
      :disabled="disabled"
      v-bind="bindingInput"
      v-model="value"
      @blur="handleBlur($event, true)"
    />
    <Message severity="error" size="small" variant="simple" v-if="errorMessage">
      {{ errorMessage }}
    </Message>
  </div>
</template>
