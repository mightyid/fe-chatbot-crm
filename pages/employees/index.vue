<script setup lang="ts">
import {
  generatePathWithParams,
  PATH_EMPLOYEES_EDIT,
  PATH_EMPLOYEES_CREATE,
  PATH_EMPLOYEES_DETAIL,
} from '~/constant/routerPath'
import { useAppStore } from '~/stores/app'
import ButtonToggleOverlayPanel from '~/components/ButtonToggleOverlayPanel.vue'
import ButtonExportExcel from '~/components/ButtonExportExcel.vue'
import DialogExcelImport from '~/components/DialogExcelImport.vue'
import type { BodyEmployeeType, EmployeeType } from '~/types/employee'
import findNameOfOptionsByValue from '~/utils/findNameOfOptionsByValue'
import { GENDER_OPTIONS } from '~/constant/gender'

definePageMeta({
  titleBreadCrumb: 'common.employees',
  permission: 'view_employee',
})

const { $moment } = useNuxtApp()
const appStore = useAppStore()
const { t, locale } = useI18n()
const confirm = useConfirm()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const { CONTENT_EXPORT_EXCEL, OPTIONS_IMPORT_EXCEL, REQUIRED_FIELD_IMPORT_EXCEL, ...employeeServices } = useEmployee()

const selectLang = ref(appStore.locale)
const employees = ref<any>([])
const pagination = ref({
  perPage: 20,
  currentPage: route.query?.page ? Number(route.query?.page) : 1,
  total: 0,
})
const filter = ref<{ [key: string]: any }>({
  branch: (route.query.branch as string) || null,
  department: (route.query.department as string) || null,
  position: (route.query.position as string) || null,
})
const search = ref((route.query.search as string) || '')
const isLoading = ref(false)

const existingEmployees = ref<any>([])
const isLoadingImport = ref(false)

const firstIndexTable = computed(() => (pagination.value.currentPage - 1) * pagination.value.perPage)

const replaceQuery = () => {
  router.replace({
    query: {
      page: pagination.value.currentPage,
      search: search.value || undefined,
      branch: filter.value.branch || undefined,
      department: filter.value.department || undefined,
      position: filter.value.position || undefined,
    },
  })
}

const getEmployeeList = async () => {
  isLoading.value = true

  replaceQuery()

  const { statusCode, result, total, total_page } = await employeeServices.getEmployees({
    search: search.value || undefined,
    page: pagination.value.currentPage,
    limit: pagination.value.perPage,
    branch: filter.value.branch || undefined,
    department: filter.value.department || undefined,
    position: filter.value.position || undefined,
    is_role: 1,
  })

  employees.value = result || []
  pagination.value.total = total

  isLoading.value = false
}
getEmployeeList()

// const getPositions = async () => {
//   const { statusCode, result } = await positionServices.getPositionList({
//     limit: 'all',
//     is_active: 1,
//   })

//   positionOptions.value = result?.positions || []
// }
// getPositions()

const changePage = (e: any) => {
  const page = e?.page + 1
  pagination.value.currentPage = page
  getEmployeeList()
}

const resetFilter = () => {
  for (let key in filter.value) {
    filter.value[key] = null
  }
  pagination.value.currentPage = 1
  getEmployeeList()
}

const applyFilter = () => {
  pagination.value.currentPage = 1
  getEmployeeList()
}

const resetExistingEmployees = () => {
  existingEmployees.value = []
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
        const { statusCode } = await employeeServices.deleteEmployeeById(record?._id)

        if (statusCode >= 200 && statusCode < 300) {
          toast.add({ severity: 'success', summary: t('common.success'), detail: t('common.deleted'), life: 3000 })
          getEmployeeList()
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
    getEmployeeList()
  },
  { debounce: 300 },
)
</script>

