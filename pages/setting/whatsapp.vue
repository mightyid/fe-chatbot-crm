<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const toast = useToast()
const { $api } = useNuxtApp()
const { user } = useAuth()
const isLoading = ref(false)
const mailType = ['smtp', 'ses']
const { t } = useI18n()
const listChatbot = ref<any>([])
const listIframe = ref<any>([])

const form = ref<any>({
  whatsapp: {
    page_access_token: '',
    verify_token: '',
    app_id: '',
    app_secret: '',
    bot: '',
    iframe: '',
    is_active: true,
    business_phone_number_id: '',
  },
})
const { handleSubmit, resetForm } = useForm()
const getData = async () => {
  isLoading.value = true
  const { result }: any = await $api(`noti-config`, {
    method: 'GET',
  })
  if (result?.whatsapp) {
    form.value = result
    // getData()
  }
  isLoading.value = false
}

getData()

const onSubmitMail = handleSubmit(async (values) => {
  console.log(form.value, 'values')
  isLoading.value = true
  const { result, statusCode }: any = await $api(`noti-config/whatsapp`, {
    method: 'PUT',
    body: {
      name: 'config',
      whatsapp: form.value.whatsapp,
    },
  })
  if (statusCode == 200) {
    toast.add({ severity: 'success', summary: 'Notification', detail: 'Update successfully', life: 3000 })
  } else {
    isLoading.value = false
    toast.add({ severity: 'error', summary: 'Notification', detail: 'Error', life: 3000 })
  }
  isLoading.value = false

  //   toast.success('Cập nhật thành công')
})

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
        Whatsapp config
        <span
          v-if="form.whatsapp?.verify"
          class="c-green text-sm ml-4 px-2 py-1 rounded-lg border-solid border-[1px] border-green"
          >Verified
        </span>
      </div>
      <form class="grid grid-cols-2 gap-4 mt-4" @submit.prevent="onSubmitMail">
        <BaseInputText
          v-model="form.whatsapp.page_access_token"
          name="page_access_token"
          label="Page Access Token"
          :rules="{ required: true }"
        />
        <BaseInputText
          v-model="form.whatsapp.verify_token"
          name="verify_token"
          label="Verify Token"
          :rules="{ required: true }"
        />
        <BaseInputText v-model="form.whatsapp.app_id" name="app_id" label="App ID" :rules="{ required: true }" />
        <BaseInputText
          v-model="form.whatsapp.app_secret"
          name="app_secret"
          label="App Secret"
          :rules="{ required: true }"
        />
        <BaseInputText
          v-model="form.whatsapp.business_phone_number_id"
          name="business_phone_number_id"
          label="Business Phone Number ID"
          :rules="{ required: false }"
        />

        <BaseInputSelect
          label="Bot"
          :options="listChatbot"
          name="bot_id"
          :filter="true"
          option-label="name"
          option-value="_id"
          v-model="form.whatsapp.bot"
        />
        <BaseInputSelect
          :label="t('common.campaign')"
          :options="listIframe"
          name="iframe_id"
          :filter="true"
          option-label="name"
          option-value="_id"
          v-model="form.whatsapp.iframe"
        />
        <div class="col-span-2">
          <BaseSwitch class="flex-1" name="active" :label="t('common.active')" v-model="form.whatsapp.is_active" />
        </div>

        <div class="col-span-2 fr ai-c jc-fe gap-4">
          <Button label="Save" type="submit" severity="primary" :loading="isLoading" :disabled="isLoading" />
        </div>
      </form>
    </div>
  </div>
</template>
