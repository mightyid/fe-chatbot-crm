<script lang="ts" setup>
import BoxChat from '~/components/BoxChat.vue'
import ChatTyping from '~/components/ChatTyping.vue'
import { io } from 'socket.io-client'

definePageMeta({
  auth: false,
  layout: 'blank',
})
const { $api } = useNuxtApp()
const route = useRoute()
const appStore = useAppStore()
const isShowBoxChat = ref(true)
const message = ref('')
const info = ref<any>({})
const token = ref(appStore.tokenBot || '')
const socket = ref()
const listMessage = ref<any>([])
const isLoading = ref(false)
const groupInfo = ref<any>({})
const isTyping = ref(false)
const isScrollToBottom = ref<any>('')
const boxStyle = ref({
  width: '100%',
  height: '100%',
  overflow: 'hidden',
})
const getData = async () => {
  const { result }: any = await $api(`incognito/${route.params.id}`)
  info.value = result
  console.log(token.value, 'token2222')
  if (token.value) {
    getInfoGroup()
  }
}
const getInfoGroup = async () => {
  const { result }: any = await $api(`incognito/${route.params.id}/lead`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  })
  groupInfo.value = result
  nextTick(() => {
    getMessage()
    licenseSocket()
  })
}
const startChat = async () => {
  const { result }: any = await $api(`incognito/${route.params.id}/start`, {
    method: 'POST',
    body: {
      form: {},
    },
  })
  token.value = result.access_token
  appStore.tokenBot = result.access_token
  groupInfo.value = result
  nextTick(() => {
    getMessage()
    licenseSocket()
  })
}

const getMessage = async () => {
  const { result }: any = await $api(`incognito/${route.params.id}/message`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  })
  console.log(result, 'result listMessage')
  listMessage.value = result
  isScrollToBottom.value = new Date().getTime()
}
const sendMessage = async () => {
  isLoading.value = true

  const { result }: any = await $api(`incognito/${route.params.id}/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.value}`,
      // Authorization: `11232131`,
    },
    body: {
      message: message.value,
      hash: new Date().getTime(),
    },
  })
  console.log(result, 'result message')
  message.value = ''
  isLoading.value = false

  const newMessage = {
    ...result,
    message: result?.message.message || '',
  }
  listMessage.value = [newMessage, ...listMessage.value]
  isScrollToBottom.value = new Date().getTime()

  // getMessage()
}
getData()
const licenseSocket = () => {
  const url = useRuntimeConfig().public.baseURL
  //@ts-ignore
  socket.value = io.connect(url, {
    transports: ['websocket'],
    query: {
      token: token.value,
    },
    reconnection: true,
    reconnectionDelay: 5000,
  })
  socket.value.emit('JOIN_LEAD', { lead_id: groupInfo.value._id })
  socket.value.on('JOIN_LEAD', (res: any) => {
    console.log(res, 'JOIN_LEAD')
  })
  socket.value.on('SEND_MESSAGE', (res: any) => {
    console.log(res, 'SEND_MESSAGE')
    if (res?.lead._id === groupInfo.value._id) {
      const newMessage = {
        ...res,
        message: res?.message.message || '',
      }
      listMessage.value = [newMessage, ...listMessage.value]
      isScrollToBottom.value = new Date().getTime()
    }
  })
  socket.value.on('TYPING', (res: any) => {
    if (res?.lead_id === groupInfo.value._id) {
      isScrollToBottom.value = new Date().getTime()
      isTyping.value = true
    }
  })
  socket.value.on('STOP_TYPING', (res: any) => {
    console.log(res, 'STOP_TYPING')
    isScrollToBottom.value = new Date().getTime()

    if (res?.lead_id === groupInfo.value._id) {
      isTyping.value = false
    }
  })
}
const closeChatbot = () => {
  isShowBoxChat.value = false
  var parentOrigin = window.location.ancestorOrigins
  window.parent.postMessage(message, parentOrigin[0])
}
// const startTyping = () => {
//   socket.emit('TYPING')
// }
// const stopTyping = () => {
//   socket.emit('STOP_TYPING')
// }
const debounceSend = useDebounceFn(() => {
  if (message.value) {
    sendMessage()
  }
}, 200)
onMounted(() => {})

onUnmounted(() => {
  // socket.off('WORKSPACE_UPDATE')
})
watch(
  () => message.value,
  (newValue) => {
    // if (newValue && newValue.length > 0) {
    //   startTyping()
    // } else stopTyping()
  },
)
</script>

<template>
  <div class="max-w-800px mx-a flex-1" v-if="info?._id">
    <div class="flex flex-col items-end justify-end">
      <div
        class="fc border-1 !bg-white border-gray-20 border-solid h-screen rounded overflow-hidden rounded-[16px]"
        v-show="isShowBoxChat"
      >
        <div class="fc justify-center items-center" v-if="!token">
          <div class=""> </div>
          <Button @click="startChat">Start</Button>
        </div>
        <div class="fc h-full" v-else>
          <BoxChat
            :listMessage="listMessage"
            :groupInfo="groupInfo"
            :isTyping="isTyping"
            :isScrollToBottom="isScrollToBottom"
          />
          <div class="fc w-full p-2 gap-1">
            <!-- <div class="fr w-full border-t-[0.5px] border-t-solid border-t-[#ccc]"> -->
            <div class="fr flex-1 border-[1px] border-solid border-[#e7e7e9] rounded-[25px] p-1">
              <input
                type="text"
                placeholder="Enter a message"
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
            <div class="fr items-center justify-center text-xs text-[#7E7E80] gap-1">
              Powered by <a href="https://mightyid.ca" class="c-primary" target="_blank">MightyID</a></div
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
