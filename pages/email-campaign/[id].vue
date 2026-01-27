<script lang="ts" setup>
import useEmailCampaignService from '~/composables/controller/useEmailCampaignService'
import type { EmailCampaignDetailType, EmailCampaignEmailType, EmailActionType } from '~/types/email-campaign'

const route = useRoute()
const toast = useToast()
const { t } = useI18n()
const { getCampaignDetail, getCampaignEmails, addEmailToCampaign, deleteEmailFromCampaign, startCampaign } =
  useEmailCampaignService()

const id = route.params.id as string
const campaign = ref<EmailCampaignDetailType | null>(null)
const isLoading = ref(true)
const isEmailsLoading = ref(false)

const emailQuery = ref({
  page: 1,
  limit: 20,
  type: 'all' as EmailActionType,
  campaign_id: id,
})

const emailList = ref<EmailCampaignEmailType[]>([])
const totalEmails = ref(0)
const perPageEmails = ref(20)

const showAddEmailDialog = ref(false)
const newEmail = ref('')
const isAddingEmail = ref(false)

const fetchDetail = async () => {
  try {
    const { result }: any = await getCampaignDetail(id)
    campaign.value = result
  } catch (error) {
    console.error(error)
  }
}

const fetchEmails = async () => {
  isEmailsLoading.value = true
  try {
    const res: any = await getCampaignEmails(emailQuery.value)
    emailList.value = res.result || []
    totalEmails.value = res.total || (res.result?.length ? emailQuery.value.page * emailQuery.value.limit : 0) || 0
  } catch (error) {
    console.error(error)
  } finally {
    isEmailsLoading.value = false
  }
}

const onAddEmail = () => {
  newEmail.value = ''
  showAddEmailDialog.value = true
}

const submitAddEmail = async () => {
  if (!newEmail.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.value)) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Invalid email address', life: 3000 })
    return
  }

  isAddingEmail.value = true
  try {
    const { statusCode }: any = await addEmailToCampaign({ campaign_id: id, email: newEmail.value })
    if (statusCode === 200) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Email added', life: 3000 })
      newEmail.value = ''
      showAddEmailDialog.value = false
      fetchEmails()
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to add email', life: 3000 })
  } finally {
    isAddingEmail.value = false
  }
}

const onDeleteEmail = async (emailId: string) => {
  try {
    const { statusCode }: any = await deleteEmailFromCampaign(id, emailId)
    if (statusCode === 200) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Email removed', life: 3000 })
      fetchEmails()
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to remove email', life: 3000 })
  }
}

const changeEmailPage = (e: any) => {
  emailQuery.value.page = e.page + 1
  fetchEmails()
}

const onStart = async () => {
  try {
    const { statusCode }: any = await startCampaign(id)
    if (statusCode === 200) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Campaign started/resent', life: 3000 })
      fetchDetail()
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to start campaign', life: 3000 })
  }
}

onMounted(async () => {
  isLoading.value = true
  await Promise.all([fetchDetail(), fetchEmails()])
  isLoading.value = false
})

const expandedRows = ref([])

const actionOptions = [
  { label: 'All', value: 'all' },
  { label: 'Sent', value: 'sent' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Opened', value: 'open' },
  { label: 'Clicked', value: 'click' },
  { label: 'Bounced', value: 'bounced' },
  { label: 'Unsubscribed', value: 'unsubscribed' },
]

const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'pending':
      return 'secondary'
    case 'sending':
      return 'warn'
    case 'completed':
      return 'success'
    case 'failed':
      return 'danger'
    default:
      return 'info'
  }
}
</script>

