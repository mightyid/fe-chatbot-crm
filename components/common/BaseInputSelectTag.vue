<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, null] as PropType<String | null | undefined>,
    required: true,
  },
  placeholder: {
    type: String,
    default: 'Select',
  },
  options: {
    type: Array as any,
    required: true,
  },
  optionLabel: {
    type: String,
    default: 'name',
  },
  optionValue: {
    type: String,
    default: 'value',
  },
  label: {
    type: String,
  },
  filter: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  showClear: {
    type: Boolean,
    required: false,
  },
  showIconLabel: {
    type: Boolean,
    default: true,
  },
  isLayoutHorizontal: {
    type: Boolean,
    default: false,
  },
  // This prop was passed by @scroll in  component parent
  onScroll: {
    type: Function,
  },
  onSearch: {
    type: Function,
  },
})

const emit = defineEmits(['update:modelValue', 'search', 'scroll'])

const search = ref('')

const rules = computed(() => props.rules)

const { value, errorMessage, handleBlur } = useField(() => props.name, rules, {
  initialValue: props.modelValue as String,
  syncVModel: true,
})

const currentOption = computed(() => (props.options.find((item: any) => item?.value === value.value) as any) || {})

const handleScroll = useThrottleFn((e) => {
  emit('scroll')
}, 400)

watch(
  () => search.value,
  (newValue) => {
    emit('search', newValue)
  },
)
</script>

<template>
  <div class="flex gap-2" :class="[isLayoutHorizontal ? ['items-center'] : ['flex-col']]">
    <label class="text-base font-normal c-black-90" :for="props.name" v-if="label">
      {{ label }} <span class="c-danger" v-if="rules.required">*</span>
    </label>
    <Dropdown
      :inputId="props.name"
      :class="[errorMessage ? 'p-invalid' : '', isLayoutHorizontal ? ['flex-1'] : ['']]"
      :placeholder="placeholder"
      :showClear="showClear"
      :options="options"
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      :filter="filter"
      v-model="value"
      @blur="handleBlur($event, true)"
      :disabled="disabled"
      :virtualScrollerOptions="onScroll ? ({ itemSize: 48, onScroll: handleScroll } as any) : undefined">
      <!-- Search -->
      <template #header v-if="onSearch">
        <InputSearch class="mt-1 mb-2 border-0 border-b-1 rounded-none" v-model="search" />
      </template>

      <template #value="slotProps" v-if="showIconLabel">
        <div class="flex align-items-center" v-if="slotProps.value">
          <div class="fr ai-c gap-1">
            <!-- {{ JSON.stringify(slotProps) }} -->
            <TagIcon :color=" options.find((item: any) => item?._id === slotProps.value)?.color" />
            {{ options.find((item: any) => item?._id === slotProps.value)?.name }}
          </div>
        </div>
        <span v-else>
          {{ slotProps.placeholder }}
        </span>
      </template>

      <template #option="slotProps" v-if="showIconLabel">
        <div class="flex align-items-center">
          <div class="mr-2" v-if="slotProps.option.color">
            <TagIcon :color="slotProps.option.color" />
          </div>
          <div>{{ slotProps.option.name }}</div>
        </div>
      </template>
    </Dropdown>
    <small class="p-error" v-show="errorMessage">{{ errorMessage || '&nbsp;' }}</small>
  </div>
</template>
