<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useAppStore } from '~/stores/app'
import TheSidebarLeft from '~/components/TheSidebarLeft/TheSidebarLeft.vue'
import TheHeader from '~/components/TheHeader/TheHeader.vue'

const { user }: any = useAuth()
const { t, te } = useI18n()
// const appStore = useAppStore()
const toast = useToast()

document.documentElement.classList.toggle('light')

// watch(
//   () => appStore.error,
//   (error) => {
//     if (error) {
//       toast.add({
//         severity: 'error',
//         summary: t('common.error') + ' ' + error?.code,
//         detail: error?.key && te(`error.${error?.key}`) ? t(`error.${error?.key}`) : error?.message,
//         life: 3000,
//       })
//       appStore.error = null
//     }
//   },
//   { deep: true },
// )
</script>

<template>
  <div class="layout-default w-100vw h-100vh">
    <slot></slot>
  </div>
  <ConfirmDialog />
  <Toast />
</template>
