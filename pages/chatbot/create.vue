<script setup lang="ts">
import FormChatbot from '~/components/chatbot/FormChatbot.vue'
definePageMeta({
  //   permission: 'create_leadCRM',
})
const router = useRouter()
const toast = useToast()
const { $api } = useNuxtApp()
const { t } = useI18n()
const links = ref([
  {
    title: 'Chatbot',
    to: '/chatbot',
  },
  {
    title: t('button.create'),
    to: `/chatbot/create`,
  },
])

const createLeadCRM = async (form: any) => {
  const { statusCode }: any = await $api('chat-bot', {
    method: 'POST',
    body: form,
  })

  if (statusCode === 200) {
    router.push('/chatbot')
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

        <FormChatbot @onSubmit="createLeadCRM" @onCancel="router.push('/crm')" />
      </div>
    </div>
  </div>
</template>
