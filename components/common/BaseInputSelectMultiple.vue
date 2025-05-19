<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { useField } from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [Array, null] as PropType<any[] | null>,
  },
  options: {
    type: Array,
    default: [],
  },
  placeholder: {
    type: String,
  },
  optionLabel: {
    type: String,
    default: 'name',
  },
  optionValue: {
    type: String,
    default: 'value',
  },
  filter: {
    type: Boolean,
    default: false,
  },
  showClear: {
    type: Boolean,
    default: false,
  },
  display: {
    type: String as PropType<'comma' | 'chip'>,
    default: 'comma',
  },
  bindingInput: {
    type: Object,
    default: {},
  },
  loading: {
    type: Boolean,
    default: false,
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

const emit = defineEmits(['update:modelValue', 'onSearch'])

const rules = computed(() => props.rules)

const { value, handleBlur, errorMessage } = useField(() => props.name, rules, {
  initialValue: props.modelValue as any[],
  syncVModel: true,
})

const updateModelValue = (value: any) => {
  emit('update:modelValue', value)
}

const onSearch = (e: any) => {
  emit('onSearch', e?.value)
}
</script>

<template>
  <div class="input-field">
    <MultiSelect
      :placeholder="placeholder || 'Nhập'"
      :options="options"
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      :display="display"
      :filter="filter"
      :showClear="showClear"
      fluid
      :invalid="errorMessage ? true : false"
      :loading="loading"
      :disabled="disabled"
      v-bind="bindingInput"
      v-model="value"
      @blur="handleBlur($event, true)"
      @update:modelValue="updateModelValue"
      @filter="onSearch"
    />
    <Message severity="error" size="small" variant="simple" v-if="errorMessage">
      {{ errorMessage }}
    </Message>
  </div>
</template>
