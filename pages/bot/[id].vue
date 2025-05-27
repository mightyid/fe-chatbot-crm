<script lang="ts" setup>
import BoxChat from '~/components/BoxChat.vue'
import ChatTyping from '~/components/ChatTyping.vue'

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
const socket = useSocket()
const listMessage = ref<any>([])
const isLoading = ref(false)
const groupInfo = ref<any>({})
const isTyping = ref(false)
const isScrollToBottom = ref<any>('')
const boxStyle = ref({
  width: '368px',
  height: '375px',
  overflow: 'hidden',
})
const getData = async () => {
  const { result }: any = await $api(`incognito/${route.params.id}`)
  info.value = result
  console.log(token.value, 'token2222')
  if (token.value) {
    console.log('if')
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
  // groupInfo.value = {
  //   company: '682e8b849baa77491a3848d3',
  //   bot: '683192974f489de4e675d620',
  //   name: 'incognito',
  //   avatar: '',
  //   label: null,
  //   message: '683534b85831d29999a9c2a2',
  //   stop_bot: false,
  //   _id: '683534b8d0e5b3ac3d85200d',
  //   notes: [],
  //   created_at: '2025-05-27T03:42:48.630Z',
  //   updated_at: '2025-05-27T03:42:48.630Z',
  //   access_token:
  //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoiNjgyZThiODQ5YmFhNzc0OTFhMzg0OGQzIiwic2NvcGUiOiJsZWFkIiwiX2lkIjoiNjgzNTM0YjhkMGU1YjNhYzNkODUyMDBkIiwiaWF0IjoxNzQ4MzE3MzY4LCJleHAiOjE3Nzk4NTMzNjh9.QKteyelrGvnzvOFp5r2-Cp6k2Que3I2FMrNb4Z8w7Dc',
  // }
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

  isScrollToBottom.value = new Date().getTime()

  getMessage()
}
getData()
const licenseSocket = () => {
  socket.emit('JOIN_LEAD', { lead_id: groupInfo.value._id })
  socket.on('JOIN_LEAD', (res: any) => {
    console.log(res, 'JOIN_LEAD')
  })
  socket.on('SEND_MESSAGE', (res: any) => {
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
  socket.on('TYPING', (res: any) => {
    if (res?.lead_id === groupInfo.value._id) {
      isScrollToBottom.value = new Date().getTime()
      isTyping.value = true
    }
  })
  socket.on('STOP_TYPING', (res: any) => {
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
const startTyping = () => {
  socket.emit('TYPING')
}
const stopTyping = () => {
  socket.emit('STOP_TYPING')
}
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
  <div class="fixed bottom-24px right-24px" v-if="info?._id">
    <div class="flex flex-col items-end justify-end">
      <div
        class="fc border-1 !bg-white border-gray-20 border-solid rounded overflow-hidden rounded-lg"
        v-show="isShowBoxChat"
      >
        <div class="fr justify-between p-2 py-1">
          <div class="fr items-center gap-2">
            <img :src="info.avatar" class="w-[32px] h-[32px] rounded-full object-cover" alt="" v-if="info.avatar" />
            <img
              src="~/assets/images/logo-icon.svg"
              class="w-[32px] h-[32px] rounded-full object-cover"
              alt=""
              v-else
            />
            <div class="text-md font-semibold">{{ info?.name }}</div>
          </div>
          <img src="~/assets/icons/i-close-gray.svg" class="cursor-pointer" @click="closeChatbot" alt="" />
        </div>
        <div class="fc justify-center items-center" v-if="!token" :style="boxStyle">
          <div class=""> </div>
          <Button @click="startChat">Start</Button>
        </div>
        <div class="fc" :style="boxStyle" v-else>
          <BoxChat
            :listMessage="listMessage"
            :groupInfo="groupInfo"
            :isTyping="isTyping"
            :isScrollToBottom="isScrollToBottom"
          />
          <div class="fr w-full border-t-[0.5px] border-t-solid border-t-[#ccc]">
            <input
              type="text"
              placeholder="Type a message"
              v-model="message"
              @keyup.enter="sendMessage"
              class="w-full text-base placeholder:font-normal outline-none focus:outline-none border-none px-3 py-2"
            />
            <Button severity="primary" class="rounded-0" @click="sendMessage" :loading="isLoading">
              <img src="~/assets/icons/i-send-white.svg" alt="" />
            </Button>
          </div>
        </div>
      </div>
      <div
        class="relative fr justify-end cursor-pointer"
        :class="{ 'call-animation': !isShowBoxChat }"
        @click=";(isShowBoxChat = !isShowBoxChat), (isScrollToBottom = new Date().getTime())"
      >
        <img :src="info.avatar" class="h-[56px] h-[56px] rounded-full object-cover" alt="" v-if="info.avatar" />
        <img src="~/assets/images/logo-icon.svg" class="h-[56px] h-[56px] rounded-full object-cover" alt="" v-else />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
