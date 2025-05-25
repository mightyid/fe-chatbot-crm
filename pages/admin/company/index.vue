<script lang="ts" setup>
const route = useRoute()
const { $api } = useNuxtApp()
const confirm = useConfirm()
const toast = useToast()
const query = ref({
  page: Number(route.query?.page) || 1,
  search: (route.query?.search as string) || '',
  limit: 20,
})
const isLoading = ref(false)
const perPage = ref(20)
const totalRecords = ref(0)
const listChatbot = ref([])
const firstIndexPage = computed(() => {
  return query.value.page > 1 ? (query.value.page - 1) * perPage.value + 1 : 1
})
const getData = async () => {
  isLoading.value = true

  const { loading, result, total_pages, total }: any = await $api('admin/company', {
    method: 'GET',
    params: {
      ...query.value,
    },
  })
  listChatbot.value = result || []
  totalRecords.value = total_pages * perPage.value || 0
  useQueryURL(query.value)
  isLoading.value = false
}
getData()

const changePage = (e: any) => {
  perPage.value = e.rows
  query.value.page = e.page + 1
  getData()
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
      const { statusCode }: any = await $api(`admin/company/${record._id}`, {
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
const changeStatus = (val: any) => {
  console.log(val)
  $api(`admin/company/change-status`, {
    method: 'PUT',
    body: {
      bot_id: val._id,
      is_active: val.is_active,
    },
  })
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
      <div class="flex flex-row items-center justify-between">
        <div class="page-heading m-0">Company</div>
        <div class="flex items-center justify-end gap-4">
          <nuxt-link to="/admin/company/create">
            <Button type="button" size="small" label="Create">
              <template #icon>
                <img src="~/assets/icons/i-plus-white.svg" alt="" />
              </template>
            </Button>
          </nuxt-link>
        </div>
      </div>
      <div class="bg-white fc p-4 mt-4 rounded gap-4">
        <BaseSearch v-model="query.search" />
        <DataTable
          :value="listChatbot"
          dataKey="_id"
          rowHover
          lazy
          scrollable
          paginator
          :first="firstIndexPage"
          :totalRecords="totalRecords"
          :rows="perPage"
          :loading="isLoading"
          RowsPerPageDropdown
          :rowsPerPageOptions="[20, 50, 100]"
          @page="changePage"
        >
          <Column header="#" :frozen="true" alignFrozen="left">
            <template #body="slotProps">
              <nuxt-link :to="`/crm/${slotProps.data._id}`" class="c-primary fr ai-c gap-2">
                {{ slotProps.index + firstIndexPage }}
                <TagIcon :color="slotProps.data?.label?.color" v-if="slotProps.data?.label" />
              </nuxt-link>
            </template>
          </Column>
          <Column header="Name" :frozen="true" alignFrozen="left">
            <template #body="slotProps">
              <span class="fr ai-c gap-2">
                {{ slotProps.data.name }}
              </span>
            </template>
          </Column>
          <Column style="min-width: 200px" field="created_at" header="Created at">
            <template #body="slotProps">
              {{ useMoment(slotProps.data.created_at) }}
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="slotProps">
              <BaseSwitch v-model="slotProps.data.is_active" @update:model-value="changeStatus(slotProps.data)" />
            </template>
          </Column>

          <Column header="Actions" :frozen="true" alignFrozen="right" :pt="{ root: { class: 'flex jc-fe' } }">
            <template #body="slotProps">
              <div class="flex gap-2 jc-fe">
                <nuxt-link :to="`/admin/company/edit/${slotProps.data._id}`">
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
      </div>
    </div>
  </div>
</template>
