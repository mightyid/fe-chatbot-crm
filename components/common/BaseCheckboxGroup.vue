<script setup lang="ts">
import { useField } from 'vee-validate'

type OptionItem = {
  name: string
  value: any
  subName?: string
  disabled?: boolean
}

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
    type: Array,
    required: true,
  },
  options: {
    type: Array as PropType<OptionItem[]>,
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
  isTranslateOptionLabel: {
    type: Boolean,
    default: false,
  },
  styleSubName: {
    type: String,
    default: '',
  },
  showGroupHorizontal: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
  layoutClass: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()

const { value, errorMessage } = useField(() => props.name, props.rules, {
  type: 'checkbox',
  // checkedValue: props.modelValue as Boolean,
  initialValue: props.modelValue as any[],
  syncVModel: true,
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-base font-normal c-black-90" v-if="label">
      {{ label }}
      <span class="c-danger" v-if="rules.required">*</span>
    </label>

    <div class="flex gap-3" :class="[showGroupHorizontal ? ['flex-row, flex-wrap'] : ['flex-col'], layoutClass]">
      <div class="flex items-center gap-4" v-for="item in options" :key="item?.value">
        <Checkbox
          :inputId="`${item?.name}`"
          :class="[classInput, errorMessage ? 'p-invalid' : '']"
          :style="inputStyle"
          :name="props.name"
          :value="item?.value"
          :disabled="disabled || item?.disabled ? true : false"
          v-model="value"
        />
        <label class="flex items-center gap-2 text-base font-normal c-black-90 cursor-pointer" :for="`${item?.name}`">
          {{ isTranslateOptionLabel ? t(item?.name) : item?.name }}
          <span class="pl-2 text-sm c-black-60" :class="styleSubName" v-if="item?.subName">
            {{ isTranslateOptionLabel ? t(item?.subName) : item?.subName }}
          </span>
        </label>
      </div>
    </div>

    <small class="p-error" v-show="errorMessage">{{ errorMessage || '&nbsp;' }}</small>
  </div>
</template>
