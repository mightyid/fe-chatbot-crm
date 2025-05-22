<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    default: '',
    required: true,
  },
  modelValue: {
    type: [Number, null] as PropType<Number | null>,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
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
  inputClass: {
    type: [String, Object, Array],
    default: '',
  },
  // Grouping separator, ex: 100,000
  useGrouping: {
    type: Boolean,
    default: false,
  },
  // Decimal, ex 1 = 1,0 | 2 = 1,00
  minFractionDigits: {
    type: Number,
    default: 0,
  },
  maxFractionDigits: {
    type: Number,
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  layout: {
    type: String,
    default: 'col',
  },
  mode: {
    type: String as PropType<'decimal' | 'currency'>,
    default: 'decimal',
  },
  prefix: {
    type: String,
    default: '',
  },
  suffix: {
    type: String,
    default: '',
  },
  currency: {
    type: String,
  },
  locale: {
    type: String,
  },
  min: {
    type: Number,
  },
  max: {
    type: Number,
  },
  showButtons: {
    type: Boolean,
    default: false,
  },
  tooltip: {
    type: String,
    default: '',
  },
  isShowButtons: {
    type: Boolean,
    default: false,
  },
  buttonLayout: {
    type: String,
    default: '',
  },
  isFocusedOnMouted: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'input'])

const { t } = useI18n()

const input = ref()

const attrsIncreaseDecreaseBtn = computed(() => {
  if (props.isShowButtons) {
    if (props.buttonLayout === 'horizontal') {
      return {
        showButtons: true,
        buttonLayout: 'horizontal',
        incrementButtonClass: 'p-0 w-[40px] border border-solid border-black-40 border-l-none',
        decrementButtonClass: 'p-0 w-[40px] border border-solid border-black-40 border-r-none',
      }
    } else {
      return {
        showButtons: true,
      }
    }
  }
  return {}
})

const rules = computed(() => props.rules)

const { value, errorMessage, handleBlur } = useField(() => props.name, rules, {
  initialValue: props.modelValue as number,
  syncVModel: true,
})

const handleUpdateModelValue = (value: any) => {
  emit('update:modelValue', value)
}

onMounted(() => {
  if (props.isFocusedOnMouted) {
    input.value?.$el?.children[0]?.focus()
  }
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <label
      class="flex items-center gap-2 text-base font-normal c-black-90"
      :class="layout === 'row' ? ['flex-1'] : ['']"
      :for="props.name"
      v-if="label"
    >
      <span>
        {{ label }}
        <span class="c-danger" v-if="rules.required">*</span>
      </span>
      <img src="~/assets/icons/i-tooltip.svg" alt="" v-tooltip.top="tooltip" v-if="tooltip" />
    </label>

    <div class="flex flex-col">
      <InputNumber
        :inputId="props.name"
        :class="[classInput, errorMessage ? 'p-invalid' : '']"
        :inputClass="inputClass"
        :style="inputStyle"
        :placeholder="placeholder ? placeholder : t('common.enter')"
        :mode="mode"
        :currency="currency"
        :locale="locale"
        :useGrouping="useGrouping"
        :allowEmpty="true"
        :prefix="prefix"
        :suffix="suffix"
        :minFractionDigits="minFractionDigits || undefined"
        :maxFractionDigits="maxFractionDigits || undefined"
        :min="min"
        :max="max"
        :disabled="disabled"
        v-bind="(attrsIncreaseDecreaseBtn as any)"
        v-model="value"
        @blur="handleBlur(undefined, true)"
        @input="
          (e) => {
            $emit('input', e.value)
          }
        "
        @update:modelValue="handleUpdateModelValue"
        ref="input"
      >
        <template #incrementbuttonicon v-if="isShowButtons && buttonLayout === 'horizontal'">
          <img src="~/assets/icons/i-plus-gray.svg" alt="" />
        </template>

        <template #decrementbuttonicon v-if="isShowButtons && buttonLayout === 'horizontal'">
          <img src="~/assets/icons/i-minus-gray.svg" alt="" />
        </template>
      </InputNumber>
      <small class="p-error" v-show="errorMessage">{{ errorMessage || '&nbsp;' }}</small>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.p-inputnumber-input) {
  width: 100%;
}
</style>
