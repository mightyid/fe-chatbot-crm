<script setup lang="ts">
import FormUserReferral from '~/components/referral/FormUserReferral.vue'

definePageMeta({
  titleBreadCrumb: 'button.add_new',
  permission: 'create_employee',
})

const { t } = useI18n()
const { $moment, $api } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const info = ref<any>({})

const isSubmit = ref(false)
const headEl = ref<any>(null)

const isPageEdit = computed(() => (route.params.id ? true : false))
const getData = async () => {
  const { result }: any = await $api(`user-referral/${route.params.id}`)
  info.value = {
    ...result?.referralInfo,
    bot_id: result?.referralInfo?.bot?._id,
    iframe_id: result?.referralInfo?.iframe?._id,
  }
}
getData()
const submitStaffInfo = async (obj: any) => {
  const { statusCode }: any = await $api(`user-referral/${route.params.id}`, {
    method: 'PUT',
    body: obj,
  })
  if (statusCode === 200) {
    toast.add({ severity: 'success', summary: 'Successfully', detail: 'Created', life: 3000 })
    router.push(`/referral/management`)
  }
}
</script>

<template>
  <div class="page">
    <div ref="headEl" class="page-content">
      <BreadCrumbLinks />
      <div class="box">
        <h1 class="page-heading m-0 mb-6">
          {{ isPageEdit ? `${t('common.update_employee')}` : t('common.add_employee') }}
        </h1>
        <FormUserReferral :isSubmit="isSubmit" @onSubmit="submitStaffInfo" :info="info" />
      </div>
    </div>
  </div>
</template>
