<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const toast = useToast()
const { $api } = useNuxtApp()
const { user } = useAuth()
const isLoading = ref(false)
const { t } = useI18n()

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
  zalo: {
    mode: 'manual', // manual | default
    access_token: '',
    refresh_token: '',
    app_id: '',
    secret_key: '',
    crm_template_id: '',
    referral_template_id: '',
    verify: false,
    is_active: true,
    bot: null,
    iframe: null,
    webhook_secret: '',
    phone_test: '',
  },
})
const { handleSubmit, resetForm } = useForm()
const getData = async () => {
  isLoading.value = true
  const { result }: any = await $api(`noti-config`, {
    method: 'GET',
  })
  if (result?.zalo) {
    form.value = result
    // getData()
  }
  isLoading.value = false
}
const listChatbot = ref<any>([])
const listIframe = ref<any>([])

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

getData()

const onSubmitZalo = handleSubmit(async (values) => {
  console.log(form.value, 'values')
  isLoading.value = true
  const { result, statusCode }: any = await $api(`noti-config/zalo`, {
    method: 'PUT',
    body: {
      name: 'config',
      zalo: form.value.zalo,
    },
  })
  if (statusCode == 200) {
    toast.add({ severity: 'success', summary: 'Notification', detail: 'Update successfully', life: 3000 })
  } else {
    isLoading.value = false
    toast.add({ severity: 'error', summary: 'Notification', detail: 'Error', life: 3000 })
  }
  isLoading.value = false
  getData()
})
const getUrlLoginZalo = handleSubmit(async (values) => {
  try {
    isLoading.value = true

    const { result, statusCode }: any = await $api(`noti-config/zalo-login`, {
      method: 'GET',
    })
    if (statusCode == 200) {
      toast.add({ severity: 'success', summary: 'Notification', detail: 'Update successfully', life: 3000 })
      // getData()
      window.location.href = result
    } else {
      isLoading.value = false
      toast.add({ severity: 'error', summary: 'Notification', detail: 'Error', life: 3000 })
    }
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    toast.add({ severity: 'error', summary: 'Notification', detail: 'Error', life: 3000 })
  }

  //   toast.success('Cập nhật thành công')
})
const verifyZalo = async () => {
  try {
    isLoading.value = true

    const { result, statusCode }: any = await $api(`noti-config/new-token`, {
      method: 'POST',
      body: {
        code: route.query?.code,
        state: route.query?.state,
      },
    })
    if (statusCode == 200) {
      toast.add({ severity: 'success', summary: 'Notification', detail: 'Update successfully', life: 3000 })
      // window.location.href = result
      router.push({
        query: {},
      })
      getData()
    } else {
      isLoading.value = false
      toast.add({ severity: 'error', summary: 'Notification', detail: 'Error', life: 3000 })
    }
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    toast.add({ severity: 'error', summary: 'Notification', detail: 'Error', life: 3000 })
  }
  window.location.reload()
}
const testVerifyZalo = async () => {
  try {
    isLoading.value = true

    const { result, statusCode }: any = await $api(`noti-config/test-zalo`, {
      method: 'POST',
    })
    console.log(result, 'result')
    if (statusCode == 200) {
      toast.add({ severity: 'success', summary: 'Notification', detail: 'Update successfully', life: 3000 })
      // getData()
      // window.location.href = result
    } else {
      isLoading.value = false
      toast.add({ severity: 'error', summary: 'Notification', detail: 'Error', life: 3000 })
    }
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    toast.add({ severity: 'error', summary: 'Notification', detail: 'Error', life: 3000 })
  }
}
if (route.query?.code?.length && route.query?.state) {
  verifyZalo()
}
</script>

