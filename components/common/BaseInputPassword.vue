<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    default: '',
    required: true,
  },
  modelValue: {
    type: [String, null] as PropType<String | null>,
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
  rules: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  tooltip: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()

const rules = computed(() => props.rules)

const { value, errorMessage, handleBlur } = useField(() => props.name, rules, {
  initialValue: props.modelValue as string,
  syncVModel: true,
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between gap-[16px]">
      <label class="flex items-center gap-4 text-base font-normal c-black-90" :for="props.name" v-if="label">
        <span>
          {{ label }}
          <span class="c-danger" v-if="rules.required">*</span>
        </span>
        <img src="~/assets/icons/i-tooltip.svg" alt="" v-tooltip.top="tooltip" v-if="tooltip" />
      </label>

      <slot name="labelRight"></slot>
    </div>

    <div class="flex flex-col">
      <Password
        :inputId="props.name"
        class="[&>.p-inputtext]:w-full"
        :class="[classInput, errorMessage ? 'p-invalid' : '']"
        :style="inputStyle"
        :placeholder="placeholder ? placeholder : t('common.enter')"
        toggleMask
        :feedback="false"
        :disabled="disabled"
        v-model="value"
        @blur="handleBlur($event, true)"
      />
      <small class="p-error" v-show="errorMessage">{{ errorMessage || '&nbsp;' }}</small>
    </div>
  </div>
</template>