<template>
  <div class="page p-4">
    <div v-if="!isLoading && campaign" class="fc gap-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="page-heading m-0">{{ campaign.name }}</h1>
          <Tag :value="campaign.status" :severity="getStatusSeverity(campaign.status)" />
        </div>
        <div class="flex gap-2 ai-c">
          <Button
            v-if="campaign.status === 'pending'"
            severity="success"
            size="small"
            @click="onStart"
            label="Start Campaign"
          >
          </Button>
          <nuxt-link :to="`/email-campaign/edit/${id}`">
            <Button severity="info" size="small" label="Edit Campaign"> </Button>
          </nuxt-link>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-6 gap-4">
        <div class="bg-white p-4 rounded shadow-sm fc ai-c jc-c">
          <span class="text-gray-500 text-sm">Total</span>
          <span class="text-2xl font-bold">{{ campaign.total }}</span>
        </div>
        <div class="bg-white p-4 rounded shadow-sm fc ai-c jc-c text-green-600">
          <span class="text-gray-500 text-sm">Success</span>
          <span class="text-2xl font-bold">{{ campaign.success }}</span>
        </div>
        <div class="bg-white p-4 rounded shadow-sm fc ai-c jc-c text-red-600">
          <span class="text-gray-500 text-sm">Failed</span>
          <span class="text-2xl font-bold">{{ campaign.failed }}</span>
        </div>
        <div class="bg-white p-4 rounded shadow-sm fc ai-c jc-c text-blue-600">
          <span class="text-gray-500 text-sm">Opened</span>
          <span class="text-2xl font-bold">{{ campaign.open }}</span>
        </div>
        <div class="bg-white p-4 rounded shadow-sm fc ai-c jc-c text-purple-600">
          <span class="text-gray-500 text-sm">Clicked</span>
          <span class="text-2xl font-bold">{{ campaign.click }}</span>
        </div>
        <div class="bg-white p-4 rounded shadow-sm fc ai-c jc-c text-orange-600">
          <span class="text-gray-500 text-sm">Unsubscribed</span>
          <span class="text-2xl font-bold">{{ campaign.unsubscribe }}</span>
        </div>
      </div>

      <!-- Email List Table -->
      <div class="bg-white p-4 rounded shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4">
            <h2 class="text-lg font-bold">Email List</h2>
            <SelectButton
              v-model="emailQuery.type"
              :options="actionOptions"
              option-label="label"
              option-value="value"
              @change="fetchEmails"
            />
          </div>
          <Button label="Add Email" icon="pi pi-plus" size="small" @click="onAddEmail" />
        </div>

        <DataTable
          v-model:expandedRows="expandedRows"
          :value="emailList"
          dataKey="_id"
          lazy
          paginator
          :rows="perPageEmails"
          :totalRecords="totalEmails"
          :loading="isEmailsLoading"
          @page="changeEmailPage"
        >
          <Column expander style="width: 3rem" />
          <Column field="email" header="Email"></Column>
          <Column field="status" header="Status" class="min-w-[150px]">
            <template #body="{ data }">
              <div class="flex flex-wrap gap-1">
                <Tag v-if="data.sent_at" value="Sent" severity="info" class="text-[10px]" />
                <Tag v-if="data.delivered_at" value="Delivered" severity="success" class="text-[10px]" />
                <Tag v-if="data.spam" value="Spam" severity="danger" class="text-[10px]" />
                <Tag v-if="data.unsubscribed" value="Unsubscribed" severity="secondary" class="text-[10px]" />
              </div>
            </template>
          </Column>

          <Column field="open" header="Opens" class="text-center">
            <template #body="{ data }">
              <span class="font-medium">{{ data.open || 0 }}</span>
            </template>
          </Column>

          <Column field="click" header="Clicks" class="text-center">
            <template #body="{ data }">
              <span class="font-medium">{{ data.click || 0 }}</span>
            </template>
          </Column>

          <Column field="sent_at" header="Sent At">
            <template #body="{ data }">
              <span class="text-sm text-gray-500">{{
                data.sent_at ? useMoment(data.sent_at, 'DD/MM/YYYY HH:mm') : '-'
              }}</span>
            </template>
          </Column>

          <Column field="delivered_at" header="Delivered At">
            <template #body="{ data }">
              <span class="text-sm text-gray-500">{{
                data.delivered_at ? useMoment(data.delivered_at, 'DD/MM/YYYY HH:mm') : '-'
              }}</span>
            </template>
          </Column>

          <Column field="bounced_at" header="Bounced At">
            <template #body="{ data }">
              <span class="text-sm text-gray-500">{{
                data.bounced_at ? useMoment(data.bounced_at, 'DD/MM/YYYY HH:mm') : '-'
              }}</span>
            </template>
          </Column>

          <template #expansion="{ data }">
            <div class="p-4 bg-gray-50 rounded-lg border">
              <h3 class="text-sm font-bold mb-3 flex items-center gap-2">
                <i class="pi pi-list text-primary"></i>
                Detailed Activity Log ({{ data.email }})
              </h3>
              <DataTable :value="data.actions" size="small" class="activity-table">
                <Column field="action" header="Action">
                  <template #body="slot">
                    <Tag
                      :value="slot.data.action.toUpperCase()"
                      :severity="slot.data.action === 'open' ? 'warning' : 'help'"
                    />
                  </template>
                </Column>
                <Column field="time" header="Time">
                  <template #body="slot">
                    <span class="text-xs">{{ useMoment(slot.data.time, 'DD/MM/YYYY HH:mm:ss') }}</span>
                  </template>
                </Column>
                <Column field="user_agent" header="User Agent">
                  <template #body="slot">
                    <span class="text-xs text-gray-400 break-all">{{ slot.data.user_agent }}</span>
                  </template>
                </Column>
              </DataTable>
            </div>
          </template>

          <Column header="Actions" style="width: 100px">
            <template #body="slotProps">
              <button @click="onDeleteEmail(slotProps.data._id)">
                <img src="~/assets/icons/i-trash-red-circle.svg" alt="" class="icon-lg" />
              </button>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
    <div v-else class="flex justify-center p-12">
      <ProgressSpinner />
    </div>

    <!-- Add Email Dialog -->
    <Dialog v-model:visible="showAddEmailDialog" header="Add Subscriber" :style="{ width: '400px' }" modal>
      <div class="fc gap-4 py-2">
        <label class="font-bold text-sm">Email Address</label>
        <BaseInputText
          name="email"
          v-model="newEmail"
          placeholder="e.g. user@example.com"
          @keyup.enter="submitAddEmail"
        />
      </div>
      <template #footer>
        <Button label="Cancel" severity="secondary" text @click="showAddEmailDialog = false" />
        <Button label="Add Email" :loading="isAddingEmail" @click="submitAddEmail" />
      </template>
    </Dialog>
  </div>
</template>
