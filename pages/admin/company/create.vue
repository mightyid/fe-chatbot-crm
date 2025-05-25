<script setup lang="ts">
import FormCompany from '~/components/admin/company/FormCompany.vue'
definePageMeta({
  //   permission: 'create_leadCRM',
})
const router = useRouter()
const toast = useToast()
const { $api } = useNuxtApp()
const links = ref([
  {
    title: 'Company',
    to: '/admin/company',
  },
  {
    title: 'Create',
    to: `/admin/company/create`,
  },
])

const createLeadCRM = async (form: any) => {
  const { statusCode }: any = await $api('admin/company', {
    method: 'POST',
    body: form,
  })

  if (statusCode === 200) {
    router.push('/admin/company')
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

        <FormCompany @onSubmit="createLeadCRM" @onCancel="router.push('/crm')" />
      </div>
    </div>
  </div>
</template>
