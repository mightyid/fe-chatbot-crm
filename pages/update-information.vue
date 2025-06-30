<script lang="ts" setup>
import FormProfile from '~/components/user/FormProfile.vue'
const { $api } = useNuxtApp()
const toast = useToast()
const { t } = useI18n()
const changePassword = async (form: any) => {
  const { result, statusCode }: any = await $api('user/update-profile', {
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
      <div class="page-heading">{{ t('common.update_information') }}</div>
      <div class="bg-white p-4 rounded mt-4">
        <FormProfile @onSubmit="changePassword" />
      </div>
    </div>
  </div>
</template>
