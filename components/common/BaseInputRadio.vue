<script setup lang="ts">
import { useField } from 'vee-validate'

type OptionItem = {
  name: string | number
  value: string | number | boolean
}

const props = defineProps({
  name: {
    type: String,
    default: '',
    required: true,
  },
  modelValue: {
    type: [String, Number, Boolean, null] as PropType<string | number | boolean | null>,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  isTranslateOptionLabel: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array as PropType<OptionItem[]>,
    required: true,
  },
  showVertical: {
    type: Boolean,
    detault: false,
  },
  label: {
    type: String,
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

const rules = computed(() => props.rules)

const { value, errorMessage, handleBlur } = useField(() => props.name, rules, {
  initialValue: props.modelValue as string | number,
  syncVModel: true,
})
</script>

<template>
  <div class="input-field flex gap-4" :class="[showVertical ? 'flex-col' : 'flex-row flex-wrap items-center']">
    <div
      class="flex items-start"
      v-for="item in options"
      :key="
        item.value && typeof item.value === 'boolean' ? `${props.name}-${item?.name}` : `${props.name}-${item?.value}`
      "
    >
      <RadioButton
        :inputId="
          item.value && typeof item.value === 'boolean' ? `${props.name}-${item?.name}` : `${props.name}-${item?.value}`
        "
        :name="props.name"
        :value="item.value"
        :disabled="disabled"
        v-model="value"
      />
      <label
        class="ml-2 text-base font-normal c-black-90 cursor-pointer"
        :for="
          item.value && typeof item.value === 'boolean' ? `${props.name}-${item?.name}` : `${props.name}-${item?.value}`
        "
      >
        {{ item.name }}
      </label>
    </div>
    <small class="p-error" v-show="errorMessage">{{ errorMessage || '&nbsp;' }}</small>
  </div>
</template>
