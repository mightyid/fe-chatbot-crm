<script setup lang="ts">
defineProps({
  numberBadge: {
    type: Number,
    default: 0,
  },
})

const { t } = useI18n()

const op = ref()

const toggle = (event: Event) => {
  op.value.toggle(event)
}

const hidePanel = () => {
  op.value.hide()
}
</script>

<template>
  <Button
    class="gap-2 bg-primary-20 border-transparent overflow-visible"
    v-badge.info="numberBadge > 0 ? numberBadge.toString() : undefined"
    @click="toggle"
  >
    <img src="~/assets/icons/i-filter-secondary.svg" alt="" />
    <span class="c-primary"> {{ t('button.filter') }} </span>
  </Button>

  <OverlayPanel ref="op">
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
