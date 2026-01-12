<script lang="ts" setup>
const toast = useToast()
const { $api } = useNuxtApp()
const isLoading = ref(false)
const { t } = useI18n()
const listChatbot = ref<any>([])
const listIframe = ref<any>([])

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
    // getData()
  }
  isLoading.value = false
}

getData()

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
  const redirectUri = encodeURIComponent('https://bot.maplestc.com/facebook/callback')
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
</script>

<template>
  <div class="page p-4 fc gap-4">
    <div class="page-heading">Config Notification </div>
    <div class="bg-white rounded p-4">
      <div class="page-heading">
        Facebook config
        <span
          v-if="form.facebook?.verify"
          class="c-green text-sm ml-4 px-2 py-1 rounded-lg border-solid border-[1px] border-green"
          >Verified
        </span>
      </div>
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
    </div>
  </div>
</template>
