<script setup lang="ts">
import TabStatusCRM from '~/components/crm/TabStatusCRM.vue'
import DrawerLabelManagement from '~/components/crm/DrawerLabelManagement.vue'
import DrawerColumnManagement from '~/components/crm/DrawerColumnManagement.vue'
import FormAssignNote from '~/components/crm/FormAssignNote.vue'
import ImportExcel from '~/components/crm/ImportExcel.vue'
import FormIframe from '~/components/crm/FormIframe.vue'
definePageMeta({
  permission: 'manager_application',
})

const confirm = useConfirm()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const applications = ref<any>([])
const isShowNote = ref(false)
const isShowIframe = ref(false)
const menuSetting = ref()
const isShowDrawerLabel = ref(false)
const { user } = useAuth()
const isShowDrawerColumn = ref(false)
const isShowImportExcel = ref(false)
const { t } = useI18n()
const { $dayjs: dayjs, $api } = useNuxtApp()
const columns = ref<any>([])
const labels = ref<any>([])
const query = ref({
  page: Number(route.query?.page) || 1,
  search: (route.query?.search as string) || '',
  //   label_id: (route.query?.label_id as string) || null,
  //   filterBy: (route.query?.filterBy as string) || null,
  //   from: (route.query.from as string) || null,
  //   to: (route.query.to as string) || null,
  //   iframe_id: (route.query.iframe_id as string) || null,
  limit: 20,
})
const perPage = ref(20)
const totalRecords = ref(0)

const isLoading = ref(false)
const selectedApplications = ref<any>([])
const linkReferral = computed(() => {
  return `${window.location.origin}/bot/${user.value.bot._id}?iframe_id=${user.value?.iframe?._id}&referral_id=${user.value?._id}`
})
const firstIndexPage = computed(() => {
  return query.value.page > 1 ? (query.value.page - 1) * perPage.value + 1 : 1
})
const json_fields = ref({})
const json_data = ref([])
const json_meta = [
  [
    {
      key: 'charset',
      value: 'utf-8',
    },
  ],
]
const getDataColumn = async () => {
  const { result }: any = await $api(`referral/crm-field`, {
    method: 'GET',
  })
  columns.value = result || []
  let fields = {
    Name: 'name',
    Campaign: 'campaign',
    Label: 'label',
  }
  result.forEach((el: any) => {
    //@ts-ignore
    fields[el.label] = el.key
  })
  json_fields.value = fields
  getData()
}
const getDataLabel = async () => {
  const { result }: any = await $api(`referral/crm-label`, {
    method: 'GET',
  })
  labels.value = result || []
  // getData()
}
const closeDialogIFrame = () => {
  isShowIframe.value = false
}

const getData = async () => {
  isLoading.value = true

  const { loading, result, total_pages, total }: any = await $api('referral/leads', {
    method: 'GET',
    params: {
      ...query.value,
      //   status: query.value.label_id == 'all' ? undefined : query.value?.label_id,
      //   from: query.value.from ? dayjs(query.value.from).format('YYYY-MM-DD 00:00:01') : undefined,
      //   to: query.value.to ? dayjs(query.value.to).format('YYYY-MM-DD 23:59:59') : undefined,
    },
  })
  applications.value = result.leads || []
  totalRecords.value = total_pages * perPage.value || 0
  let datas = [] as any
  result.leads.forEach((item: any) => {
    if (item?.data) {
      let obj = {
        name: item?.name || '',
        campaign: item?.iframe?.name || '',
        label: item?.label?.name || '',
      }
      Object.keys(item?.data).forEach((key: any) => {
        //@ts-ignore
        obj[key] = item?.data[key].value
      })
      datas.push(obj)
    }
  })
  json_data.value = datas
  useQueryURL(query.value)

  isLoading.value = false
}
getData()

const numberBadge = computed(() => {
  let count = 0
  // if (query.value.label_id) {
  //   count += 1
  // }
  //   if (query.value.from) {
  //     count += 1
  //   }
  //   if (query.value.to) {
  //     count += 1
  //   }
  //   if (query.value.iframe_id) {
  //     count += 1
  //   }
  return count
})
getDataColumn()
getDataLabel()

const changePage = (e: any) => {
  // console.log(e, 'e')
  query.value.limit = e.rows
  perPage.value = e.rows
  query.value.page = e.page + 1
  getData()
}

const clearAll = () => {
  query.value = {
    page: 1,
    search: '',
    // label_id: null,
    // filterBy: null,
    // from: null,
    // to: null,
    // iframe_id: '',
    limit: 20,
  }
  getData()
}

const cancelSelected = () => {
  selectedApplications.value = {}
}

const confirmDelete = (record: any) => {
  confirm.require({
    message: t('common.confirm_delete'),
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: t('common.cancel'),
    acceptLabel: t('common.delete'),
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      const { statusCode }: any = await $api(`lead/${record._id}`, {
        method: 'DELETE',
      })
      if (statusCode === 200) {
        getData()
        toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully', life: 3000 })
      }
    },
    reject: () => {
      // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
    },
  })
}

const importExcel = async (obj: any) => {
  const { statusCode } = await $api<any>(`lead/create-many`, {
    method: 'POST',
    body: {
      data: obj.data,
      label_id: obj.label_id,
    },
  })
  if (statusCode === 200) {
    toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully', life: 3000 })
    getData()
    isShowImportExcel.value = false
  }
}
const copyLinkReferral = (link: any) => {
  navigator.clipboard.writeText(linkReferral.value)
  toast.add({ severity: 'success', summary: 'Notifications', detail: 'Copied', life: 3000 })
}

watchDebounced(
  () => query.value.search,
  (newValue) => {
    query.value.page = 1
    getData()
  },
  { debounce: 600, maxWait: 3000 },
)
</script>

