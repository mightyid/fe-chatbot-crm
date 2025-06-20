<script setup lang="ts">
import EmployeesForm from '~/components/Employees/EmployeesForm.vue'
import { PATH_EMPLOYEES_LIST } from '~/constant/routerPath'

definePageMeta({
  titleBreadCrumb: 'button.add_new',
  permission: 'create_employee',
})

const { t } = useI18n()
const { $moment, $api } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const employeeServices = useEmployee()
const info = ref<any>({})
enum EmployeeEnum {
  EmployeeInfo = 'EmployeeInfo',
  LaborContract = 'LaborContract',
}

const isSubmit = ref(false)
const currentStep = ref(EmployeeEnum.EmployeeInfo)
const headEl = ref<any>(null)

const isPageEdit = computed(() => (route.params.id ? true : false))
const getData = async () => {
  const { result }: any = await $api(`user/staff/${route.params.id}`)
  info.value = { ...result, role_id: result?.role }
}
getData()
const submitStaffInfo = async (obj: any) => {
  const { statusCode }: any = await $api(`user/staff/${route.params.id}`, {
    method: 'PUT',
    body: obj,
  })
  if (statusCode === 200) {
    toast.add({ severity: 'success', summary: 'Successfully', detail: 'Created', life: 3000 })
    router.push(PATH_EMPLOYEES_LIST)
  }
}
</script>

<template>
  <div class="page">
    <div ref="headEl" class="page-content">
      <BreadCrumbLinks />
      <div class="box">
        <h1 class="page-heading m-0 mb-6">
          {{ isPageEdit ? `${t('common.update_employee')}` : t('common.add_employee') }}
        </h1>
        <EmployeesForm :isSubmit="isSubmit" @onSubmit="submitStaffInfo" :info="info" />
      </div>
    </div>
  </div>
</template>
