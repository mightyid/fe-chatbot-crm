<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const toast = useToast()
const { $api } = useNuxtApp()
const { user } = useAuth()
const isLoading = ref(false)
const mailType = ['smtp', 'ses']
const { t } = useI18n()
const form = ref<any>({
  mail: {
    from: 'no-reply@studyguide.dev',
    type: 'smtp',
    // type: smtp
    host: 'smtp.gmail.com',
    user: 'hunglyquoc2003@gmail.com',
    password: '',
    // type: ses
    accessKeyId: '',
    secretAccessKey: '',
    region: 'ap-southeast-1',
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

const onSubmitMail = handleSubmit(async (values) => {
  console.log(form.value, 'values')
  isLoading.value = true
  const { result, statusCode }: any = await $api(`noti-config/email`, {
    method: 'PUT',
    body: {
      name: 'config',
      mail: form.value.mail,
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

const verifyMail = async () => {
  try {
    isLoading.value = true

    const { result, statusCode }: any = await $api(`noti-config/test-mail`, {
      method: 'POST',
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
</script>

<template>
  <div class="page p-4 fc gap-4">
    <div class="page-heading">Config Notification </div>
    <div class="bg-white rounded p-4">
      <div class="page-heading">
        Mail config
        <span
          v-if="form.mail.verify"
          class="c-green text-sm ml-4 px-2 py-1 rounded-lg border-solid border-[1px] border-green"
          >Verified</span
        >
      </div>
      <form class="grid grid-cols-2 gap-4 mt-4" @submit.prevent="onSubmitMail">
        <BaseInputSelect
          v-model="form.mail.type"
          name="type"
          label="Type"
          :options="mailType"
          :rules="{ required: true }"
          option-label=""
          option-value=""
        />
        <BaseSwitch class="flex-1" name="active" :label="t('common.active')" v-model="form.mail.is_active" />
        <div class="col-span-2 grid grid-cols-2 gap-4" v-if="form.mail.type == 'smtp'">
          <BaseInputText
            v-model="form.mail.from"
            name="from"
            label="Email From"
            :rules="{ required: true, email: true }"
          />
          <BaseInputText v-model="form.mail.host" name="host" label="Email Host" :rules="{ required: true }" />
          <BaseInputText
            v-model="form.mail.user"
            name="user"
            label="Email User"
            :rules="{ required: true, email: true }"
          />
          <BaseInputText
            v-model="form.mail.password"
            name="password"
            :label="t('common.password')"
            :rules="{ required: true }"
          />
        </div>

        <div class="col-span-2 grid grid-cols-2 gap-4" v-if="form.mail.type == 'ses'">
          <BaseInputText
            v-model="form.mail.from"
            name="from"
            label="Email From"
            :rules="{ required: true, email: true }"
          />
          <BaseInputText
            v-model="form.mail.accessKeyId"
            name="accessKeyId"
            label=" AccessKeyId"
            :rules="{ required: true }"
          />
          <BaseInputText
            v-model="form.mail.secretAccessKey"
            name="secretAccessKey"
            label="SecretAccessKey"
            :rules="{ required: true }"
          />
          <BaseInputText v-model="form.mail.region" name="region" label="Region" :rules="{ required: true }" />
        </div>
        <div class="col-span-2 fr ai-c jc-fe gap-4">
          <Button
            label="Verify"
            v-if="!form.mail.verify"
            severity="primary"
            @click="verifyMail"
            :disabled="isLoading"
            :loading="isLoading"
          />
          <Button label="Save" type="submit" severity="primary" :loading="isLoading" :disabled="isLoading" />
        </div>
      </form>
    </div>
  </div>
</template>
