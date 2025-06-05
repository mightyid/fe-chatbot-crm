<script setup lang="ts">
import FormIframe from '~/components/crm/FormIframe.vue'
definePageMeta({
  //   permission: 'create_leadCRM',
})
const router = useRouter()
const route = useRoute()
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
  const { statusCode }: any = await $api(`iframe/${route.params.id}`, {
    method: 'PUT',
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
        <div class="page-heading mb-4">Edit</div>
        <FormIframe @onSubmit="createLeadCRM" :isEdit="true" @onCancel="router.push('/link')" />
      </div>
    </div>
  </div>
</template>
