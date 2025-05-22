<script setup lang="ts">
defineProps({
  numberBadge: {
    type: Number,
    default: 0,
  },
})

const { t } = useI18n()

const overlayPanel = useTemplateRef<any>('overlayPanel')

const togglePanel = (event: Event) => {
  overlayPanel.value?.toggle(event)
}

const hidePanel = () => {
  overlayPanel.value?.hide()
}
</script>

<template>
  <Button
    class="gap-2 bg-primary-10 border-transparent overflow-visible"
    v-badge.info="numberBadge > 0 ? numberBadge.toString() : undefined"
    @click="togglePanel"
  >
    <img src="~/assets/icons/i-filter-secondary.svg" alt="" />
    <span class="text-base font-normal c-primary"> {{ t('button.filter') }} </span>
  </Button>

  <OverlayPanel ref="overlayPanel">
    <div class="w-[300px]">
      <slot :hidePanel="hidePanel"></slot>
    </div>
  </OverlayPanel>
</template>

<style lang="scss" scoped>
:deep(.p-badge-dot) {
  display: none;
}
</style>