<template>
  <div class="page p-4">
    <div class="mb-4 flex items-center justify-between gap-[16px]">
      <h1 class="flex-1 m-0 page-heading"> {{ t('common.employees') }} </h1>

      <ButtonToggleOverlayPanel class="!py-2 !px-4 gap-2" severity="primary" v-can="'create_employee'">
        <template #buttonContent>
          <img src="~/assets/icons/i-plus-white.svg" alt="" />
          <span class="text-base"> {{ t('button.create') }} </span>
        </template>

        <template #overlayPanelContent>
          <div>
            <nuxt-link
              class="block w-full py-2 px-3 text-base font-normal text-left c-black-90 no-underline bg-transparent transition-all hover:bg-gray-10"
              :to="PATH_EMPLOYEES_CREATE"
            >
              {{ t('button.manual_addition') }}
            </nuxt-link>
          </div>
        </template>
      </ButtonToggleOverlayPanel>
    </div>

    <div class="box p-4">
      <div class="mb-4 flex flex-wrap gap-2">
        <BaseSearch class="flex-1" v-model="search" />
        <!-- <BaseInputSelect
          name="position"
          optionLabel="name"
          optionValue="_id"
          :placeholder="t('common.position')"
          :options="positionOptions"
          :filterDefault="true"
          :showClearDefault="true"
          v-model="filter.position"
          @update:modelValue="getEmployeeList"
        /> -->
        <!-- <Button class="min-w-[110px] bg-primary-10 border-[#E3F0FF] c-primary" type="button" :label="t('button.reset')">
          <template #icon>
            <img class="icon mr-2" src="~/assets/icons/i-undo.svg" />
          </template>
        </Button> -->
      </div>

      <DataTable
        :value="employees"
        dataKey="_id"
        lazy
        paginator
        :rows="pagination.perPage"
        :totalRecords="pagination.total"
        :loading="isLoading"
        :first="firstIndexTable"
        scrollable
        scrollHeight="calc(100vh - 320px)"
        @page="changePage"
      >
        <Column header="#" style="width: 80px">
          <template #body="slotProps">
            {{ slotProps?.index + firstIndexTable + 1 }}
          </template>
        </Column>

        <Column :header="t('common.full_name')" style="min-width: 200px" frozen>
          <template #body="slotProps">
            <p class="m-0 whitespace-nowrap">
              {{ slotProps?.data?.name }}
            </p>
          </template>
        </Column>

        <Column :header="t('common.email')" style="min-width: 200px">
          <template #body="slotProps">
            <p class="m-0 whitespace-nowrap">
              {{ slotProps?.data?.email }}
            </p>
          </template>
        </Column>

        <Column :header="t('common.created_at')" style="min-width: 150px">
          <template #body="slotProps">
            <p class="m-0 whitespace-nowrap">
              {{
                slotProps?.data?.created_at
                  ? $dayjs(slotProps?.data?.created_at).utc().format('DD/MM/YYYY HH:mm:ss')
                  : ''
              }}
            </p>
          </template>
        </Column>

        <Column :header="t('common.active')" style="min-width: 120px">
          <template #body="slotProps">
            <img class="icon" src="~/assets/icons/i-tick-primary.svg" v-if="slotProps.data?.is_active" />
          </template>
        </Column>

        <Column
          style="width: fit-content"
          :header="t('common.actions')"
          headerStyle="text-align: right;"
          alignFrozen="right"
          :frozen="true"
        >
          <template #body="slotProps">
            <div class="flex items-center justify-end gap-2">
              <!-- <nuxt-link
                :to="generatePathWithParams(PATH_EMPLOYEES_DETAIL, { id: slotProps?.data?._id })"
                v-can="'view_employee'"
              >
                <img src="~/assets/icons/i-eye-secondary-circle.svg" alt="" />
              </nuxt-link> -->

              <nuxt-link :to="`/employees/${slotProps.data._id}/edit`" v-can="'update_employee'">
                <img src="~/assets/icons/i-pen-secondary-circle.svg" alt="" />
              </nuxt-link>

              <button class="p-0" type="button" @click="confirmDelete(slotProps?.data)" v-can="'delete_employee'">
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
