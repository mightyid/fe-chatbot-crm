<script setup lang="ts">
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

const overlayPanel = useTemplateRef<any>('overlayPanel')

const togglePanel = (e: Event) => {
  overlayPanel.value.toggle(e)
}

const hidePanel = () => {
  overlayPanel.value.hide()
}
</script>

<template>
  <Button class="p-0" type="button" :loading="loading" @click="togglePanel">
    <ProgressSpinner style="width: 24px; height: 24px" v-if="loading" />

    <slot name="buttonContent" v-if="$slots.buttonContent"></slot>

    <OverlayPanel class="min-w-[150px] [&>.p-overlaypanel-content]:p-0" ref="overlayPanel">
      <div class="py-1">
        <slot name="overlayPanelContent" :hidePanel="hidePanel"></slot>
      </div>
    </OverlayPanel>
  </Button>
</template>