<template>
  <div class="page p-4 fc gap-4">
    <div class="page-heading">
      Zalo config
      <span
        v-if="form.zalo?.verify"
        class="c-green text-sm ml-4 px-2 py-1 rounded-lg border-solid border-[1px] border-green"
        >Verified</span
      >
    </div>
    <div class="bg-white rounded p-4">
      <div class="text-sm mt-2" v-if="form.zalo.mode == 'manual'">
        Webhook: https://api-bot.mightyid.ca/api/zalo/webhook/{{ form.company }}
      </div>
      <form class="grid grid-cols-2 gap-4 mt-4" @submit.prevent="onSubmitZalo">
        <BaseInputSelect
          label="Mode"
          :options="modeOptions"
          name="mode"
          option-label="name"
          option-value="value"
          v-model="form.zalo.mode"
          :rules="{ required: true }"
        />
        <BaseInputText
          v-if="form.zalo.mode == 'manual'"
          v-model="form.zalo.app_id"
          name="app_id"
          label="App ID"
          :rules="{ required: true }"
        />
        <BaseInputText
          v-if="form.zalo.mode == 'manual'"
          v-model="form.zalo.secret_key"
          name="secret_key"
          label="Secret Key"
          :rules="{ required: true }"
        />

        <BaseInputText
          v-if="form.zalo.mode == 'manual'"
          v-model="form.zalo.crm_template_id" 
          name="crm_template_id" 
          label="Crm Template ID" 
        />
        <BaseInputText
          v-if="form.zalo.mode == 'manual'"
          v-model="form.zalo.referral_template_id"
          name="referral_template_id"
          label="Referral Template ID"
        />
        <BaseInputText
          v-if="form.zalo.mode == 'manual'"
          v-model="form.zalo.phone_test"
          name="phone_test"
          label="Phone test"
          :rules="{ required: form.zalo.crm_template_id || form.zalo.referral_template_id ? true : false }"
        />
        <BaseInputText
          v-if="form.zalo.mode == 'manual'"
          label="Webhook Secret (OA Secret Key)"
          name="webhook_secret"
          v-model="form.zalo.webhook_secret"
        />
        <BaseInputSelect
          label="Bot"
          :options="listChatbot"
          name="bot_id"
          :filter="true"
          option-label="name"
          option-value="_id"
          v-model="form.zalo.bot"
          :rules="{ required: true }"
        />
        <BaseInputSelect
          :label="t('common.campaign')"
          :options="listIframe"
          name="iframe_id"
          :filter="true"
          option-label="name"
          option-value="_id"
          v-model="form.zalo.iframe"
        />
        <BaseInputTextArea
          v-if="form.zalo.access_token"
          v-model="form.zalo.access_token"
          name="access_token"
          label="Access Token"
          :disabled="true"
          :rules="{ required: false }"
        />
        <div class="flex-1"></div>
        <BaseInputTextArea
          v-if="form.zalo.refresh_token"
          v-model="form.zalo.refresh_token"
          :disabled="true"
          name="refresh_token"
          label="Refresh Token"
          :rules="{ required: false }"
        />
        <div class="col-span-2">
          <BaseSwitch class="flex-1" name="active" :label="t('common.active')" v-model="form.zalo.is_active" />
        </div>
        <div class="col-span-2 c-red" v-if="!form.zalo.verify && form.zalo.phone_test">
          Please verify zalo config to use config
        </div>
        <div class="col-span-2 fr ai-c jc-fe gap-4">
          <Button
            label="Test Verify"
            v-if="
              !form.zalo.verify &&
              form.zalo.app_id &&
              form.zalo.access_token
            "
            :loading="isLoading"
            severity="primary"
            :disabled="isLoading"
            @click="testVerifyZalo"
          />
          <Button
            label="Get Access Token"
            v-if="!form.zalo.access_token && form.zalo.app_id"
            severity="primary"
            @click="getUrlLoginZalo"
            :disabled="isLoading"
            :loading="isLoading"
          />
          <Button label="Save" type="submit" severity="primary" :loading="isLoading" :disabled="isLoading" />
        </div>
      </form>
    </div>
  </div>
</template>
