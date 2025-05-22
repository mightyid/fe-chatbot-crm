<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  modelValue: {
    type: Boolean,
    default: false,
    required: true,
  },
  label: {
    type: String,
  },
  inputStyle: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    required: false,
  },
})
const emit = defineEmits(['update:modelValue'])

const changeValue = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-base font-normal c-black-90" :for="props.name" v-if="label">
      {{ label }}
    </label>
    <InputSwitch
      :id="props.name"
      :style="inputStyle"
      :modelValue="modelValue"
      @update:modelValue="changeValue"
      :disabled="disabled"
    />
  </div>
</template>
