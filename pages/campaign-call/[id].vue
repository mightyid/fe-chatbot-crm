<script lang="ts" setup>
import DialogExcelImport from '~/components/DialogExcelImport.vue'
const { $api, $dayjs: dayjs } = useNuxtApp()
const route = useRoute()
const { t } = useI18n()
const toast = useToast()
const confirm = useConfirm()

const id = route.params.id as string
const overview = ref({
  total_call: 0,
  total_duration: 0,
  total_price: 0,
})

const query = ref({
  page: 1,
  limit: 20,
  from: dayjs().startOf('month').toDate(),
  to: dayjs().toDate(),
  search: '',
})

const listCalls = ref([])
const totalRecords = ref(0)
const isLoading = ref(false)
const isMakingCall = ref(false)
const listChatbot = ref<any>([])

const formMakeCall = ref({
  bot_id: '',
  form_data: [{ name: '', phone: '', prefix: 'thầy' }],
})

const campaignInfo = ref<any>({})
const isShowImportExcel = ref(false)
const isShowPlayer = ref(false)
const currentRecording = ref<any>(null)

const optionsImportExcel = [
  { name: 'common.name', key: 'name' },
  { name: 'common.phone', key: 'phone' },
  { name: 'common.prefix', key: 'prefix' },
]

const requiredFieldImportExcel = [
  { name: 'common.name', key: 'name' },
  { name: 'common.phone', key: 'phone' },
]

const links = computed(() => [
  { title: t('common.campaign_call'), to: '/campaign-call' },
  { title: campaignInfo.value.name || t('common.details'), to: route.path },
])

const getDetail = async () => {
  const { result }: any = await $api(`campaign-call/${id}`, {
    method: 'GET',
  })
  campaignInfo.value = result || {}
}

const getOverview = async () => {
  const { result }: any = await $api(`campaign-call/${id}/overview`, {
    method: 'GET',
    params: {
      from: dayjs(query.value.from).format('YYYY-MM-DD'),
      to: dayjs(query.value.to).format('YYYY-MM-DD'),
    },
  })
  overview.value = result || { total_call: 0, total_duration: 0, total_price: 0 }
}

const getCalls = async () => {
  isLoading.value = true
  const { result, total }: any = await $api(`campaign-call/${id}/call`, {
    method: 'GET',
    params: {
      ...query.value,
      from: dayjs(query.value.from).format('YYYY-MM-DD'),
      to: dayjs(query.value.to).format('YYYY-MM-DD'),
    },
  })
  listCalls.value = result || []
  totalRecords.value = total || 0
  isLoading.value = false
}

const getListBot = async () => {
  const { result }: any = await $api('chat-bot', {
    method: 'GET',
  })
  listChatbot.value = result || []
}

const init = async () => {
  await Promise.all([getDetail(), getOverview(), getCalls(), getListBot()])
}
init()

const onFilter = () => {
  query.value.page = 1
  getOverview()
  getCalls()
}

const changePage = (e: any) => {
  query.value.limit = e.rows
  query.value.page = e.page + 1
  getCalls()
}

const formatPhone = (phone: string) => {
  let p = String(phone || '')
    .replace(/\s/g, '')
    .replace(/[^\d]/g, '')
  if (p.startsWith('0')) {
    p = '84' + p.substring(1)
  }
  return p
}

const addRow = () => {
  formMakeCall.value.form_data.push({ name: '', phone: '', prefix: 'thầy' })
}

const removeRow = (index: number) => {
  formMakeCall.value.form_data.splice(index, 1)
}

const onImportExcel = (data: any[]) => {
  const formattedData = data.map((item) => ({
    name: item.name || '',
    phone: formatPhone(item.phone),
    prefix: item.prefix || 'thầy',
  }))
  formMakeCall.value.form_data = [...formMakeCall.value.form_data, ...formattedData].filter(
    (item) => item.name || item.phone,
  )
  if (formMakeCall.value.form_data.length === 0) {
    formMakeCall.value.form_data = [{ name: '', phone: '', prefix: 'thầy' }]
  }
  isShowImportExcel.value = false
}

