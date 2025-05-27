<script lang="ts" setup>
import BoxChat from '~/components/BoxChat.vue'

const route = useRoute()
const { $api } = useNuxtApp()
const listMessage = ref<any>([])
const getData = async () => {
  const { result }: any = await $api(`message?lead_id=${route.params.id}`)
  console.log(result, 'res')
  listMessage.value = result
}
getData()
</script>

<template>
  <div class="fc flex-1 h-full">
    <BoxChat :listMessage="listMessage" />
  </div>
</template>
