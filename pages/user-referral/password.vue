<script lang="ts" setup>
import FormPassword from '~/components/user/FormPassword.vue'
const { $api } = useNuxtApp()
const { t } = useI18n()
const toast = useToast()
const changePassword = async (form: any) => {
  const { result, statusCode }: any = await $api('referral/change-password', {
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
      <div class="page-heading"> {{ t('common.change_password') }} </div>
      <div class="bg-white p-4 rounded mt-4">
        <FormPassword @onSubmit="changePassword" />
      </div>
    </div>
  </div>
</template>
