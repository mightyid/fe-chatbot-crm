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

const appStore = useAppStore()
const confirm = useConfirm()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const applications = ref<any>([])
const isShowNote = ref(false)
const isShowIframe = ref(false)
const menuSetting = ref()
const isShowDrawerLabel = ref(false)
const isShowDrawerColumn = ref(false)
const isShowImportExcel = ref(false)
const { $dayjs: dayjs, $api } = useNuxtApp()
const columns = ref<any>([])
const labels = ref<any>([])
const listIframe = ref<any>([])
const formNote = ref<any>({
  _id: '',
  content: '',
})

const iframe = ref('')
const query = ref({
  page: Number(route.query?.page) || 1,
  search: (route.query?.search as string) || '',
  label_id: (route.query?.label_id as string) || null,
  filterBy: (route.query?.filterBy as string) || null,
  from: (route.query.from as string) || null,
  to: (route.query.to as string) || null,
  iframe_id: (route.query.iframe_id as string) || null,
  limit: 20,
})
const perPage = ref(20)
const totalRecords = ref(0)
const editorNoteConfig = ref({
  removePlugins: ['Image'],
  placeholder: 'Enter',
  toolbar: {
    items: [
      'undo',
      'redo',
      '|',
      'heading',
      '|',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'bold',
      'italic',
      'strikethrough',
      '|',
      'link',
      'blockQuote',
      '|',
      'bulletedList',
      'numberedList',
    ],
    shouldNotGroupWhenFull: false,
  },
})
const isLoading = ref(false)
const selectedApplications = ref<any>([])
const numberApplicationStatus = ref({})
const firstIndexPage = computed(() => {
  return query.value.page > 1 ? (query.value.page - 1) * perPage.value + 1 : 1
})

const getDataColumn = async () => {
  const { result }: any = await $api(`crm-field`, {
    method: 'GET',
  })
  columns.value = result || []
  getData()
}
const getDataLabel = async () => {
  const { result }: any = await $api(`crm-label`, {
    method: 'GET',
  })
  labels.value = result || []
  // getData()
}
const closeDialogIFrame = () => {
  isShowIframe.value = false
}

const getListIframe = async () => {
  const { result }: any = await $api(`iframe`, {
    method: 'GET',
  })
  listIframe.value = result || []
}
const getData = async () => {
  isLoading.value = true

  const { loading, result, total_pages, total }: any = await $api('lead', {
    method: 'GET',
    params: {
      ...query.value,
      status: query.value.label_id == 'all' ? undefined : query.value?.label_id,
      from: query.value.from ? dayjs(query.value.from).format('YYYY-MM-DD 00:00:01') : undefined,
      to: query.value.to ? dayjs(query.value.to).format('YYYY-MM-DD 23:59:59') : undefined,
    },
  })
  applications.value = result || []
  totalRecords.value = total_pages * perPage.value || 0
  useQueryURL(query.value)

  isLoading.value = false
}
getData()
nextTick(() => {
  getListIframe()
})
const numberBadge = computed(() => {
  let count = 0
  // if (query.value.label_id) {
  //   count += 1
  // }
  if (query.value.from) {
    count += 1
  }
  if (query.value.to) {
    count += 1
  }
  if (query.value.iframe_id) {
    count += 1
  }
  return count
})
getDataColumn()
getDataLabel()
const getNumberApplicationStatus = async () => {
  console.log('get')
  const { result }: any = await $api(`lead/number-label`, {
    method: 'GET',
  })
  let obj = {} as any
  result.forEach((item: any) => {
    obj[item._id] = item.count
  })
  numberApplicationStatus.value = obj
}
onMounted(() => {
  getNumberApplicationStatus()
})

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
    label_id: null,
    filterBy: null,
    from: null,
    to: null,
    iframe_id: '',
    limit: 20,
  }
  getData()
}

const cancelSelected = () => {
  selectedApplications.value = {}
}

