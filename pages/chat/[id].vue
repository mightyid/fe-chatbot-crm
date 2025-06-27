<script lang="ts" setup>
import BoxChat from '~/components/BoxChat.vue'
import GroupInfo from '~/components/GroupInfo.vue'

const route = useRoute()
const { $api } = useNuxtApp()
const listMessage = ref<any>([])
const isLoading = ref(false)
const isScrollToBottom = ref<any>(new Date().getTime())
const isLoadMore = ref(true)
const lastMessageId = ref()
const socket = useSocket()
const isTyping = ref(false)
const info = ref<any>({})
const { t } = useI18n()
const getDataInfo = async () => {
  const { result }: any = await $api(`/lead/${route.params.id}`, {
    method: 'GET',
    params: {
      message: 1,
    },
  })
  info.value = result
}
getDataInfo()
const getMessages = async () => {
  if (isLoadMore.value) {
    const { result }: any = await $api(`message`, {
      method: 'GET',
      params: {
        last_message_id: lastMessageId.value,
        lead_id: route.params.id,
      },
    })
    listMessage.value = [...listMessage.value, ...result]
    if (result.length < 20) {
      isLoadMore.value = false
    }
    if (!lastMessageId.value) {
      isScrollToBottom.value = new Date().getTime()
    }
    lastMessageId.value = result[result.length - 1]?._id
  }
}
const message = ref('')
const sendMessage = async () => {
  isLoading.value = true

  const { result }: any = await $api(`message/send`, {
    method: 'POST',

    body: {
      lead_id: route.params.id,
      message: message.value,
      hash: new Date().getTime(),
    },
  })
  message.value = ''
  isLoading.value = false
  stopTyping()
  const id = listMessage.value.findIndex((item: any) => item?.hash === result?.hash)
  if (id == -1) {
    const newMessage = {
      ...result,
      message: result?.message.message || '',
    }
    listMessage.value = [newMessage, ...listMessage.value]
    isScrollToBottom.value = new Date().getTime()
  }

  // getMessage()
}
const debounceSend = useDebounceFn(() => {
  sendMessage()
}, 200)
const licenseSocket = () => {
  socket.emit('JOIN_LEAD', { lead_id: route.params.id })
  socket.on('JOIN_LEAD', (res: any) => {
    console.log(res, 'JOIN_LEAD')
  })
  socket.on('SEND_MESSAGE', (res: any) => {
    if (res?.lead._id === info.value._id) {
      const id = listMessage.value.findIndex((item: any) => item?.hash === res?.hash)
      if (id == -1) {
        const newMessage = {
          ...res,
          message: res?.message.message || '',
        }
        listMessage.value = [newMessage, ...listMessage.value]
        isScrollToBottom.value = new Date().getTime()
      }
    }
  })
  socket.on('TYPING', (res: any) => {
    if (res?.lead_id === route.params.id) {
      isScrollToBottom.value = new Date().getTime()
      isTyping.value = true
    }
  })
  socket.on('STOP_TYPING', (res: any) => {
    isScrollToBottom.value = new Date().getTime()

    if (res?.lead_id === route.params.id) {
      isTyping.value = false
    }
  })
}
const startTyping = () => {
  socket.emit('TYPING', { lead_id: route.params.id })
}
const stopTyping = () => {
  socket.emit('STOP_TYPING', { lead_id: route.params.id })
}
watch(
  () => message.value,
  () => {
    if (message.value && message.value.length > 0) {
      startTyping()
    } else stopTyping()
  },
)
licenseSocket()
getMessages()
</script>

<template>
  <div class="grid grid-cols-5 h-full flex-1">
    <div
      class="fc flex-1 h-full col-span-3 overflow-hidden border-[1px] border-solid border-[#E1E1E1] border-t-none border-b-none border-l-none"
    >
      <BoxChat :listMessage="listMessage" :isScrollToBottom="isScrollToBottom" @loadMore="getMessages" :isMain="true" />
      <div class="fc w-full p-2 gap-1">
        <!-- <div class="fr w-full border-t-[0.5px] border-t-solid border-t-[#ccc]"> -->
        <div class="fr flex-1 border-[1px] border-solid border-[#e7e7e9] rounded-[25px] p-1">
          <input
            type="text"
            :placeholder="t('common.enter_message')"
            v-model="message"
            @keyup.enter="debounceSend"
            class="w-full text-base placeholder:text-sm placeholder:font-500 placeholder:text-[#7E7E80] text-base outline-none rounded-[18px] focus:outline-none px-3 py-1 border-none"
          />
          <div
            class="rounded-full h-[32px] w-[32px] min-w-[32px] flex items-center justify-center p-0 m-0 bg-primary cursor-pointer"
            @click="debounceSend"
            :style="{
              cursor: message.length > 0 || !isLoading ? 'pointer' : 'not-allowed',
            }"
          >
            <img src="~/assets/icons/i-send-white.svg" class="w-20px h-20px" alt="" />
          </div>
        </div>
      </div>
    </div>
    <div class="grid col-span-2">
      <GroupInfo :info="info" />
    </div>
  </div>
</template>
