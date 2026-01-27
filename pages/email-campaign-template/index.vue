<script lang="ts" setup>
import useEmailTemplateService from '~/composables/controller/useEmailTemplateService'
import type { EmailTemplateType } from '~/types/email-campaign'

const route = useRoute()
const { t } = useI18n()
const confirm = useConfirm()
const toast = useToast()
const { getTemplates, deleteTemplate } = useEmailTemplateService()

const query = ref({
  page: Number(route.query?.page) || 1,
  limit: 20,
  search: (route.query?.search as string) || '',
})

const isLoading = ref(false)
const listTemplates = ref<EmailTemplateType[]>([])
const totalRecords = ref(0)
const perPage = ref(20)

const firstIndexPage = computed(() => {
  return query.value.page > 1 ? (query.value.page - 1) * perPage.value + 1 : 1
})

const getData = async () => {
  isLoading.value = true
  try {
    const { result, total }: any = await getTemplates(query.value)
    listTemplates.value = result || []
    totalRecords.value = total || 0
    useQueryURL(query.value)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const changePage = (e: any) => {
  perPage.value = e.rows
  query.value.page = e.page + 1
  getData()
}

const confirmDelete = (record: EmailTemplateType) => {
  confirm.require({
    message: t('common.confirm_delete'),
    header: t('common.confirmation'),
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: t('button.cancel'),
    acceptLabel: t('button.delete'),
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      try {
        const { statusCode }: any = await deleteTemplate(record._id)
        if (statusCode === 200) {
          getData()
          toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully deleted', life: 3000 })
        }
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete', life: 3000 })
      }
    },
  })
}

watchDebounced(
  () => query.value.search,
  () => {
    query.value.page = 1
    getData()
  },
  { debounce: 600, maxWait: 3000 },
)

onMounted(() => {
  getData()
})
</script>

<template>
  <div class="page p-4">
    <div class="flex flex-row items-center justify-between">
      <div class="page-heading m-0">Email Templates</div>
      <div class="flex items-center justify-end gap-4">
        <nuxt-link to="/email-campaign-template/create">
          <Button type="button" size="small" label="Create Template">
            <template #icon>
              <img src="~/assets/icons/i-plus-white.svg" alt="" />
            </template>
          </Button>
        </nuxt-link>
      </div>
    </div>

    <div class="bg-white fc p-4 mt-4 rounded shadow-sm">
      <div class="mb-4 flex items-center gap-4">
        <InputSearch class="w-[300px]" v-model="query.search" />
      </div>

      <DataTable
        :value="listTemplates"
        dataKey="_id"
        rowHover
        lazy
        scrollable
        paginator
        :first="firstIndexPage"
        :totalRecords="totalRecords"
        :rows="perPage"
        :loading="isLoading"
        :rowsPerPageOptions="[20, 50, 100]"
        @page="changePage"
      >
        <Column header="#" :frozen="true" alignFrozen="left" style="width: 50px">
          <template #body="slotProps">
            {{ slotProps.index + firstIndexPage }}
          </template>
        </Column>
        <Column header="Name" style="min-width: 200px">
          <template #body="slotProps">
            <span class="font-medium">{{ slotProps.data.name }}</span>
          </template>
        </Column>

        <Column style="min-width: 180px" header="Created At">
          <template #body="slotProps">
            {{ useMoment(slotProps.data.created_at) }}
          </template>
        </Column>
        <Column header="Actions" :frozen="true" alignFrozen="right" style="width: 120px">
          <template #body="slotProps">
            <div class="flex gap-2 jc-fe">
              <nuxt-link :to="`/email-campaign-template/edit/${slotProps.data._id}`">
                <img class="icon-lg" src="~/assets/icons/i-pen-circle.svg" alt="" v-tooltip.top="'Edit'" />
              </nuxt-link>
              <button @click="confirmDelete(slotProps.data)">
                <img class="icon-lg" src="~/assets/icons/i-trash-red-circle.svg" alt="" v-tooltip.top="'Delete'" />
              </button>
            </div>
          </template>
        </Column>
        <template #empty>
          <NoData />
        </template>
      </DataTable>
    </div>
  </div>
</template>