const confirmDelete = (record: any) => {
  confirm.require({
    message: 'Are you sure you want to delete?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
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

const openNote = (record: any) => {
  isShowNote.value = true
  formNote.value = {
    _id: record?._id,
    content: record?.note?.content || '',
    note:
      record?.notes?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) ||
      [],
  }
}

const closeNote = () => {
  isShowNote.value = false
  formNote.value = {
    _id: '',
    content: '',
  }
}

const editNoteById = async () => {
  const { result }: any = await $api<any>(`lead/${formNote.value._id}/note`, {
    method: 'POST',
    body: {
      note: formNote.value.content,
    },
  })

  if (result) {
    const index = applications.value.findIndex((item: any) => item?._id === formNote.value?._id)
    // const newItem = {
    //   ...applications.value[index],
    //   note: data.value.result.note,
    // }
    // applications.value.splice(index, 1, newItem)
    closeNote()
    getData()
    formNote.value.content = ''
  }
}

const onChangeStatus = (val: any) => {
  query.value.label_id = val
  getData()
}
const toggleMenuSetting = (e: Event) => {
  menuSetting.value.toggle(e)
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
const sortData = (e: any) => {
  const data = JSON.parse(JSON.stringify(applications.value))
  switch (e.sortField) {
    case 'created_at':
      if (e.sortOrder === 1) {
        data.sort((a: any, b: any) => {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        })
      } else
        data.sort((a: any, b: any) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
      break

    default:
      break
  }

  applications.value = data
}
const createApplicationDefault = async () => {
  const { data, error }: any = await $api('crm-lead/setup', {
    method: 'POST',
  })
  if (!error.value) {
    toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully', life: 3000 })
    getDataColumn()
    getDataLabel()
    getData()
  }
}
const addQueryCampaign = (id: string) => {
  query.value.iframe_id = id
  getData()
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
          <ButtonFilter @onClearAll="clearAll" @onApply="getData" :numberBadge="numberBadge">
            <template v-slot="slotProps">
              <!-- <div class="flex flex-row gap-2 mb-4">
                <BaseInputCalendar label="From" v-model="query.from" />
                <BaseInputCalendar label="To" v-model="query.to" />
              </div> -->
              <BaseInputSelect
                label="Campaign"
                :options="listIframe"
                name="iframe_id"
                :filter="true"
                option-label="name"
                option-value="_id"
                v-model="query.iframe_id"
              />
              <div class="fr gap-2 mt-4 jc-fe">
                <Button label="Clear" severity="secondary" @click="clearAll" />
                <Button label="Apply" severity="primary" @click="getData" />
              </div>
            </template>
          </ButtonFilter>
          <nuxt-link to="/link">
            <Button size="small" label="Campaign"> </Button>
          </nuxt-link>
          <nuxt-link to="/crm/create">
            <Button type="button" size="small" label="Create">
              <template #icon>
                <img src="~/assets/icons/i-plus-white.svg" alt="" />
              </template>
            </Button>
          </nuxt-link>
        </div>
      </div>

      <TabStatusCRM
        class="mt-4"
        :numberApplicationStatus="numberApplicationStatus"
        @onChangeStatus="onChangeStatus"
        :labels="labels"
      >
        <img
          src="~/assets/icons/i-more-vertical-black.svg"
          alt=""
          class="icon mr-[12px] cursor-pointer"
          @click="toggleMenuSetting"
        />

        <OverlayPanel class="!mt-2" ref="menuSetting">
          <div class="fc">
            <div class="fr gap-2 ai-c hover:bg-black-10 p-2 cursor-pointer" @click="isShowDrawerLabel = true">
              <img src="~/assets/icons/i-label.svg" alt="" class="icon" />
              <span class="text-base c-black-90">Labels management</span>
            </div>
            <div class="fr gap-2 ai-c hover:bg-black-10 p-2 cursor-pointer" @click="isShowDrawerColumn = true">
              <img src="~/assets/icons/i-column.svg" alt="" class="icon" />
              <span class="text-base c-black-90">Fields management</span>
            </div>
            <div class="fr gap-2 ai-c hover:bg-black-10 p-2 cursor-pointer" @click="isShowImportExcel = true">
              <img src="~/assets/icons/i-import.svg" alt="" class="icon" />
              <span class="text-base c-black-90">Import Excel</span>
            </div>
          </div>
          <!-- <Button class="flex-1" label="Clear all" severity="secondary" type="button" @click="onClearAll" />
          <Button class="flex-1" label="Apply" severity="apply" type="button" @click="onApply" /> -->
        </OverlayPanel>
      </TabStatusCRM>
      <DataTable
        v-if="columns.length > 0"
        :value="applications"
        dataKey="_id"
        rowHover
        lazy
        scrollable
        paginator
        @sort="sortData"
        :first="firstIndexPage"
        :totalRecords="totalRecords"
        :rows="perPage"
        :loading="isLoading"
        v-model:selection="selectedApplications"
        RowsPerPageDropdown
        :rowsPerPageOptions="[20, 50, 100]"
        @page="changePage"
      >
        <!-- <Column selectionMode="multiple" headerStyle="width: 3rem" :frozen="true" alignFrozen="left"></Column> -->

        <Column header="#" :frozen="true" alignFrozen="left">
          <template #body="slotProps">
            <nuxt-link :to="`/crm/${slotProps.data._id}`" class="c-primary fr ai-c gap-2">
              {{ slotProps.index + firstIndexPage }}
              <TagIcon :color="slotProps.data?.label?.color" v-if="slotProps.data?.label" />
            </nuxt-link>
          </template>
        </Column>
        <Column header="Name" :frozen="true" alignFrozen="left" style="max-width: 500px; min-width: 300px">
          <template #body="slotProps">
            <nuxt-link :to="`/crm/${slotProps.data._id}`" class="flex items-center gap-1 cursor-pointer">
              <span class="text-base font-normal c-primary">
                {{ slotProps.data.name }}
              </span>
            </nuxt-link>
          </template>
        </Column>
        <Column header="Campaign" :frozen="true" alignFrozen="left">
          <template #body="slotProps">
            <div
              class="flex items-center gap-1 cursor-pointer"
              v-if="slotProps.data?.iframe?._id"
              @click="addQueryCampaign(slotProps.data?.iframe?._id)"
            >
              <span class="text-base font-normal c-primary">
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
        <Column style="min-width: 200px" field="created_at" header="Created at">
          <template #body="slotProps">
            {{ useMoment(slotProps.data.created_at) }}
          </template>
        </Column>

        <Column header="Actions" :frozen="true" alignFrozen="right" :pt="{ root: { class: 'flex jc-fe' } }">
          <template #body="slotProps">
            <div class="flex gap-2 jc-fe">
              <!-- <FormAssignNote :data="slotProps.data" v-if="usePermission('admin')" /> -->
              <button class="relative">
                <img
                  class="icon-lg"
                  src="~/assets/icons/i-note-circle.svg"
                  alt=""
                  v-tooltip.top="'Note'"
                  @click="openNote(slotProps.data)"
                />
                <Badge
                  class="absolute top-4 right-6"
                  severity="danger"
                  v-if="slotProps.data?.notes?.length > 0"
                ></Badge>
              </button>
              <nuxt-link :to="`/crm/edit/${slotProps.data._id}`">
                <img class="icon-lg" src="~/assets/icons/i-pen-circle.svg" alt="" v-tooltip.top="'Edit'" />
              </nuxt-link>
              <button @click="confirmDelete(slotProps.data)">
                <img class="icon-lg" src="~/assets/icons/i-trash-circle.svg" alt="" v-tooltip.top="'Delete'" />
              </button>
            </div>
          </template>
        </Column>

        <template #empty>
          <NoData />
        </template>
      </DataTable>
      <div class="flex jc-c ai-c mt-4" v-else>
        <!-- <Button
          label="Use Default Lead CRM"
          severity="primary"
          type="button"
          @click="createApplicationDefault"
        ></Button> -->
      </div>

      <!-- Iframe -->
      <BaseDialog :visible="isShowIframe" title="IFrame" @onClose="closeDialogIFrame">
        <FormIframe :columns="columns" @onClose="closeDialogIFrame" :labels="labels" :isShowIframe="isShowIframe" />
      </BaseDialog>

      <!-- Note -->
      <BaseDialog :visible="isShowNote" title="Note" @onClose="closeNote">
        <BaseEditor class="mb-3" :editorConfig="editorNoteConfig" v-model="formNote.content" />

        <div class="flex justify-end gap-4">
          <Button label="Cancel" severity="secondary" type="button" @click="closeNote" />
          <Button
            label="Save"
            severity="primary"
            type="button"
            @click="editNoteById"
            :disabled="!formNote.content || formNote.content.length < 1"
          />
        </div>

        <div class="mt-6 flex flex-col gap-6" v-if="formNote?.note?.length > 0">
          <div class="relative flex items-start gap-3" v-for="(item, index) in formNote.note" :key="item._id">
            <BaseAvatar :url="item?.user?.avatar" :size="32" />

            <div class="flex-1">
              <div class="mb-[4px] flex items-center gap-3">
                <p class="text-base font-normal c-black-90 m-0">
                  {{ item?.user?.name }}
                </p>
                <span class="text-xs font-normal c-gray-40">
                  {{ useMoment(item?.created_at) }}
                </span>
              </div>
              <div class="text-base font-normal c-gray-50" v-html="item?.note"></div>
            </div>

            <div
              class="absolute top-32 left-16 w-[1px] h-full bg-black-20"
              v-if="index < formNote.note.length - 1"
            ></div>
          </div>
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
