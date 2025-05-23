<script lang="ts" setup>
import useRole from '~/composables/useRole'
import { generatePathWithParams, PATH_ROLE_CREATE, PATH_ROLE_EDIT } from '~/constant/routerPath'

definePageMeta({
  titleBreadCrumb: 'common.role',
  permission: 'view_role',
})

const { t } = useI18n()
const { $moment } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()
const allowanceServices = useRole()
// const branchServices = useBranch()

const branch = ref((route.query?.branch as string) || '')
const isLoading = ref(false)
const allowances = ref<RoleType[]>([])
const search = ref((route.query.search as string) || '')
const pagination = ref({
  perPage: 20,
  currentPage: route.query?.page ? Number(route.query?.page) : 1,
  total: 0,
})

const firstIndexTable = computed(() => (pagination.value.currentPage - 1) * pagination.value.perPage)

const replaceQuery = () => {
  router.replace({
    query: {
      page: pagination.value.currentPage,
      search: search.value || undefined,
      branch: branch.value || undefined,
    },
  })
}

const getRoles = async () => {
  isLoading.value = true

  replaceQuery()

  const { statusCode, result } = await allowanceServices.getRoleList({
    search: search.value || undefined,
    page: pagination.value.currentPage,
    limit: pagination.value.perPage,
    branch_id: branch.value || undefined,
  })

  allowances.value = result || []
  // pagination.value.total = result?.total

  isLoading.value = false
}
getRoles()

// const getBranches = async () => {
//   const { statusCode, result } = await branchServices.getBranchList({
//     limit: 'all',
//     is_active: 1,
//     is_role: 1,
//   })

//   branchOptions.value = result?.branches || []
// }
// getBranches()

const changePage = (e: any) => {
  const page = e?.page + 1
  pagination.value.currentPage = page
  getRoles()
}

const confirmDelete = (record: any) => {
  if (record?._id) {
    confirm.require({
      message: `${t('common.confirm_delete')} ${record?.name}?`,
      header: t('common.confirm'),
      icon: '',
      rejectLabel: t('button.no'),
      acceptLabel: t('button.delete'),
      rejectClass: 'p-button-secondary p-button-outlined',
      acceptClass: 'p-button-danger',
      accept: async () => {
        const { statusCode } = await allowanceServices.deleteRoleById(record?._id)

        if (statusCode >= 200 && statusCode < 300) {
          toast.add({ severity: 'success', summary: t('common.success'), detail: t('common.deleted'), life: 3000 })
          getRoles()
        }
      },
      reject: () => {},
    })
  }
}

watchDebounced(
  () => search.value,
  (newValue) => {
    pagination.value.currentPage = 1
    getRoles()
  },
  { debounce: 300 },
)
</script>

<template>
  <div class="page p-4">
    <div class="mb-4 flex justify-between items-center">
      <h1 class="page-heading m-0"> {{ t('common.role') }} </h1>

      <div class="flex justify-end gap-4">
        <nuxt-link :to="PATH_ROLE_CREATE" v-can="'create_role'">
          <Button :label="t('button.create')" type="button">
            <template #icon>
              <img class="icon mr-1" src="~/assets/icons/i-plus-white.svg" />
            </template>
          </Button>
        </nuxt-link>
      </div>
    </div>

    <div class="box p-4">
      <div class="mb-4 flex gap-2">
        <BaseSearch class="flex-1" v-model="search" />
      </div>

      <DataTable
        :value="allowances"
        dataKey="_id"
        lazy
        paginator
        :rows="pagination.perPage"
        :totalRecords="pagination.total"
        :loading="isLoading"
        :first="firstIndexTable"
        scrollable
        scrollHeight="calc(100vh - 260px)"
        @page="changePage"
      >
        <Column header="#" style="width: 80px">
          <template #body="slotProps">
            {{ slotProps?.index + firstIndexTable + 1 }}
          </template>
        </Column>

        <Column :header="t('common.role')" style="min-width: 200px">
          <template #body="slotProps">
            <p class="m-0 whitespace-nowrap text-base font-normal c-black-90">
              {{ slotProps?.data?.name }}
            </p>
          </template>
        </Column>
        <Column :header="t('common.admin')" style="min-width: 150px">
          <template #body="slotProps">
            <img class="icon" src="~/assets/icons/i-tick-primary.svg" v-if="slotProps.data?.is_admin" />
          </template>
        </Column>

        <Column :header="t('common.active')" style="min-width: 120px; max-width: 150px">
          <template #body="slotProps">
            <img class="icon" src="~/assets/icons/i-tick-primary.svg" v-if="slotProps.data?.is_active" />
          </template>
        </Column>

        <Column :header="t('common.created_date')" style="width: 120px">
          <template #body="slotProps">
            <p class="m-0 whitespace-nowrap text-base font-normal c-black-90">
              {{
                slotProps?.data?.created_at
                  ? $dayjs(slotProps?.data?.created_at).utc().format('DD/MM/YYYY HH:mm:ss')
                  : ''
              }}
            </p>
          </template>
        </Column>

        <Column
          style="width: 120px"
          :header="t('common.actions')"
          headerStyle="text-align: right;"
          alignFrozen="right"
          :frozen="true"
        >
          <template #body="slotProps">
            <div class="flex items-center justify-end gap-2">
              <nuxt-link
                :to="generatePathWithParams(PATH_ROLE_EDIT, { id: slotProps?.data?._id })"
                v-can="'update_role'"
              >
                <img src="~/assets/icons/i-pen-secondary-circle.svg" alt="" />
              </nuxt-link>

              <button class="p-0" type="button" @click="confirmDelete(slotProps?.data)" v-can="'delete_role'">
                <img src="~/assets/icons/i-trash-red-circle.svg" alt="" />
              </button>
            </div>
          </template>
        </Column>
        <template #empty> {{ t('common.no_data') }} </template>
      </DataTable>
    </div>
  </div>
</template>
