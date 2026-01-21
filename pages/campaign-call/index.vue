<script lang="ts" setup>
const route = useRoute()
const { $api } = useNuxtApp()
const confirm = useConfirm()
const toast = useToast()
const query = ref({
  page: Number(route.query?.page) || 1,
  limit: 20,
  search: (route.query?.search as string) || '',
})
const { t } = useI18n()
const isLoading = ref(false)
const perPage = ref(20)
const totalRecords = ref(0)
const listCampaign = ref([])

const firstIndexPage = computed(() => {
  return query.value.page > 1 ? (query.value.page - 1) * perPage.value + 1 : 1
})

const getData = async () => {
  isLoading.value = true

  const { result, total }: any = await $api('campaign-call', {
    method: 'GET',
    params: {
      ...query.value,
    },
  })
  listCampaign.value = result || []
  totalRecords.value = total || 0
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
    message: t('common.confirm_delete'),
    header: t('common.confirmation'),
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: t('button.cancel'),
    acceptLabel: t('button.delete'),
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      const { statusCode }: any = await $api(`campaign-call/${record._id}`, {
        method: 'DELETE',
      })
      if (statusCode === 200) {
        getData()
        toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully', life: 3000 })
      }
    },
    reject: () => {},
  })
}

const toggleActive = async (record: any) => {
  const { statusCode }: any = await $api(`campaign-call/${record._id}`, {
    method: 'PUT',
    body: {
      is_active: !record.is_active,
    },
  })
  if (statusCode === 200) {
    getData()
    toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully', life: 3000 })
  }
}

watchDebounced(
  () => query.value.search,
  () => {
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
        <div class="page-heading m-0"> {{ t('common.campaign_call') }} </div>
        <div class="flex items-center justify-end gap-4">
          <nuxt-link to="/campaign-call/create">
            <Button type="button" size="small" :label="t('button.create')">
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
          :value="listCampaign"
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
          <Column header="#" :frozen="true" alignFrozen="left" style="width: 50px">
            <template #body="slotProps">
              {{ slotProps.index + firstIndexPage }}
            </template>
          </Column>
          <Column :header="t('common.name')" style="min-width: 200px">
            <template #body="slotProps">
              <span class="font-medium">{{ slotProps.data.name }}</span>
            </template>
          </Column>
          <Column :header="t('common.instruction')" style="min-width: 300px">
            <template #body="slotProps">
              <span class="text-gray-600 line-clamp-2">{{ slotProps.data.instruction }}</span>
            </template>
          </Column>
          <Column field="is_active" :header="t('common.status')" style="width: 100px">
            <template #body="slotProps">
              <InputSwitch :modelValue="slotProps.data.is_active" @update:modelValue="toggleActive(slotProps.data)" />
            </template>
          </Column>
          <Column style="min-width: 180px" field="created_at" :header="t('common.created_at')">
            <template #body="slotProps">
              {{ useMoment(slotProps.data.created_at) }}
            </template>
          </Column>
          <Column :header="t('common.actions')" :frozen="true" alignFrozen="right" style="width: 120px">
            <template #body="slotProps">
              <div class="flex gap-2 jc-fe">
                <nuxt-link :to="`/campaign-call/${slotProps.data._id}`">
                  <img
                    class="icon-lg"
                    src="~/assets/icons/i-eye-secondary-circle.svg"
                    alt=""
                    v-tooltip.top="'View Detail'"
                  />
                </nuxt-link>
                <nuxt-link :to="`/campaign-call/edit/${slotProps.data._id}`">
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

<style lang="scss" scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
