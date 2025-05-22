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
    type: [Array, null] as PropType<any[] | null>,
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
  isTranslateOptionLabel: {
    type: Boolean,
    default: false,
  },
  optionValue: {
    type: [String, null] as PropType<string | null>,
    default: 'value',
  },
  optionDisabled: {
    type: [String, null] as PropType<string | null>,
  },
  label: {
    type: String,
  },
  filterDefault: {
    type: Boolean,
    default: false,
  },
  showClear: {
    type: Boolean,
    default: false,
  },
  display: {
    type: String as PropType<'comma' | 'chip' | undefined>,
    default: 'comma',
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  // This prop was passed by @search in  component parent
  onSearch: {
    type: Function,
  },
  tooltip: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'search'])

const { t, te } = useI18n()

const search = ref('')
const wrapper = ref()
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
  initialValue: props.modelValue as [],
  syncVModel: true,
})

const clearValue = () => {
  dropdownElement.value?.hide()
  emit('update:modelValue', [])
}

const getLabelByValue = (value: string | number) => {
  const item = props.options?.find((item: any) => item[props.optionValue as keyof typeof item] === value)

  const label = item && props.optionLabel ? item[props.optionLabel as keyof typeof item] : value

  return props.isTranslateOptionLabel && label && te(label as string) ? t(label) : label
}

onMounted(() => {
  // Set width input
  const nodes = wrapper.value.childNodes
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (node?.className?.includes('p-multiselect')) {
      const width = node.clientWidth
      node.style.width = width + 'px'
    }
  }
})

watch(
  () => search.value,
  (newValue) => {
    emit('search', newValue)
  },
)
</script>

<template>
  <div class="flex flex-col gap-2" ref="wrapper">
    <label class="flex items-center gap-2 text-base font-normal c-black-90" :for="props.name" v-if="label">
      <span>
        {{ label }}
        <span class="c-danger" v-if="rules.required">*</span>
      </span>
      <img src="~/assets/icons/i-tooltip.svg" alt="" v-tooltip.top="tooltip" v-if="tooltip" />
    </label>

    <div class="flex flex-col">
      <MultiSelect
        class="w-full"
        :inputId="props.name"
        :class="[errorMessage ? 'p-invalid' : '']"
        :placeholder="placeholder ? placeholder : t('common.select')"
        :options="optionsCustom"
        :optionLabel="(optionLabel as any)"
        :optionValue="(optionValue as any)"
        :optionDisabled="(optionDisabled as any)"
        :display="display"
        :filter="filterDefault"
        :disabled="disabled"
        v-model="value"
        @blur="handleBlur($event, true)"
        ref="dropdownElement"
      >
        <!-- Search -->
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

        <template #value="slotProps" v-if="display === 'comma'">
          <div class="flex align-items-center gap-1" v-if="slotProps.value?.length > 0">
            <template v-for="(item, index) in slotProps?.value" :key="item">
              <div> {{ getLabelByValue(item) ?? '&nbsp;' }}{{ index + 1 < slotProps.value?.length ? ',' : '' }}</div>
            </template>
          </div>

          <span v-else>
            {{ placeholder ? placeholder : t('common.select') }}
          </span>
        </template>

        <!-- Icon remove in display chip -->
        <template #removetokenicon>
          <img src="~/assets/icons/i-close-gray-40.svg" alt="" />
        </template>
      </MultiSelect>
      <small class="p-error" v-show="errorMessage">{{ errorMessage || '&nbsp;' }}</small>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.p-multiselect.p-multiselect-chip) {
  .p-multiselect-token {
    gap: 8px;
    color: #313131;
    background-color: #f4f4f4;
  }
}
</style>
