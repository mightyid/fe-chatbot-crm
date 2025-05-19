<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  showRequired: {
    type: Boolean,
    default: false,
  },
  forId: {
    type: [String, Number] as PropType<any>,
  },
})
</script>

<template>
  <label class="block mb-1 text-base font-normal c-black-90" :for="forId">
    <span>
      {{ text }}
      <span class="c-danger" v-if="showRequired">*</span>
    </span>
  </label>
</template>