const handleMakeCall = async () => {
  if (!formMakeCall.value.bot_id) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: t('common.chatbot_required'), life: 3000 })
    return
  }

  const validData = formMakeCall.value.form_data.filter((item) => item.name && item.phone)
  if (validData.length === 0) {
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('common.data_required'),
      life: 3000,
    })
    return
  }

  confirm.require({
    message: t('common.confirm_make_call_msg'),
    header: t('common.confirm_make_call'),
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: t('button.yes'),
    rejectLabel: t('button.no'),
    accept: async () => {
      try {
        isMakingCall.value = true
        const { statusCode }: any = await $api(`campaign-call/${id}/call`, {
          method: 'POST',
          body: {
            bot_id: formMakeCall.value.bot_id,
            campaign_call_id: id,
            form_data: validData,
          },
        })
        if (statusCode === 200) {
          toast.add({
            severity: 'success',
            summary: t('common.success'),
            detail: t('common.call_initiated'),
            life: 3000,
          })
          getCalls()
          getOverview()
          formMakeCall.value.form_data = [{ name: '', phone: '', prefix: 'thầy' }]
        }
      } catch (error) {
        console.error(error)
      } finally {
        isMakingCall.value = false
      }
    },
  })
}

const openPlayer = (data: any) => {
  currentRecording.value = data
  isShowPlayer.value = true
}

watchDebounced(
  () => query.value.search,
  () => {
    query.value.page = 1
    getCalls()
  },
  { debounce: 600 },
)
</script>

