<script lang="ts" setup>
definePageMeta({
  auth: false,
  layout: 'blank',
})
const { $api } = useNuxtApp()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const info = ref<any>({})
const isSuccess = ref(false)
const form = ref<any>({
  data: {},
})
const { t } = useI18n()

if (!route.query?.iframe_id || !route.query?.company_id) {
  router.push('/')
}
const isCheckDisabled = computed(() => {
  console.log(Object.values(form.value.data)?.length, Object.keys(form.value.data)?.length)
  if (
    Object.values(form.value.data)?.length == Object.keys(form.value.data)?.length &&
    Object.values(form.value.data)?.length > 0
  ) {
    return false
  } else return true
})
const getData = async () => {
  const { result }: any = await $api(`crm-open-iframe/detail`, {
    method: 'GET',
    params: {
      iframe_id: route.query?.iframe_id,
      company_id: route.query?.company_id,

      //   label: route.params?.label,
    },
  })
  if (result) {
    info.value = result
    submitCRM()
  } else {
    router.push('/')
  }
}
const submitCRM = async () => {
  if (route.query?.zalo && route.query?.phone && route.query?.name) {
    const data = {
      name: route.query?.name,
      phone: route.query?.phone,
    }
    const { statusCode }: any = await $api('crm-open-iframe/submit', {
      method: 'POST',
      body: {
        company_id: route?.query?.company_id,
        iframe_id: route?.query?.iframe_id,
        referral_id: route.query.referral_id || undefined,

        data,
        zalo: true,
      },
    })
    if (statusCode == 200) {
      toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully', life: 3000 })
      isSuccess.value = true
      window.close()
    } else {
      router.push('/')
    }
  }
}
const onSubmit = async () => {
  if (!Object.values(form.value.data)?.length) {
    window.location.reload()
  } else {
    const { statusCode }: any = await $api('crm-open-iframe/submit', {
      method: 'POST',
      body: {
        company_id: route?.query?.company_id,
        iframe_id: route?.query?.iframe_id,
        data: form.value.data,
      },
    })
    if (statusCode == 200) {
      toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully', life: 3000 })
      isSuccess.value = true
    } else {
      router.push('/')
    }
  }
}
const cancel = () => {
  router.push('/')
}
getData()
</script>

<template>
  <div class="page bg-white p-4 rounded" v-if="!isSuccess">
    <div class="text-3xl font-bold">{{ info?.name }}</div>
    <div class="fc gap-1 text-base mt-2">
      <!-- <div class="fr ai-c font-bold">Information</div>
      <div class="fr ai-c">Company: {{ info?.company?.name }}</div> -->
      <!-- <div class="fr ai-c">Email: {{ info?.school?.email }}</div>
      <div class="fr ai-c">Phone: {{ info?.school?.phone }}</div> -->
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 mt-4 gap-4">
      <div class="flex gap-2 flex-col" v-for="column in info.fields" :key="column.key">
        <label class="text-base font-normal c-black-90" for="props.name">
          {{ column?.label }}
        </label>
        <InputText :name="column.label" type="text" placeholder="Enter" v-model="form.data[column.key]" />
      </div>
    </div>
    <div class="flex justify-end gap-4 mt-4">
      <Button :label="t('button.cancel')" severity="secondary" type="button" @click="cancel" />
      <Button label="Register" severity="primary" type="button" @click="onSubmit" :disabled="isCheckDisabled" />
    </div>
  </div>
  <div class="mx-auto max-w-500 fc jc-c ai-c mt-30vh mt-4" v-else>
    <img src="~/assets/images/success.svg" class="w-64px h-64px mb-3" alt="" />
    <div class="text-m c-black-90">Congratulations!</div>
    <div class="text-m c-black-90">You have successfully registered.</div>
    <!-- <Button label="Back to Home" class="mt-4" @click="$router.push('/')" /> -->
  </div>
</template>
