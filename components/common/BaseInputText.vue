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
    default: {},
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
  isFocusedOnMouted: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'onChange'])

const { t } = useI18n()

const input = ref()

const rules = computed(() => props.rules)

const { value, errorMessage, handleBlur } = useField(() => props.name, rules, {
  initialValue: props.modelValue as string,
  syncVModel: true,
})

const handleChange = (e: any) => {
  const value = e?.target?.value || ''

  emit('onChange', value)
}

onMounted(() => {
  if (props.isFocusedOnMouted) {
    input.value?.$el?.focus()
  }
})
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

    <div class="flex flex-col">
      <InputText
        class="flex-1"
        :id="props.name"
        :class="[classInput, errorMessage ? 'p-invalid' : '']"
        :style="inputStyle"
        type="text"
        :placeholder="placeholder ? placeholder : t('common.enter')"
        :disabled="disabled"
        :readonly="readonly"
        v-model="value"
        @blur="handleBlur($event, true)"
        @input="handleChange"
        ref="input"
      />
      <small class="p-error" v-show="errorMessage">{{ errorMessage || '&nbsp;' }}</small>
    </div>
  </div>
</template>
