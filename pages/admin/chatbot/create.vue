<script setup lang="ts">
import FormChatbot from '~/components/chatbot/FormChatbot.vue'
definePageMeta({
  //   permission: 'create_leadCRM',
})
const router = useRouter()
const toast = useToast()
const { $api } = useNuxtApp()
const { t } = useI18n()
const search = ref('')
const companyId = ref('')
const companyOptions = ref([])
const links = ref([
  {
    title: 'Chatbot',
    to: '/admin/chatbot',
  },
  {
    title: t('button.create'),
    to: `/admin/chatbot/create`,
  },
])

const createLeadCRM = async (form: any) => {
  if (!companyId.value) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please select company', life: 3000 })
    return
  }
  form.company = companyId.value;
  const { statusCode }: any = await $api('admin/chat-bot', {
    method: 'POST',
    body: form,
  })

  if (statusCode === 200) {
    router.push('/admin/chatbot')
    toast.add({ severity: 'success', summary: 'Successfully', detail: 'Created', life: 3000 })
  }
}

const loadCompany = async (search?: string) => {
  const { result }: any = await $api('admin/company', {
    method: 'GET',
    params: {
      page: 1,
      limit: 30,
      search: search,
    },
  })
  companyOptions.value = result || []
}
loadCompany()

const updateSearch = (s: string) => {
  search.value = s
}
watchDebounced(
  () => search.value,
  (newValue) => {
    loadCompany(newValue)
  },
  { debounce: 400 },
)
</script>

<template>
  <div class="page">
    <div class="page-content">
      <BreadCrumbLinks :links="links" />

      <div class="box">
        <div class="page-heading mb-4">Create</div>

        <BaseInputSelect
          :label="t('common.company')"
          :options="companyOptions"
          name="companyId"
          option-label="name"
          option-value="_id"
          v-model="companyId"
          class="mb-4"
          @search="updateSearch"
          :rules="{ required: true }"
        />

        <FormChatbot :isAdmin="true" @onSubmit="createLeadCRM" @onCancel="router.push('/admin/chatbot')" />
      </div>
    </div>
  </div>
</template>
