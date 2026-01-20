<script lang="ts" setup>
const toast = useToast()
const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const isLoading = ref(false)
const { t } = useI18n()
const listChatbot = ref<any>([])
const listIframe = ref<any>([])
const listPageFacebook = ref<any>([])

const modeOptions = [
  {
    name: 'Default',
    value: 'default',
  },
  {
    name: 'Manual',
    value: 'manual',
  },
]

const form = ref<any>({
  facebook: {
    mode: 'manual', // manual | default
    page_access_token: '',
    verify_token: '',
    app_id: '',
    app_secret: '',
    bot: '',
    iframe: '',
    is_active: true,
  },
})
const { handleSubmit, resetForm } = useForm()
const getData = async () => {
  isLoading.value = true
  const { result }: any = await $api(`noti-config`, {
    method: 'GET',
  })
  if (result?.facebook) {
    form.value = result
  }
  isLoading.value = false
}

const verifyCodeFacebook = async () => {
  await $api(`noti-config/facebook/code`, {
    method: 'POST',
    body: {
      code: route.query?.code,
    },
  })
  
  window.location.href = '/setting/facebook'
}
if (route.query?.code) {
  verifyCodeFacebook()
} else {
  getData()
}


const onSubmitFacebookConfig = handleSubmit(async (values) => {
  console.log(form.value, 'values')
  isLoading.value = true
  const { result, statusCode }: any = await $api(`noti-config/facebook`, {
    method: 'PUT',
    body: {
      name: 'config',
      facebook: form.value.facebook,
    },
  })
  if (statusCode == 200) {
    toast.add({ severity: 'success', summary: 'Notification', detail: 'Update successfully', life: 3000 })
  } else {
    isLoading.value = false
    toast.add({ severity: 'error', summary: 'Notification', detail: 'Error', life: 3000 })
  }
  isLoading.value = false

  if (form.value.facebook.mode == 'default' && result.facebook?.is_active) {
    connectFacebook(result.facebook.app_id)
  }
})

const connectFacebook = (app_id: string) => {
  const redirectUri = encodeURIComponent(window.location.origin + '/setting/facebook')
  const scope = [
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_metadata',
    'pages_messaging' // nếu làm chatbot
  ].join(',')

  const fbUrl =
    `https://www.facebook.com/v23.0/dialog/oauth` +
    `?client_id=${app_id}` +
    `&redirect_uri=${redirectUri}` +
    `&scope=${scope}` +
    `&response_type=code`

  window.location.href = fbUrl
}

const getListBot = async () => {
  const { loading, result, total_pages, total }: any = await $api('chat-bot', {
    method: 'GET',
  })
  listChatbot.value = result || []
}
const getListIframe = async () => {
  const { result }: any = await $api(`iframe`, {
    method: 'GET',
  })
  listIframe.value = result || []
}
getListBot()
getListIframe()

const getFacebookPageList = async () => {
  const { result }: any = await $api(`noti-config/facebook/page-list`, {
    method: 'GET',
  })
  listPageFacebook.value = result || []
}
getFacebookPageList()
const disconnectionPageFacebook = async (pageId: string) => {
  await $api(`noti-config/facebook/${pageId}/disconnect`, {
    method: 'POST',
  })
  window.location.reload();
}
const connectionPageFacebook = async (pageId: string) => {
  await $api(`noti-config/facebook/${pageId}/connect`, {
    method: 'POST',
  })
  window.location.reload();
};

</script>

