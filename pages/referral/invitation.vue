<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import ButtonToggleOverlayPanel from '~/components/ButtonToggleOverlayPanel.vue'

definePageMeta({
  titleBreadCrumb: 'common.employees',
  permission: 'view_employee',
})

const appStore = useAppStore()
const confirm = useConfirm()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const { $api } = useNuxtApp()
const { t } = useI18n()
const listReferral = ref<any>([])
const pagination = ref({
  perPage: 20,
  currentPage: route.query?.page ? Number(route.query?.page) : 1,
  total: 0,
})

const search = ref((route.query.search as string) || '')
const isLoading = ref(false)

const firstIndexTable = computed(() => (pagination.value.currentPage - 1) * pagination.value.perPage)

const replaceQuery = () => {
  router.replace({
    query: {
      page: pagination.value.currentPage,
      search: search.value || undefined,
    },
  })
}

const getListReferral = async () => {
  isLoading.value = true
  const { result }: any = await $api(`referral-invitation`, {
    method: 'GET',
    params: {
      search: search.value || undefined,
      page: pagination.value.currentPage,
      limit: pagination.value.perPage,
    },
  })
  replaceQuery()
  listReferral.value = result || []
  isLoading.value = false
}
getListReferral()

const changePage = (e: any) => {
  const page = e?.page + 1
  pagination.value.currentPage = page
  getListReferral()
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
      const { data }: any = await $api(`iframe/${record._id}`, {
        method: 'DELETE',
      })
      if (data.value.statusCode === 200) {
        getListReferral()
        toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully', life: 3000 })
      }
    },
    reject: () => {
      // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
    },
  })
}

watchDebounced(
  () => search.value,
  (newValue) => {
    pagination.value.currentPage = 1
    getListReferral()
  },
  { debounce: 300 },
)
</script>

<template>
  <div class="page p-4">
    <div class="mb-4 flex items-center justify-between gap-[16px]">
      <h1 class="flex-1 m-0 page-heading"> {{ t('common.invitation') }} </h1>

      <nuxt-link
        class="text-base font-normal text-left c-black-90 no-underline bg-transparent transition-all hover:bg-gray-10"
        to="/referral/create"
      >
        <Button> {{ t('button.invite') }} </Button>
      </nuxt-link>
    </div>

    <div class="box p-4">
      <div class="mb-4 flex flex-wrap gap-2">
        <BaseSearch class="flex-1" v-model="search" />
      </div>

      <DataTable
        :value="listReferral"
        dataKey="_id"
        rowHover
        lazy
        scrollable
        paginator
        :first="firstIndexTable"
        :totalRecords="pagination.total"
        :rows="pagination.perPage"
        :loading="isLoading"
        RowsPerPageDropdown
        :rowsPerPageOptions="[20, 50, 100]"
        @page="changePage"
      >
        <Column header="#" :frozen="true" alignFrozen="left">
          <template #body="slotProps">
            <div :to="`/crm/${slotProps.data._id}`" class="fr ai-c gap-2">
              {{ slotProps.index + firstIndexTable + 1 }}
              <TagIcon :color="slotProps.data?.label?.color" v-if="slotProps.data?.label" />
            </div>
          </template>
        </Column>
        <Column :header="t('common.name')">
          <template #body="slotProps">
            <span class="fr ai-c gap-2">
              {{ slotProps.data.name }}
            </span>
          </template>
        </Column>
        <Column :header="t('common.email')" field="email"> </Column>
        <Column :header="t('common.email')" field="phone"> </Column>

        <Column field="is_confirm" :header="t('common.confirm')">
          <template #body="slotProps">
            <!-- <BaseSwitch v-model="slotProps.data.is_active" :disabled="true" /> -->
            <img src="~/assets/icons/i-check-primary.svg" v-if="slotProps.data.is_confirm" alt="" />
          </template>
        </Column>
        <Column style="min-width: 200px" field="created_at" :header="t('common.created_at')">
          <template #body="slotProps">
            {{ useMoment(slotProps.data.created_at) }}
          </template>
        </Column>

        <Column :header="t('common.actions')" :frozen="true" alignFrozen="right" style="min-width: 100px">
          <template #body="slotProps">
            <div class="flex gap-2 jc-fe">
              <!-- <nuxt-link :to="`/link/edit/${slotProps.data._id}`">
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
    </div>
  </div>
</template>
