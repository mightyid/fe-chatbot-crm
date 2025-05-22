<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { useField } from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    default: '',
    required: true,
  },
  modelValue: {
    type: [String, Number, Boolean, null] as PropType<string | number | boolean | null | undefined>,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    required: true,
  },
  optionLabel: {
    type: [String, null] as PropType<string | null>,
    default: 'name',
  },
  optionValue: {
    type: [String, null] as PropType<string | null>,
    default: 'value',
  },
  optionDisabled: {
    type: [String, null] as PropType<string | null>,
  },
  isTranslateOptionLabel: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
  },
  inputStyle: {
    type: Object,
    default: {},
  },
  filterDefault: {
    type: Boolean,
    default: false,
  },
  showClearDefault: {
    type: Boolean,
    default: false,
  },
  showClear: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  onSearch: {
    type: Function,
  },
  showHorizontal: {
    type: Boolean,
    detault: false,
  },
  showDropdownIconSmall: {
    type: Boolean,
    default: false,
  },
  virtualScrollerOptions: {
    type: Object,
    default: undefined,
  },
  tooltip: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'search', 'show'])

const { t, te } = useI18n()
const search = ref('')
const dropdownElement = ref()

const optionsCustom = computed(() => {
  // Translate option label
  if (props.isTranslateOptionLabel) {
    const clone = cloneDeep(props.options)

    const newOptions = clone?.map((item: any) => {
      if (props.optionLabel) {
        item[props.optionLabel] = te(item[props.optionLabel]) ? t(item[props.optionLabel]) : item[props.optionLabel]
      }

      return item
    })

    return newOptions
  }

  return props.options
})

const rules = computed(() => props.rules)

const { value, errorMessage, handleBlur } = useField(() => props.name, rules, {
  initialValue: props.modelValue as String,
  syncVModel: true,
})

const getLabelByValue = (value: string | number) => {
  const item = props.options?.find((item: any) => item[props.optionValue as keyof typeof item] === value)

  const label = item && props.optionLabel ? item[props.optionLabel as keyof typeof item] : value

  return props.isTranslateOptionLabel && label && te(label as string) ? t(label) : label
}

const clearValue = () => {
  dropdownElement.value?.hide()
  emit('update:modelValue', null)
}

watch(
  () => search.value,
  (newValue) => {
    emit('search', newValue)
  },
)
</script>

<template>
  <div class="flex gap-2" :class="showHorizontal ? 'flex-row items-center' : 'flex-col'">
    <label class="flex items-center gap-2 text-base font-normal c-black-90" :for="props.name" v-if="label">
      <span>
        {{ label }}
        <span class="c-danger" v-if="rules.required">*</span>
      </span>
      <img src="~/assets/icons/i-tooltip.svg" alt="" v-tooltip.top="tooltip" v-if="tooltip" />
    </label>

    <div class="flex flex-col" :class="showHorizontal ? 'flex-1' : ''">
      <Dropdown
        :inputId="props.name"
        :class="[errorMessage ? 'p-invalid' : '']"
        :inputStyle="inputStyle"
        :placeholder="placeholder ? placeholder : t('common.select')"
        :options="optionsCustom"
        :optionLabel="(optionLabel as any)"
        :optionValue="(optionValue as any)"
        :optionDisabled="(optionDisabled as any)"
        :filter="filterDefault"
        :showClear="showClearDefault && value ? true : false"
        :virtualScrollerOptions="virtualScrollerOptions ? virtualScrollerOptions : undefined"
        :disabled="disabled"
        :loading="loading"
        v-model="value"
        @blur="handleBlur($event, true)"
        @show="$emit('show')"
        ref="dropdownElement"
      >
        <template #dropdownicon>
          <img src="~/assets/icons/i-dropdown.svg" alt="" v-if="showDropdownIconSmall" />

          <slot name="dropdownicon" v-else></slot>
        </template>

        <template #header>
          <!-- Show clear -->
          <div
            class="mb-[8px] mx-[12px] pt-[12px] pb-[16px] border-b border-gray-20 border-b-solid"
            v-if="showClear && modelValue"
          >
            <button
              class="px-[8px] flex items-center gap-[4px] !bg-black-10 rounded-2xl"
              type="button"
              @click="clearValue"
            >
              <img src="~/assets/icons/i-close-gray.svg" alt="" />
              <span class="text-base font-normal c-black-90"> {{ t('common.deselect') }} </span>
            </button>
          </div>

          <!-- Search -->
          <BaseSearch class="mt-1 mb-2 border-0 border-b-1 rounded-none" v-model="search" v-if="onSearch" />
        </template>

        <template #value="slotProps" v-if="optionDisabled || isTranslateOptionLabel">
          <!-- Trick show value preselected disabled -->
          <span class="c-[#313131]" v-if="optionDisabled && slotProps.value">
            {{ getLabelByValue(slotProps?.value) ?? '&nbsp;' }}
          </span>

          <!-- Show translate value -->
          <template v-else>
            <div class="flex align-items-center" v-if="slotProps.value || typeof slotProps.value === 'boolean'">
              <div> {{ getLabelByValue(slotProps?.value) ?? '&nbsp;' }} </div>
            </div>

            <span v-else>
              {{ placeholder ? placeholder : t('common.select') }}
            </span>
          </template>
        </template>
      </Dropdown>

      <small class="p-error" v-show="errorMessage">{{ errorMessage || '&nbsp;' }}</small>
    </div>
  </div>
</template>
