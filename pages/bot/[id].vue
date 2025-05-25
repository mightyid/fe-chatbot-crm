<script lang="ts" setup>
import BoxChat from '~/components/BoxChat.vue'

definePageMeta({
  auth: false,
  layout: 'blank',
})
const { $api } = useNuxtApp()
const route = useRoute()
const isShowBoxChat = ref(true)
const message = ref('')
const info = ref<any>({})
const token = ref('')
const boxStyle = ref({
  width: '300px',
  height: '300px',
  overflow: 'auto',
})
const getData = async () => {
  const { result }: any = await $api(`incognito/${route.params.id}`)
  console.log(result, 'result')
  info.value = result
}
const startChat = async () => {
  const { result }: any = await $api(`incognito/${route.params.id}/start`, {
    method: 'POST',
    body: {
      form: [],
    },
  })
  console.log(result, 'result')
  token.value = result
}
getData()
</script>

<template>
  <div class="fixed bottom-24px right-24px" v-if="info?._id">
    <div class="flex flex-col items-end justify-end">
      <div
        class="fc border-1 border-gray-20 border-solid rounded overflow-hidden rounded-lg overflow-hidden"
        v-show="isShowBoxChat"
      >
        <div class="fr justify-between p-2 py-1">
          <div class="fr items-center gap-2">
            <img :src="info.avatar" class="h-[32px] h-[32px] rounded-full object-cover" alt="" v-if="info.avatar" />
            <img
              src="~/assets/images/logo-icon.svg"
              class="h-[32px] h-[32px] rounded-full object-cover"
              alt=""
              v-else
            />
            <div class="text-md font-semibold">{{ info?.name }}</div>
          </div>
          <img src="~/assets/icons/i-close-gray.svg" class="cursor-pointer" @click="isShowBoxChat = false" alt="" />
        </div>
        <div class="fc justify-center items-center" v-if="!token" :style="boxStyle">
          <div class=""> </div>
          <Button @click="startChat">Start</Button>
        </div>
        <div class="fc" :style="boxStyle" v-else>
          <BoxChat :style="boxStyle" />
          <div class="fr w-full border-t-[0.5px] border-t-solid border-t-[#ccc]">
            <input
              type="text"
              placeholder="Type a message"
              v-model="message"
              class="w-full text-base placeholder:font-normal outline-none focus:outline-none border-none px-3 py-2"
            />
            <Button severity="primary" class="rounded-0">
              <img src="~/assets/icons/i-send-white.svg" alt="" />
            </Button>
          </div>
        </div>
      </div>
      <div
        class="relative fr justify-end cursor-pointer"
        :class="{ 'call-animation': !isShowBoxChat }"
        @click="isShowBoxChat = !isShowBoxChat"
      >
        <img :src="info.avatar" class="h-[56px] h-[56px] rounded-full object-cover" alt="" v-if="info.avatar" />
        <img src="~/assets/images/logo-icon.svg" class="h-[56px] h-[56px] rounded-full object-cover" alt="" v-else />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.call-animation {
  // background: #fff;
  aspect-ratio: 1/1;
  position: relative;
  width: max-content;
  border-radius: 100%;
  //   border: solid 5px #fff;
  background: transparent;
}
.call-animation:before {
  position: absolute;
  content: '';
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: play 1s linear infinite;
  backface-visibility: hidden;
  border-radius: 50%;
}
@keyframes play {
  0% {
    transform: scale(1);
  }
  15% {
    box-shadow: 0 0 0 5px rgba(#c4ebfe, 0.4);
  }
  25% {
    box-shadow: 0 0 0 10px rgba(#c4ebfe, 0.4), 0 0 0 20px rgba(#c4ebfe, 0.2);
  }
  25% {
    box-shadow: 0 0 0 15px rgba(#c4ebfe, 0.4), 0 0 0 30px rgba(#c4ebfe, 0.2);
  }
  50% {
    box-shadow: 0 0 0 25px rgba(#c4ebfe, 0.4), 0 0 0 50px rgba(#c4ebfe, 0.2);
  }
  100% {
    box-shadow: 0 0 0 25px rgba(#c4ebfe, 0.4), 0 0 0 50px rgba(#c4ebfe, 0.2);
    transform: scale(1.1);
    opacity: 0;
  }
}
</style>
