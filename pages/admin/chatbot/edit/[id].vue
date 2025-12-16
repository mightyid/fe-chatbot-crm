<script setup lang="ts">
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
const { t } = useI18n()
const links = ref([
  {
    title: 'Chatbot',
    to: '/admin/chatbot',
  },
  {
    title: 'Edit',
    to: `/admin/chatbot/edit/${route.params.id}`,
  },
])
const getData = async () => {
  const { result }: any = await $api(`admin/chat-bot/${route.params.id}`)
  info.value = result || {}
}

const editChatbot = async (form: any) => {
  const { statusCode }: any = await $api(`admin/chat-bot/${route.params.id}`, {
    method: 'PUT',
    body: form,
  })

  if (statusCode) {
    router.push('admin/chatbot')
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
        <div class="page-heading mb-4"> {{ t('button.edit') }} Bot</div>

        <FormChatbot
          @onEdit="editChatbot"
          :isEdit="true"
          :isAdmin="true"
          @onCancel="router.push('/admin/chatbot')"
          :data="{
            ...info,
            api_key: info?.config_gpt?.api_key || '',
            organization: info?.config_gpt?.organization || '',
            vector_store_id: info?.config_gpt?.vector_store_id || '',
            instruction: info?.config_gpt?.instruction || '',
            top_p: info?.config_gpt?.top_p || 0.7,
            temperature: info?.config_gpt?.temperature || 1.5,
            functions: info?.config_gpt?.functions || {},
            model: info?.config_gpt?.model || '',
          }"
        />
      </div>
    </div>
  </div>
</template>
