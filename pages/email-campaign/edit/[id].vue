<script lang="ts" setup>
import useEmailCampaignService from '~/composables/controller/useEmailCampaignService'
import useEmailTemplateService from '~/composables/controller/useEmailTemplateService'
import type { EmailTemplateType } from '~/types/email-campaign'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { getCampaignDetail, updateCampaign } = useEmailCampaignService()
const { getTemplates } = useEmailTemplateService()

const id = route.params.id as string
const form = ref({
  name: '',
  subject: '',
  template_id: '',
})

const isLoading = ref(false)
const isFetching = ref(true)
const templates = ref<EmailTemplateType[]>([])

const fetchInitialData = async () => {
  try {
    const [campaignRes, templatesRes]: any = await Promise.all([
      getCampaignDetail(id),
      getTemplates({ page: 1, limit: 100 }),
    ])

    if (campaignRes.result) {
      form.value.name = campaignRes.result.name || ''
      form.value.subject = campaignRes.result.subject || campaignRes.result.name || ''
      form.value.template_id = campaignRes.result.template || campaignRes.result.template_id || ''
    }

    templates.value = templatesRes.result || []
  } catch (error) {
    console.error(error)
  } finally {
    isFetching.value = false
  }
}

const onUpdate = async () => {
  if (!form.value.name) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Campaign name is required', life: 3000 })
    return
  }
  if (!form.value.subject) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Subject is required', life: 3000 })
    return
  }
  if (!form.value.template_id) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please select a template', life: 3000 })
    return
  }

  isLoading.value = true
  try {
    const { statusCode }: any = await updateCampaign({
      campaign_id: id,
      name: form.value.name,
      subject: form.value.subject,
      template: form.value.template_id,
    })

    if (statusCode === 200) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Campaign updated', life: 3000 })
      router.push(`/email-campaign/${id}`)
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update campaign', life: 3000 })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchInitialData()
})
</script>

<template>
  <div class="page p-4">
    <div class="flex items-center gap-4 mb-6">
      <h1 class="page-heading m-0">Edit Campaign Content</h1>
    </div>

    <div v-if="!isFetching" class="bg-white p-6 rounded shadow-sm max-w-2xl mx-auto">
      <div class="fc gap-6">
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

        <div class="flex justify-end gap-3 mt-4">
          <Button label="Cancel" severity="secondary" @click="router.back()" />
          <Button label="Save" :loading="isLoading" @click="onUpdate" />
        </div>
      </div>
    </div>
    <div v-else class="flex justify-center p-12">
      <ProgressSpinner />
    </div>
  </div>
</template>
