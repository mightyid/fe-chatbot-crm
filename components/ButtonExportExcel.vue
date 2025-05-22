<script setup lang="ts">
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()
</script>

<template>
  <Button class="gap-2 bg-primary-20 border-transparent" type="button" :loading="loading" :disabled="disabled">
    <ProgressSpinner style="width: 24px; height: 24px" v-if="loading" />
    <img class="icon" src="~/assets/icons/i-export-primary.svg" alt="" v-else />

    <span class="c-primary text-base font-normal"> {{ t('button.export_excel') }} </span>
  </Button>
</template>
