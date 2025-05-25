<script setup lang="ts">
import FormCompany from '~/components/admin/company/FormCompany.vue'
import FormChatbot from '~/components/chatbot/FormChatbot.vue'
definePageMeta({
  //   permission: 'create_leadCRM',
})
const router = useRouter()
const toast = useToast()
const route = useRoute()
const info = ref<any>({})
const dataColumn = ref({})
const columns = ref<any>([])
const { $api } = useNuxtApp()
const links = ref([
  {
    title: 'Company',
    to: '/admin/company',
  },
  {
    title: 'Edit',
    to: `/admin/company/edit/${route.params.id}`,
  },
])
const getData = async () => {
  const { result }: any = await $api(`admin/company/${route.params.id}`)
  info.value = result || {}
}

const editChatbot = async (form: any) => {
  const { statusCode }: any = await $api(`admin/company/${route.params.id}`, {
    method: 'PUT',
    body: form,
  })

  if (statusCode) {
    router.push('/admin/company')
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
        <div class="page-heading mb-4">Edit Company</div>

        <FormCompany
          @onEdit="editChatbot"
          :isEdit="true"
          @onCancel="router.push('/admin/company')"
          :data="{
            ...info,
          }"
        />
      </div>
    </div>
  </div>
</template>
