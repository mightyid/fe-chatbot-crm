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
// const token = ref('')
const socket = ref()
const listMessage = ref<any>([])
const isLoading = ref(false)
const groupInfo = ref<any>({})
const isTyping = ref(false)
const isScrollToBottom = ref<any>('')
const isLoadMore = ref(true)
const lastMessageId = ref()
const form = ref<any>([])
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
    getInfoGroup()
  }
  if (result.form) {
    form.value = result.form
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
  const newForm = {}
  form.value.forEach((item: any) => {
    //@ts-ignore
    newForm[item.key] = item.value
  })
  const { result }: any = await $api(`incognito/${route.params.id}/start`, {
    method: 'POST',
    body: {
      form: newForm,
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
  if (isLoadMore.value) {
    const { result }: any = await $api(`incognito/${route.params.id}/message`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      params: {
        last_message_id: lastMessageId.value,
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
  message.value = ''
  isLoading.value = false
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
const checkDisabled = computed(() => {
  if (info.value.form && info.value.form.length > 0 && info.value.form[0].key) {
    let isDisabled = false
    info.value.form.forEach((item: any) => {
      if (!item.value) {
        isDisabled = true
      }
    })
    return isDisabled
  } else {
    return false
  }
})
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
    if (res?.lead._id === groupInfo.value._id) {
      const id = listMessage.value.findIndex((item: any) => item?.hash === res?.hash)
      if (id == -1) {
        const newMessage = {
          ...res,
          message: res?.message.message || '',
        }
        listMessage.value = [newMessage, ...listMessage.value]
        isScrollToBottom.value = new Date().getTime()
      } else {
        listMessage.value[id].message = res?.message.message || ''
      }
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
  sendMessage()
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
  <div class="fixed bottom-24px right-24px" v-if="info?._id">
    <div class="flex flex-col items-end justify-end">
      <div
        class="fc border-1 !bg-white border-gray-20 border-solid rounded overflow-hidden rounded-[16px]"
        v-show="isShowBoxChat"
      >
        <div class="fr justify-between p-2 py-2 bg-primary">
          <div class="fr items-center gap-2">
            <div class="fc w-[32px] aspect-square rounded-full overflow-hidden bg-white">
              <img :src="info.avatar" class="w-[32px] h-[32px] rounded-full object-cover" alt="" v-if="info.avatar" />
              <img
                src="~/assets/images/logo-icon.svg"
                class="w-[32px] h-[32px] rounded-full object-cover"
                alt=""
                v-else
              />
            </div>

            <div class="text-md font-semibold c-white line-clamp-1">{{ info?.name }}</div>
          </div>
          <div class="fr ai-c gap-2">
            <nuxt-link :to="`/bot-full/${info?._id}`" target="_blank">
              <img src="~/assets/icons/i-zoom.svg" class="cursor-pointer" @click="closeChatbot" alt="" />
            </nuxt-link>
            <img src="~/assets/icons/i-close-circle.svg" class="cursor-pointer" @click="closeChatbot" alt="" />
          </div>
        </div>
        <div class="fc !overflow-auto gap-4" v-if="!token || !groupInfo" :style="boxStyle">
          <div class="fc flex-1 justify-center gap-4 p-4">
            <div class="fc justify-center gap-4" v-if="info.form && info.form.length > 0 && info.form[0].key">
              <BaseInputText
                v-for="(item, index) in info.form"
                class="flex-1"
                v-model="form[index].value"
                :name="item.label"
                type="text"
                :label="item.label"
                placeholder="Enter "
              />
            </div>

            <Button class="w-full" @click="startChat" :disabled="checkDisabled">Start</Button>
          </div>
        </div>
        <div class="fc" :style="boxStyle" v-else>
          <BoxChat
            :listMessage="listMessage"
            :groupInfo="groupInfo"
            :isTyping="isTyping"
            :isScrollToBottom="isScrollToBottom"
            @loadMore="getMessage"
          />
          <div class="fc w-full p-2 gap-1">
            <!-- <div class="fr w-full border-t-[0.5px] border-t-solid border-t-[#ccc]"> -->
            <div class="fr flex-1 border-[1px] border-solid border-[#e7e7e9] rounded-[25px] p-1 ai-c">
              <input
                type="text"
                rows="1"
                placeholder="Enter a message"
                v-model="message"
                @keypress.enter="debounceSend"
                class="w-full h-auto text-base placeholder:text-sm placeholder:font-500 placeholder:text-[#7E7E80] text-base outline-none rounded-[18px] focus:outline-none px-3 py-1 border-none"
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
      <div
        class="relative fr justify-end cursor-pointer"
        :class="{ 'call-animation': !isShowBoxChat }"
        @click=";(isShowBoxChat = !isShowBoxChat), (isScrollToBottom = new Date().getTime())"
      >
        <img :src="info.avatar" class="w-[56px] h-[56px] rounded-full object-cover" alt="" v-if="info.avatar" />
        <img src="~/assets/images/logo-icon.svg" class="w-[56px] h-[56px] rounded-full object-cover" alt="" v-else />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
textarea {
  resize: none;
}
</style>