<template>
  <div class="page">
    <div class="page-content">
      <div class="flex items-center justify-between gap-4">
        <h1 class="page-heading m-0">Leads CRM</h1>
        <div class="flex-1 flex items-center justify-end gap-4">
          <InputSearch class="w-[300px]" v-model="query.search" />
          <!-- <ButtonFilter @onClearAll="clearAll" @onApply="getData" :numberBadge="numberBadge">
            <template v-slot="slotProps">
              <BaseInputSelect
                :label="t('common.campaign')"
                :options="listIframe"
                name="iframe_id"
                :filter="true"
                option-label="name"
                option-value="_id"
                v-model="query.iframe_id"
              />
              <div class="fr gap-2 mt-4 jc-fe">
                <Button :label="t('button.clear')" severity="secondary" @click="clearAll" />
                <Button :label="t('button.apply')" severity="primary" @click="getData" />
              </div>
            </template>
          </ButtonFilter> -->

          <Button size="small" label="Get link referral" @click="isShowIframe = true"> </Button>
        </div>
      </div>

      <DataTable
        class="mt-4"
        :value="applications"
        dataKey="_id"
        rowHover
        lazy
        scrollable
        paginator
        :first="firstIndexPage"
        :totalRecords="totalRecords"
        :rows="perPage"
        :loading="isLoading"
        v-model:selection="selectedApplications"
        RowsPerPageDropdown
        scroll-height="calc(100vh - 270px)"
        :rowsPerPageOptions="[20, 50, 100, 500, 1000]"
        @page="changePage"
      >
        <!-- <Column selectionMode="multiple" headerStyle="width: 3rem" :frozen="true" alignFrozen="left"></Column> -->
        <Column header="#" :frozen="true" alignFrozen="left">
          <template #body="slotProps">
            <div class="c-primary fr ai-c gap-2">
              {{ slotProps.index + firstIndexPage }}
              <TagIcon :color="slotProps.data?.label?.color" v-if="slotProps.data?.label" />
            </div>
          </template>
        </Column>
        <Column :header="t('common.name')" :frozen="true" alignFrozen="left" style="max-width: 300px; min-width: 300px">
          <template #body="slotProps">
            <div class="flex items-center gap-1 cursor-pointer">
              <span class="text-base font-normal">
                {{ slotProps.data.name }}
              </span>
            </div>
          </template>
        </Column>
        <Column header="Campaign" style="min-width: 200px">
          <template #body="slotProps">
            <div class="flex items-center gap-1 cursor-pointer" v-if="slotProps.data?.iframe?._id">
              <span class="text-base font-normal">
                {{ slotProps.data?.iframe?.name }}
              </span>
            </div>
          </template>
        </Column>

        <Column
          :field="column.field_profile"
          :header="column.label"
          :frozen="column.is_fixed"
          v-for="(column,index) in columns?.filter((el:any)=> el.is_active)"
          :key="column._id"
          :style="{
            minWidth: `${column.width}px`,
            width: `${column.width}px`,
          }"
        >
          <template #body="slotProps">
            <div
              class="flex items-center gap-1 cursor-pointer"
              :style="{
                minWidth: `${column.width}px`,
              }"
            >
              <span class="text-base font-normal c-black-90">
                {{
                  slotProps.data?.data && slotProps.data?.data[column.key]
                    ? slotProps.data?.data[column.key]?.value
                    : ''
                }}
              </span>
              <!-- <img src="~/assets/icons/i-link-green.svg" alt=""> -->
            </div>
          </template>
        </Column>
        <Column style="min-width: 200px" field="created_at" :header="t('common.created_at')">
          <template #body="slotProps">
            {{ useMoment(slotProps.data.created_at) }}
          </template>
        </Column>

        <Column :header="t('common.actions')" :frozen="true" alignFrozen="right">
          <template #body="slotProps">
            <div class="flex gap-2 jc-fe">
              <!-- <nuxt-link :to="`/crm/edit/${slotProps.data._id}`">
                <img class="icon-lg" src="~/assets/icons/i-pen-circle.svg" alt="" v-tooltip.top="'Edit'" />
              </nuxt-link>
              <button @click="confirmDelete(slotProps.data)">
                <img class="icon-lg" src="~/assets/icons/i-trash-circle.svg" alt="" v-tooltip.top="'Delete'" />
              </button> -->
            </div>
          </template>
        </Column>

        <template #empty>
          <NoData />
        </template>
      </DataTable>

      <!-- Iframe -->
      <BaseDialog :visible="isShowIframe" title="Link Referral" @onClose="closeDialogIFrame">
        <div class="fc jc-c ai-c gap-4">
          <div class="text-base">
            {{ linkReferral }}
          </div>
          <QrCode :value="linkReferral" />
        </div>
        <div class="fr jc-fe gap-4">
          <Button label="Close" severity="secondary" @click="closeDialogIFrame" />
          <Button label="Copy Link" severity="primary" @click="copyLinkReferral" />
        </div>
      </BaseDialog>

      <DrawerColumnManagement v-model:isShowDrawerColumn="isShowDrawerColumn" @onChange="getDataColumn" />
      <DrawerLabelManagement v-model:isShowDrawerLabel="isShowDrawerLabel" @onChange="getDataLabel" />
      <BaseDialog :visible="isShowImportExcel" title="Import Excel" @onClose="isShowImportExcel = false" width="960px">
        <ImportExcel :columns="columns" @on-cancel="isShowImportExcel = false" @on-submit="importExcel" />
      </BaseDialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ck-content) {
  min-height: 100px;
}
:deep(.p-column-title) {
  white-space: nowrap;
}
</style>