<template>
  <div class="page p-4 fc gap-4">
    <div class="page-heading">
      Facebook config
      <span
        v-if="form.facebook?.verify"
        class="c-green text-sm ml-4 px-2 py-1 rounded-lg border-solid border-[1px] border-green"
        >Verified
      </span>
    </div>
    <div class="bg-white rounded p-4" v-if="!route.query?.code">
      <div class="text-sm mt-2" v-if="form.facebook.mode == 'manual'">
        Webhook: https://api-bot.mightyid.ca/api/facebook/webhook/{{ form.company }}
      </div>
      <form class="grid grid-cols-2 gap-4 mt-4" @submit.prevent="onSubmitFacebookConfig">
        <BaseInputSelect
          label="Mode"
          :options="modeOptions"
          name="mode"
          option-label="name"
          option-value="value"
          v-model="form.facebook.mode"
          :rules="{ required: true }"
        />
        <BaseInputText
          v-if="form.facebook.mode == 'manual'"
          v-model="form.facebook.page_access_token"
          name="page_access_token"
          label="Page Access Token"
          :rules="{ required: true }"
        />
        <BaseInputText
          v-if="form.facebook.mode == 'manual'"
          v-model="form.facebook.verify_token"
          name="verify_token"
          label="Verify Token"
          :rules="{ required: true }"
        />
        <BaseInputText
          v-if="form.facebook.mode == 'manual'"
          v-model="form.facebook.app_id"
          name="app_id"
          label="App ID"
          :rules="{ required: true }"
        />
        <BaseInputText
          v-if="form.facebook.mode == 'manual'"
          v-model="form.facebook.app_secret"
          name="app_secret"
          label="App Secret"
          :rules="{ required: true }"
        />

        <BaseInputSelect
          label="Bot"
          :options="listChatbot"
          name="bot_id"
          :filter="true"
          option-label="name"
          option-value="_id"
          v-model="form.facebook.bot"
          :rules="{ required: true }"
        />
        <BaseInputSelect
          :label="t('common.campaign')"
          :options="listIframe"
          name="iframe_id"
          :filter="true"
          option-label="name"
          option-value="_id"
          v-model="form.facebook.iframe"
        />
        <div class="col-span-2">
          <BaseSwitch class="flex-1" name="active" :label="t('common.active')" v-model="form.facebook.is_active" />
        </div>

        <div class="col-span-2 fr ai-c jc-fe gap-4">
          <Button label="Save" type="submit" severity="primary" :loading="isLoading" :disabled="isLoading" />
        </div>
      </form>

      <hr>
      <div class="mt-4">
        <div class="text-lg font-bold mb-2">Facebook Pages</div>
        <div v-if="listPageFacebook.length == 0">No pages connected.</div>
        <div v-else>
          <div v-for="page in listPageFacebook" :key="page._id" class="flex w-[100%] justify-between items-center py-4 border-b">
            <div>
              <div class="font-semibold">
                {{ page.name }}
                <span
                  v-if="page.is_connection"
                  class="c-green text-sm px-2 py-1"
                  >Connected
                </span>
              </div>
              <div class="text-sm text-gray-600">ID: {{ page.page_id }}</div>
            </div>
            <div>
              <Button class="!text-red" severity="secondary" v-if="page.is_connection" @click="disconnectionPageFacebook(page._id)">Disconnect</Button>
              <Button severity="primary" v-else @click="connectionPageFacebook(page._id)">Connect</Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="loading-container" v-else>
      <div class="loading-content">
        <div class="spinner">
          <div class="spinner-circle spinner-circle-outer"></div>
          <div class="spinner-circle spinner-circle-middle"></div>
          <div class="spinner-circle spinner-circle-inner"></div>
        </div>
        <div class="loading-text">Đang xử lý kết nối Facebook...</div>
        <div class="loading-subtext">Vui lòng đợi trong giây lát</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 150px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 24px;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.spinner {
  position: relative;
  width: 120px;
  height: 120px;
}

.spinner-circle {
  position: absolute;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #3abff8;
  animation: spin 1.5s linear infinite;
}

.spinner-circle-outer {
  width: 120px;
  height: 120px;
  border-width: 4px;
  animation-duration: 2s;
}

.spinner-circle-middle {
  width: 90px;
  height: 90px;
  top: 15px;
  left: 15px;
  border-width: 3px;
  border-top-color: #5fcfff;
  animation-duration: 1.5s;
  animation-direction: reverse;
}

.spinner-circle-inner {
  width: 60px;
  height: 60px;
  top: 30px;
  left: 30px;
  border-width: 3px;
  border-top-color: #8edfff;
  animation-duration: 1s;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 24px;
  font-weight: 700;
  color: #313131;
  text-align: center;
  animation: pulse 2s ease-in-out infinite;
}

.loading-subtext {
  font-size: 16px;
  font-weight: 400;
  color: #8a8a8a;
  text-align: center;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>

