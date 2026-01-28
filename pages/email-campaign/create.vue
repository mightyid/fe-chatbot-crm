<script lang="ts" setup>
import useEmailCampaignService from '~/composables/controller/useEmailCampaignService'
import useEmailTemplateService from '~/composables/controller/useEmailTemplateService'
import type { EmailTemplateType } from '~/types/email-campaign'

const router = useRouter()
const toast = useToast()
const { createCampaign } = useEmailCampaignService()
const { getTemplates } = useEmailTemplateService()

const form = ref({
  name: '',
  subject: '',
  template_id: '',
  emails_raw: '',
})

const templates = ref<EmailTemplateType[]>([])
const isLoading = ref(false)
const isFetching = ref(true)

const fetchTemplates = async () => {
  try {
    const { result }: any = await getTemplates({ page: 1, limit: 100 })
    templates.value = result || []
  } catch (error) {
    console.error(error)
  } finally {
    isFetching.value = false
  }
}

const onSave = async () => {
  if (!form.value.name.trim()) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Campaign name is required', life: 3000 })
    return
  }

  if (!form.value.subject.trim()) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Email subject is required', life: 3000 })
    return
  }

  if (!form.value.template_id) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please select an email template', life: 3000 })
    return
  }

  const emails = form.value.emails_raw
    .split(/[\n,]/)
    .map((e) => e.trim())
    .filter((e) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))

  if (emails.length === 0) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'At least one valid email is required', life: 3000 })
    return
  }

  isLoading.value = true
  try {
    const { statusCode }: any = await createCampaign({
      name: form.value.name,
      subject: form.value.subject,
      template: form.value.template_id,
      emails: emails,
    })

    if (statusCode === 200) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Campaign created', life: 3000 })
      router.push('/email-campaign')
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create campaign', life: 3000 })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTemplates()
})
</script>

<template>
  <div class="page p-4">
    <div class="flex items-center gap-4 mb-6">
      <h1 class="page-heading m-0">Create Email Campaign</h1>
    </div>

    <div class="bg-white p-6 rounded shadow-sm max-w-2xl mx-auto">
      <div v-if="!isFetching" class="fc gap-6">
        <div class="fc gap-2">
          <label class="font-medium">Campaign Name <span class="text-red-500">*</span></label>
          <InputText v-model="form.name" placeholder="Enter campaign name" />
        </div>

        <div class="fc gap-2">
          <label class="font-medium">Email Subject <span class="text-red-500">*</span></label>
          <InputText v-model="form.subject" placeholder="Enter email subject" />
        </div>

        <div class="fc gap-2">
          <label class="font-medium">Select Template <span class="text-red-500">*</span></label>
          <Dropdown
            v-model="form.template_id"
            :options="templates"
            option-label="name"
            option-value="_id"
            placeholder="Select a template"
            class="w-full"
          />
          <div v-if="templates.length === 0" class="mt-1 text-sm text-gray-400">
            No templates found.
            <nuxt-link to="/email-campaign-template/create" class="text-blue-500 hover:underline">Create one</nuxt-link>
          </div>
        </div>

        <div class="fc gap-2">
          <label class="font-medium">Email List <span class="text-red-500">*</span></label>
          <Textarea v-model="form.emails_raw" rows="8" placeholder="Enter emails, separated by comma or new line" />
          <small class="text-gray-500 italic">Example: user@example.com, test@example.com</small>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <Button label="Cancel" severity="secondary" @click="router.back()" />
          <Button label="Create Campaign" :loading="isLoading" @click="onSave" />
        </div>
      </div>
      <div v-else class="flex justify-center p-8">
        <ProgressSpinner />
      </div>
    </div>
  </div>
</template>
