<script setup lang="ts">
defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  width: {
    type: [String, Number],
    default: '50vw',
  },
  showIconClose: {
    type: Boolean,
    default: false,
  },
  dismissableMask: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['onClose'])

const closeDialog = () => {
  emit('onClose')
}
</script>

<template>
  <Dialog
    class="[&>.p-dialog-content]:p-6 [&>.p-dialog-content]:rounded"
    modal
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    :style="{ width }"
    :showHeader="false"
    :dismissableMask="dismissableMask"
    :visible="visible"
    @update:visible="closeDialog"
  >
    <button class="p-0 absolute top-[16px] right-[16px]" type="button" @click="closeDialog" v-if="showIconClose">
      <img src="~/assets/icons/i-close-gray.svg" alt="" />
    </button>
    <h3 class="mt-0 mb-3 text-2xl font-bold c-black-90 text-center" v-if="title">
      {{ title }}
    </h3>
    <slot></slot>
  </Dialog>
</template>
