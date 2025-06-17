<script setup lang="ts">
import FormLeadCRM from '~/components/crm/FormLeadCRM.vue'
definePageMeta({
  //   permission: 'create_leadCRM',
})
const router = useRouter()
const toast = useToast()
const route = useRoute()
const info = ref<any>({
  name: '',
})
const dataColumn = ref({})
const columns = ref<any>([])
const { $api } = useNuxtApp()
const links = ref([
  {
    title: 'Lead CRM',
    to: '/crm',
  },
  {
    title: 'Edit',
    to: `/crm/edit/${route.params.id}`,
  },
])
const getData = async () => {
  const { result }: any = await $api(`lead/${route.params.id}`)
  info.value = result || {}
  if (result?.data) {
    getColumns()
  }
}

const getColumns = async () => {
  const { result }: any = await $api('crm-field', {
    method: 'GET',
  })
  columns.value = result || []
  let new_data = {} as any
  columns.value.forEach((column: any) => {
    new_data[column.key] = info.value.data[column.key]?.value || ''
  })
  info.value.data = new_data
}
const editLeadCRM = async (form: any) => {
  const { statusCode }: any = await $api(`lead/${route.params.id}`, {
    method: 'PUT',
    body: form,
  })

  if (statusCode) {
    router.push('/crm')
    toast.add({ severity: 'success', summary: 'Successfully', detail: 'Created', life: 3000 })
  }
}
getData()
</script>

<template>
  <div class="page">
    <div class="page-content">
      <BreadCrumbLinks :links="links" />

      <div class="box">
        <div class="page-heading mb-4">Edit Lead CRM</div>

        <FormLeadCRM
          @onEdit="editLeadCRM"
          :isEdit="true"
          @onCancel="router.push('/crm')"
          :data="{
            label_id: info.label,
            name: info.name,
            data: info.data,
          }"
        />
      </div>
    </div>
  </div>
</template>
