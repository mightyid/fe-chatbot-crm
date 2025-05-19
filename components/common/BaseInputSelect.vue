<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { useField } from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, Number, Boolean, null] as PropType<string | number | boolean | null>,
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
  optionDisabled: {
    type: [String, null] as PropType<string | undefined>,
  },
  filter: {
    type: Boolean,
    default: false,
  },
  showClear: {
    type: Boolean,
    default: false,
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

const isOptionsHaveIcon = computed(() => props.options?.some((item: any) => item?.icon))

const selectedOption = computed<any>(() => {
  return props.options?.find((option: any) => option[props.optionValue] === props.modelValue) || {}
})

const rules = computed(() => props.rules)

const { value, handleBlur, errorMessage } = useField(() => props.name, rules, {
  initialValue: props.modelValue as string,
  syncVModel: true,
})

const onUpdateModelValue = (value: any) => {
  emit('update:modelValue', value)
}

const onSearch = (e: any) => {
  emit('onSearch', e?.value)
}
</script>

<template>
  <div class="input-field">
    <Select
      :placeholder="placeholder || 'Chọn'"
      :options="options"
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      :optionDisabled="optionDisabled"
      :filter="filter"
      :showClear="showClear"
      fluid
      :invalid="errorMessage ? true : false"
      :loading="loading"
      :disabled="disabled"
      v-bind="bindingInput"
      v-model="value"
      @blur="handleBlur($event, true)"
      @update:modelValue="onUpdateModelValue"
      @filter="onSearch"
    >
      <!-- Trick show value preselected disabled -->
      <template #value="slotProps" v-if="optionDisabled">
        <div class="flex items-center gap-3">
          <!-- Show Icon -->
          <img class="icon" :src="selectedOption?.icon" alt="" v-if="isOptionsHaveIcon" />

          <span class="c-black-90 line-clamp-1" v-if="slotProps.value">
            {{ optionLabel ? selectedOption[optionLabel] : slotProps.value }}
          </span>

          <span class="c-black-50 line-clamp-1" v-else>
            {{ placeholder ? placeholder : 'Chọn' }}
          </span>
        </div>
      </template>

      <template #option="slotProps" v-if="isOptionsHaveIcon">
        <div class="flex items-center gap-3">
          <img class="icon" :src="slotProps.option?.icon" alt="" />
          <span class="parapraph">
            {{ slotProps.option?.name }}
          </span>
        </div>
      </template>
    </Select>

    <Message severity="error" size="small" variant="simple" v-if="errorMessage">
      {{ errorMessage }}
    </Message>
  </div>
</template>
