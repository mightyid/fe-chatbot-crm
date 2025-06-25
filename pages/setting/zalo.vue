<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const toast = useToast()
const { $api } = useNuxtApp()
const { user } = useAuth()
const isLoading = ref(false)
const form = ref<any>({
  zalo: {
    access_token: '',
    refresh_token: '',
    app_id: '',
    secret_key: '',
    crm_template_id: '',
    referral_template_id: '',
    verify: false,
    is_active: true,
  },
})
const { handleSubmit, resetForm } = useForm()
const getData = async () => {
  isLoading.value = true
  const { result }: any = await $api(`noti-config`, {
    method: 'GET',
  })
  if (result) {
    form.value = result
    // getData()
  }
  isLoading.value = false
}

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

  //   toast.success('Cập nhật thành công')
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
    <div class="page-heading">Config Notification </div>
    <div class="bg-white rounded p-4">
      <div class="page-heading">
        Zalo config
        <span
          v-if="form.zalo.verify"
          class="c-green text-sm ml-4 px-2 py-1 rounded-lg border-solid border-[1px] border-green"
          >Verified</span
        >
      </div>
      <form class="grid grid-cols-2 gap-4 mt-4" @submit.prevent="onSubmitZalo">
        <BaseInputText v-model="form.zalo.app_id" name="app_id" label="App ID" :rules="{ required: true }" />
        <BaseInputText
          v-model="form.zalo.secret_key"
          name="secret_key"
          label="Secret Key"
          :rules="{ required: true }"
        />

        <BaseInputText
          v-model="form.zalo.crm_template_id"
          name="crm_template_id"
          label="Crm Template ID"
          :rules="{ required: true }"
        />
        <BaseInputText
          v-model="form.zalo.referral_template_id"
          name="referral_template_id"
          label="Referral Template ID"
          :rules="{ required: true }"
        />
        <BaseInputText
          v-model="form.zalo.phone_test"
          name="phone_test"
          label="Phone test"
          :rules="{ required: true }"
        />
        <div class="flex-1"></div>
        <BaseInputTextArea
          v-if="form.zalo.access_token"
          v-model="form.zalo.access_token"
          name="access_token"
          label="Access Token"
          :disabled="true"
          :rules="{ required: false }"
        />
        <BaseInputTextArea
          v-if="form.zalo.refresh_token"
          v-model="form.zalo.refresh_token"
          :disabled="true"
          name="refresh_token"
          label="Refresh Token"
          :rules="{ required: false }"
        />
        <div class="col-span-2">
          <BaseSwitch class="flex-1" name="active" label="Active" v-model="form.zalo.is_active" />
        </div>
        <div class="col-span-2 c-red" v-if="!form.zalo.verify && form.zalo.phone_test">
          Please verify zalo config to get access token
        </div>
        <div class="col-span-2 fr ai-c jc-fe gap-4">
          <Button
            label="Test Verify"
            v-if="
              !form.zalo.verify &&
              form.zalo.phone_test &&
              form.zalo.app_id &&
              form.zalo.secret_key &&
              form.zalo.crm_template_id &&
              form.zalo.referral_template_id
            "
            :loading="isLoading"
            severity="primary"
            :disabled="isLoading"
            @click="testVerifyZalo"
          />
          <Button
            label="Get Access Token"
            v-if="!form.zalo.verify"
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
