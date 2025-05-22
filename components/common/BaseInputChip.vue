<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    default: '',
    required: true,
  },
  modelValue: {
    type: Array as PropType<any[]>,
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
  separator: {
    type: String,
  },
})

const emit = defineEmits(['update:modelValue', 'onChange'])

const { t } = useI18n()

const rules = computed(() => props.rules)

const { value, errorMessage, handleBlur } = useField(() => props.name, rules, {
  initialValue: props.modelValue as any[],
  syncVModel: true,
})

const handleChange = (e: any) => {
  const array = e?.value || []
  emit('onChange', array)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-base font-normal c-black-90" :for="props.name" v-if="label">
      {{ label }}
      <span class="c-danger" v-if="rules.required">*</span>
    </label>

    <div class="flex flex-col">
      <Chips
        class="flex-1"
        :id="props.name"
        :class="[classInput, errorMessage ? 'p-invalid' : '']"
        :style="inputStyle"
        :placeholder="placeholder ? placeholder : t('common.enter')"
        :disabled="disabled"
        :separator="separator"
        v-model="value"
        @blur="handleBlur($event, true)"
        @add="handleChange"
      />

      <small class="p-error" v-show="errorMessage">{{ errorMessage || '&nbsp;' }}</small>
    </div>
  </div>
</template>
