<script lang="ts" setup>
import FormProfile from '~/components/user/FormProfile.vue'
const { $api } = useNuxtApp()
const toast = useToast()
const router = useRouter()
const { t } = useI18n()
const changePassword = async (form: any) => {
  const { result, statusCode }: any = await $api('referral/update-profile', {
    method: 'PUT',
    body: form,
  })
  if (statusCode === 200) {
    toast.add({ severity: 'success', summary: 'Successfully', detail: 'Created', life: 3000 })
  }
}
</script>

<template>
  <div class="page">
    <div class="page-content">
      <div class="page-heading"> {{ t('common.profile') }}</div>
      <div class="bg-white p-4 rounded mt-4">
        <FormProfile @onSubmit="changePassword" @onCancel="router.go(-1)" />
      </div>
    </div>
  </div>
</template>
