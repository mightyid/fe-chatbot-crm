<script lang="ts" setup>
import FormCompanyProfile from '~/components/user/FormCompanyProfile.vue'
const { $api } = useNuxtApp()
const toast = useToast()
const info = ref<any>({})

const getData = async () => {
  const { result }: any = await $api('company')
  info.value = result
}
getData()
const changeProfile = async (form: any) => {
  const { result, statusCode }: any = await $api('company', {
    method: 'PUT',
    body: form,
  })
  if (statusCode === 200) {
    toast.add({ severity: 'success', summary: 'Successfully', detail: 'Updated successfully', life: 3000 })
  }
}
</script>

<template>
  <div class="page">
    <div class="page-content">
      <div class="page-heading">Change Password</div>
      <div class="bg-white p-4 rounded mt-4">
        <FormCompanyProfile @onSubmit="changeProfile" :data="info" />
      </div>
    </div>
  </div>
</template>
