<script setup lang="ts">
defineProps({
  modelValue: {
    type: String,
    required: true,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const changeValue = (e: Event) => {
  const target = <HTMLInputElement>e.target
  emit('update:modelValue', target?.value)
}
</script>

<template>
  <form
    class="pl-2 py-2px flex items-center bg-white border-1 border-black-20 border-solid rounded transition-all focus-within:border-primary"
    autocomplete="off"
    @submit.prevent
  >
    <img class="icon cursor-pointer" src="~/assets/icons/i-search.svg" alt="" />
    <input
      class="p-1 flex-1 text-base border-none outline-none rounded placeholder:c-black-50 placeholder:font-normal"
      type="text"
      placeholder="Search"
      :value="modelValue"
      @input="changeValue"
    />
  </form>
</template>
