<script setup lang="ts">
import FormLeadCRM from '~/components/crm/FormLeadCRM.vue'
definePageMeta({
  //   permission: 'create_leadCRM',
})
const router = useRouter()
const toast = useToast()
const { $api } = useNuxtApp()
const links = ref([
  {
    title: 'Lead CRM',
    to: '/crm',
  },
  {
    title: 'Create',
    to: `/crm/create`,
  },
])

const createLeadCRM = async (form: any) => {
  const { statusCode }: any = await $api('lead', {
    method: 'POST',
    body: form,
  })

  if (statusCode === 200) {
    router.push('/crm')
    toast.add({ severity: 'success', summary: 'Successfully', detail: 'Created', life: 3000 })
  }
}
</script>

<template>
  <div class="page">
    <div class="page-content">
      <BreadCrumb :links="links" />

      <div class="box">
        <h2 class="name-page mb-4">Create</h2>

        <FormLeadCRM @onSubmit="createLeadCRM" @onCancel="router.push('/crm')" />
      </div>
    </div>
  </div>
</template>
