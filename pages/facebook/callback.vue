<script lang="ts" setup>

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const connectFacebook = async () => {
  await $api(`noti-config/facebook/code`, {
    method: 'POST',
    body: {
      code: route.query?.code,
    },
  })

  router.push('/setting/facebook')
}
connectFacebook()
</script>

<template>
  <div class="page">
    <div class="page-content">
      Đang xử lý kết nối Facebook...
    </div>
  </div>
</template>
