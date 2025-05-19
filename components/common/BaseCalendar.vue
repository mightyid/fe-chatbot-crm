<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [Date, String, Array, null, undefined] as PropType<Date | Date[] | string | string[] | null | undefined>,
  },
  placeholder: {
    type: String,
  },
  selectionMode: {
    type: String as PropType<'single' | 'multiple' | 'range'>,
    default: 'single',
  },
  view: {
    type: String as PropType<'date' | 'month' | 'year'>,
    default: 'date',
  },
  dateFormat: {
    type: String,
    default: 'dd/mm/yy',
  },
  bindingInput: {
    type: Object,
    default: {},
  },
  showTime: {
    type: Boolean,
    default: false,
  },
  minDate: {
    type: Date,
  },
  maxDate: {
    type: Date,
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
  initialValue: props.modelValue as any,
  syncVModel: true,
})
</script>

<template>
  <div class="input-field">
    <DatePicker
      :placeholder="placeholder || 'Chọn'"
      :view="view"
      :dateFormat="dateFormat"
      fluid
      :invalid="errorMessage ? true : false"
      showIcon
      iconDisplay="input"
      showButtonBar
      :showTime="showTime"
      :minDate="minDate"
      :maxDate="maxDate"
      :disabled="disabled"
      v-bind="bindingInput"
      v-model="value"
      @blur="handleBlur(undefined, true)"
    >
      <template #inputicon="{ clickCallback }">
        <img
          class="absolute top-[25%] right-0 translate-y-[-25%] cursor-pointer"
          src="/icons/i-calendar-primary.svg"
          @click="clickCallback"
        />
      </template>
    </DatePicker>
    <Message severity="error" size="small" variant="simple" v-if="errorMessage">
      {{ errorMessage }}
    </Message>
  </div>
</template>