<template>
  <div class="page">
    <div class="page-content">
      <BreadCrumbLinks :links="links" />

      <!-- Header & Stats -->
      <div class="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-100">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="bg-primary-50 p-3 rounded-xl">
              <img src="~/assets/icons/i-loudspeaker.svg" class="w-8 h-8" alt="" />
            </div>
            <div>
              <h1 class="text-2xl font-bold c-black-90 m-0 leading-tight">{{ campaignInfo.name }}</h1>
              <!-- <p class="text-gray-500 text-sm mt-1 m-0">{{ campaignInfo.instruction || t('common.no_instruction') }}</p> -->
            </div>
          </div>

          <div class="flex items-center gap-4 no-wrap">
            <div class="stats-item px-4 border-r border-gray-100 last:border-0">
              <span class="text-xs text-gray-500 uppercase font-bold tracking-wider">{{ t('common.total_call') }}</span>
              <div class="text-2xl font-bold c-primary">{{ overview.total_call }}</div>
            </div>
            <div class="stats-item px-4 border-r border-gray-100 last:border-0">
              <span class="text-xs text-gray-500 uppercase font-bold tracking-wider">{{
                t('common.total_duration')
              }}</span>
              <div class="text-2xl font-bold c-blue-600">{{ overview.total_duration }}s</div>
            </div>
            <div class="stats-item px-4">
              <span class="text-xs text-gray-500 uppercase font-bold tracking-wider"
                >{{ t('common.total_price') }}
              </span>
              <div class="text-2xl font-bold c-green-600">
                {{ formatCurrency(Math.abs(overview.total_price), 'it-IT', 'USD') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <!-- Make Call Management (Inline) -->
        <div class="xl:col-span-5 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div class="flex items-center gap-2">
              <div class="fc">
                <h3 class="text-lg font-bold c-black-90 m-0">{{ t('common.make_call') }}</h3>
                <span class="text-[10px] text-gray-400 font-medium italic mt-0.5">{{
                  t('common.phone_format_hint')
                }}</span>
              </div>
            </div>
            <div class="flex gap-2">
              <Button
                severity="secondary"
                outlined
                size="small"
                @click="isShowImportExcel = true"
                class="!p-2 h-auto"
                v-tooltip.top="t('button.import_excel')"
              >
                <template #icon>
                  <img src="~/assets/icons/i-import.svg" class="w-4 h-4" alt="" />
                </template>
              </Button>
              <Button
                severity="primary"
                outlined
                size="small"
                @click="addRow"
                class="!p-2 h-auto"
                v-tooltip.top="t('button.add_new')"
              >
                <template #icon>
                  <img src="~/assets/icons/i-plus-primary.svg" class="w-4 h-4" alt="" />
                </template>
              </Button>
            </div>
          </div>

          <div class="p-4 fc gap-4">
            <div class="fc gap-1">
              <label class="text-xs font-bold text-gray-500 uppercase">
                {{ t('common.select') }} Chatbot <span class="c-danger">*</span>
              </label>
              <BaseInputSelect
                :options="listChatbot"
                optionLabel="name"
                optionValue="_id"
                v-model="formMakeCall.bot_id"
                :placeholder="t('common.select') + ' BOT'"
                :filterDefault="true"
                :showClearDefault="true"
              />
            </div>

            <div class="border rounded-lg overflow-hidden border-gray-100 bg-white">
              <DataTable
                :value="formMakeCall.form_data"
                responsiveLayout="scroll"
                scrollable
                scrollHeight="400px"
                class="p-datatable-sm"
              >
                <Column header="#" style="width: 40px" class="bg-gray-50/30">
                  <template #body="slotProps">
                    <span class="text-xs text-gray-400">{{ slotProps.index + 1 }}</span>
                  </template>
                </Column>
                <Column :header="t('common.prefix')" style="width: 80px">
                  <template #body="slotProps">
                    <InputText v-model="slotProps.data.prefix" class="text-xs p-inputtext-sm w-full" />
                  </template>
                </Column>
                <Column :header="t('common.name')">
                  <template #body="slotProps">
                    <InputText v-model="slotProps.data.name" class="text-xs p-inputtext-sm w-full" />
                  </template>
                </Column>
                <Column :header="t('common.phone')">
                  <template #body="slotProps">
                    <InputText v-model="slotProps.data.phone" class="text-xs p-inputtext-sm w-full" />
                  </template>
                </Column>
                <Column style="width: 40px" align="center" class="bg-gray-50/30">
                  <template #body="slotProps">
                    <button
                      v-if="formMakeCall.form_data.length > 1"
                      @click="removeRow(slotProps.index)"
                      class="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <img src="~/assets/icons/i-trash-circle.svg" class="icon" alt="" />
                    </button>
                  </template>
                </Column>
              </DataTable>
            </div>

            <Button severity="primary" :loading="isMakingCall" @click="handleMakeCall">
              <!-- <template #icon>
                <img src="~/assets/icons/i-send-white.svg" class="w-5 h-5 mr-2" alt="" />
              </template> -->
              {{ t('common.make_call') }}
            </Button>
          </div>
        </div>

        <!-- Activity History -->
        <div class="xl:col-span-7 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div
            class="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50"
          >
            <div class="flex items-center gap-2">
              <img src="~/assets/icons/i-clock.svg" class="icon" alt="" />
              <h3 class="text-lg font-bold c-black-90 m-0">{{ t('common.call_history') }}</h3>
            </div>

            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-gray-400 uppercase">{{ t('common.from') }}</span>
                <Calendar
                  v-model="query.from"
                  dateFormat="yy-mm-dd"
                  class="tiny-calendar"
                  @update:modelValue="onFilter"
                />
              </div>
              <div class="flex items-center gap-2 border-l border-gray-200 pl-3">
                <span class="text-xs font-bold text-gray-400 uppercase">{{ t('common.to') }}</span>
                <Calendar
                  v-model="query.to"
                  dateFormat="yy-mm-dd"
                  class="tiny-calendar"
                  @update:modelValue="onFilter"
                />
              </div>
              <!-- <div class="border-l border-gray-200 pl-3">
                <InputSearch v-model="query.search" class="w-[180px] h-[32px]" />
              </div> -->
            </div>
          </div>

          <DataTable
            :value="listCalls"
            dataKey="_id"
            rowHover
            lazy
            :loading="isLoading"
            paginator
            :rows="query.limit"
            :totalRecords="totalRecords"
            RowsPerPageDropdown
            :rowsPerPageOptions="[20, 50, 100]"
            @page="changePage"
            class="text-sm p-datatable-sm"
          >
            <Column header="#" style="width: 50px">
              <template #body="slotProps">
                <span class="text-xs text-gray-500">{{ (query.page - 1) * query.limit + slotProps.index + 1 }}</span>
              </template>
            </Column>
            <Column :header="t('common.name')" font-medium>
              <template #body="slotProps">
                <div class="font-medium c-black-90">
                  {{ slotProps.data.lead?.name || slotProps.data.name || '---' }}
                </div>
              </template>
            </Column>
            <Column :header="t('common.phone')">
              <template #body="slotProps">
                {{
                  slotProps.data.lead?.phone ||
                  slotProps.data.phone ||
                  (typeof slotProps.data.lead === 'string' ? slotProps.data.lead : '---')
                }}
              </template>
            </Column>
            <Column field="status" :header="t('common.status')" align="center" style="min-width: 120px">
              <template #body="slotProps">
                <span
                  v-if="slotProps.data.status"
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  :class="{
                    'bg-green-50 text-green-600': slotProps.data.status === 'completed',
                    'bg-red-50 text-red-600': slotProps.data.status === 'no-answer',
                    'bg-orange-50 text-orange-600': slotProps.data.status === 'busy',
                    'bg-blue-50 text-blue-600': slotProps.data.status === 'ringing',
                  }"
                >
                  {{ t(`common.${slotProps.data.status}`) }}
                </span>
                <span v-else>---</span>
              </template>
            </Column>
            <Column field="duration" :header="t('common.total_duration')" align="center">
              <template #body="slotProps">
                <span class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {{ slotProps.data.duration }}s
                </span>
              </template>
            </Column>
            <Column field="price" :header="t('common.total_price')" align="right">
              <template #body="slotProps">
                <span class="font-bold" :class="slotProps.data.price < 0 ? 'c-danger' : 'c-green-600'">
                  {{ formatCurrency(Math.abs(slotProps.data.price), 'it-IT', slotProps.data.price_unit || 'USD') }}
                </span>
              </template>
            </Column>
            <Column field="media_url" :header="t('common.recording')" align="center" style="width: 60px">
              <template #body="{ data }">
                <button
                  v-if="data.media_url"
                  @click="openPlayer(data)"
                  class="flex jc-c w-full h-full items-center justify-center"
                >
                  <img
                    src="~/assets/icons/i-eye-secondary-circle.svg"
                    class="icon-lg"
                    alt=""
                    v-tooltip.top="t('common.view')"
                  />
                </button>
              </template>
            </Column>
            <Column field="created_at" :header="t('common.created_at')" align="right" style="min-width: 150px">
              <template #body="slotProps">
                <span class="text-xs text-gray-500 font-medium">{{ useMoment(slotProps.data.created_at) }}</span>
              </template>
            </Column>
            <template #empty>
              <div class="py-8">
                <NoData />
              </div>
            </template>
          </DataTable>
        </div>
      </div>
    </div>

    <!-- Excel Import Dialog -->
    <DialogExcelImport
      :visible="isShowImportExcel"
      title="Import Recipients"
      :optionsImportExcel="optionsImportExcel"
      :requiredFieldImportExcel="requiredFieldImportExcel"
      @onClose="isShowImportExcel = false"
      @onImport="onImportExcel"
    />

    <!-- Audio Player Dialog -->
    <Dialog
      v-model:visible="isShowPlayer"
      modal
      :header="t('common.recording') + ': ' + (currentRecording?.name || currentRecording?.phone || '')"
      :style="{ width: '400px' }"
      class="rounded-xl overflow-hidden"
    >
      <div class="fc gap-4 py-2">
        <audio v-if="currentRecording?.media_url" controls autoplay class="w-full h-12">
          <source :src="currentRecording.media_url" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <div v-else class="text-center py-4 text-gray-500">
          {{ t('common.no_data') }}
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style lang="scss" scoped>
.tiny-calendar {
  width: 110px;
  :deep(.p-inputtext) {
    padding: 4px 8px;
    font-size: 11px;
    font-weight: bold;
    color: #4b5563;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    text-align: center;
  }
}

:deep(.p-datatable) {
  .p-datatable-header {
    background: transparent;
    border: none;
    padding: 0;
  }
  .p-column-title {
    font-size: 11px;
    text-transform: uppercase;
    color: #9ca3af;
    letter-spacing: 0.05em;
    font-weight: 800;
  }
  .p-datatable-thead > tr > th {
    background: #f9fafb;
    border-bottom: 2px solid #f3f4f6;
    padding: 10px 12px;
  }
  .p-datatable-tbody > tr > td {
    padding: 10px 12px;
    border-bottom: 1px solid #f3f4f6;
  }
}

.stats-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

:deep(.p-inputtext-sm) {
  padding: 0.4rem 0.6rem;
}

:deep(.p-dropdown-label) {
  font-size: 12px;
  padding: 0.4rem 0.6rem;
}
</style>
