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
const links = ref([
  {
    title: 'Chatbot',
    to: '/chatbot',
  },
  {
    title: 'Edit',
    to: `/chatbot/edit/${route.params.id}`,
  },
])
const getData = async () => {
  const { result }: any = await $api(`chat-bot/${route.params.id}`)
  info.value = result || {}
}

const editChatbot = async (form: any) => {
  const { statusCode }: any = await $api(`chat-bot/${route.params.id}`, {
    method: 'PUT',
    body: form,
  })

  if (statusCode) {
    router.push('/chatbot')
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

        <FormChatbot
          @onEdit="editChatbot"
          :isEdit="true"
          @onCancel="router.push('/chatbot')"
          :data="{
            ...info,
            assistant_id: info?.config_gpt?.assistant_id || '',
            api_key: info?.config_gpt?.api_key || '',
            organization: info?.config_gpt?.organization || '',
          }"
        />
      </div>
    </div>
  </div>
</template>
