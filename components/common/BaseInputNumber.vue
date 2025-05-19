<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [Number, null] as PropType<number | null>,
  },
  placeholder: {
    type: String,
  },
  // Grouping separator, ex: 100,000
  useGrouping: {
    type: Boolean,
    default: false,
  },
  minFractionDigits: {
    type: Number,
  },
  maxFractionDigits: {
    type: Number,
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

const emit = defineEmits(['update:modelValue'])

const rules = computed(() => props.rules)

const { value, handleBlur, errorMessage } = useField(() => props.name, rules, {
  initialValue: props.modelValue as number,
  syncVModel: true,
})
</script>

<template>
  <div class="input-field">
    <InputNumber
      :placeholder="placeholder || 'Nhập'"
      :useGrouping="useGrouping"
      :minFractionDigits="minFractionDigits || undefined"
      :maxFractionDigits="maxFractionDigits || undefined"
      fluid
      :invalid="errorMessage ? true : false"
      :disabled="disabled"
      v-bind="bindingInput"
      v-model="value"
      @blur="(event: any) => handleBlur(event, true)"
      @update:modelValue="($event: number) => $emit('update:modelValue', $event)"
    />
    <Message severity="error" size="small" variant="simple" v-if="errorMessage">
      {{ errorMessage }}
    </Message>
  </div>
</template>
