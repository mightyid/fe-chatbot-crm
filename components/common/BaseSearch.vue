<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: [String, null] as PropType<String | null>,
    required: true,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  debounce: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const timer = ref<any>(undefined)

const changeValue = (e: Event) => {
  const target = e?.target as HTMLInputElement

  if (props.debounce) {
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      emit('update:modelValue', target?.value)
    }, 300)
  } else {
    emit('update:modelValue', target?.value)
  }
}
</script>

<template>
  <form
    class="py-[8px] px-[16px] flex items-center gap-[8px] bg-white border-1 border-black-20 border-solid rounded transition-all focus-within:border-primary"
    autocomplete="off"
    @submit.prevent=""
  >
    <img class="icon" src="/icons/i-search.svg" alt="" />
    <input
      class="flex-1 p-0 text-base font-normal c-gray-50 border-none outline-none bg-transparent"
      type="text"
      :placeholder="placeholder || 'Tìm kiếm'"
      :value="modelValue"
      @input="changeValue"
    />
  </form>
</template>
