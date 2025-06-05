<script setup lang="ts">
import FormIframe from '~/components/crm/FormIframe.vue'
definePageMeta({
  //   permission: 'create_leadCRM',
})
const router = useRouter()
const toast = useToast()
const { $api } = useNuxtApp()
const links = ref([
  {
    title: 'Campaign',
    to: '/link',
  },
  {
    title: 'Create',
    to: `/link/create`,
  },
])

const createLeadCRM = async (form: any) => {
  const { statusCode }: any = await $api('iframe', {
    method: 'POST',
    body: form,
  })

  if (statusCode === 200) {
    router.push('/link')
    toast.add({ severity: 'success', summary: 'Successfully', detail: 'Created', life: 3000 })
  }
}
</script>

<template>
  <div class="page">
    <div class="page-content">
      <BreadCrumbLinks :links="links" />

      <div class="box">
        <div class="page-heading mb-4">Create</div>
        <FormIframe @onSubmit="createLeadCRM" @onCancel="router.push('/crm')" />
      </div>
    </div>
  </div>
</template>
