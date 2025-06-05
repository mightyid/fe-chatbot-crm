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
    class="gap-2 group bg-[#3AB2F8] !hover:bg-primary border-transparent overflow-visible"
    v-badge.info="numberBadge > 0 ? numberBadge.toString() : undefined"
    @click="toggle"
  >
    <img src="~/assets/icons/i-filter-white.svg" class="w-[19px] h-[19px]" alt="" />
    <span class="!c-white"> {{ t('button.filter') }} </span>
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
