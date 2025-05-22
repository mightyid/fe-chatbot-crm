<script setup lang="ts">
import { useField } from 'vee-validate'
import { isArray } from 'lodash'

const props = defineProps({
  name: {
    type: String,
    default: '',
    required: true,
  },
  modelValue: {
    type: [Date, String, Array, null, undefined] as PropType<Date | Date[] | string | string[] | null | undefined>,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  label: {
    type: String,
  },
  type: {
    type: String as PropType<'date' | 'month' | 'year'>,
    default: 'date',
  },
  dateFormat: {
    type: String,
    default: 'dd/mm/yy',
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
  selectionMode: {
    type: String as PropType<'single' | 'multiple' | 'range'>,
    default: 'single',
  },
  selectOtherMonths: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  timeOnly: {
    type: Boolean,
  },
  manualInput: {
    type: Boolean,
    default: false,
  },
  minDate: {
    type: Date,
  },
  maxDate: {
    type: Date,
  },
  inputStyle: {
    type: Object,
    default: {},
  },
  tooltip: {
    type: String,
    default: '',
  },
  showButtonBar: {
    type: Boolean,
    default: true,
  },
  showSeconds: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'dateSelect', 'updateModelValue'])

const { t } = useI18n()
const { $moment } = useNuxtApp()

const rules = computed(() => props.rules)

const formatDate = () => {
  if (props.modelValue) {
    if (isArray(props.modelValue)) {
      const array = [] as any[]

      for (let item of props.modelValue as any[]) {
        const element = $moment(item).isValid() ? new Date(item) : ''
        if (element) {
          array.push(element)
        }
      }

      return array
    } else {
      return props.modelValue && $moment(props.modelValue).isValid() ? new Date(props.modelValue) : null
    }
  }
}

const { value, errorMessage, handleBlur } = useField(() => props.name, rules, {
  initialValue: props.modelValue,
  syncVModel: true,
})

const dateSelect = (value: any) => {
  emit('dateSelect', value)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="flex items-center gap-2 text-base font-normal c-black-90" :for="props.name" v-if="label">
      <span>
        {{ label }}
        <span class="c-danger" v-if="rules.required">*</span>
      </span>
      <img src="~/assets/icons/i-tooltip.svg" alt="" v-tooltip.top="tooltip" v-if="tooltip" />
    </label>

    <div class="flex-1 flex flex-col">
      <Calendar
        :inputId="props.name"
        :class="[errorMessage ? 'p-invalid' : '']"
        :inputStyle="inputStyle"
        :placeholder="placeholder ? placeholder : t('common.select')"
        :view="type"
        showIcon
        :showButtonBar="showButtonBar"
        iconDisplay="input"
        :dateFormat="dateFormat"
        :selectionMode="selectionMode"
        :selectOtherMonths="selectOtherMonths"
        :timeOnly="timeOnly"
        :showTime="true"
        :manualInput="manualInput"
        :disabled="disabled"
        :minDate="minDate"
        :maxDate="maxDate"
        :showSeconds="showSeconds"
        v-model="value"
        @blur="handleBlur(undefined, true)"
        @date-select="dateSelect"
      >
        <template #inputicon="{ clickCallback }">
          <img
            class="absolute top-[50%] right-12 translate-y-[-50%] cursor-pointer"
            src="~/assets/icons/i-clock.svg"
            @click="clickCallback"
            v-if="timeOnly"
          />
          <img
            class="absolute top-[50%] right-12 translate-y-[-50%] cursor-pointer"
            src="~/assets/icons/i-calendar-primary.svg"
            @click="clickCallback"
            v-else
          />
        </template>
      </Calendar>
      <small class="p-error" v-show="errorMessage">{{ errorMessage || '&nbsp;' }}</small>
    </div>
  </div>
</template>
