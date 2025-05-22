<script setup lang="ts">
import EmployeesForm from '~/components/Employees/EmployeesForm.vue'
import { PATH_EMPLOYEES_LIST } from '~/constant/routerPath'

definePageMeta({
  titleBreadCrumb: 'button.add_new',
  permission: 'create_employee',
})

const { t } = useI18n()
const { $moment } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const employeeServices = useEmployee()

enum EmployeeEnum {
  EmployeeInfo = 'EmployeeInfo',
  LaborContract = 'LaborContract',
}

const isSubmit = ref(false)
const currentStep = ref(EmployeeEnum.EmployeeInfo)
const headEl = ref<any>(null)

const isPageEdit = computed(() => (route.params.id ? true : false))

const submitStaffInfo = async () => {
  headEl?.value?.scrollIntoView()
  currentStep.value = EmployeeEnum.LaborContract
}

const submitLaborContract = async () => {
  try {
    isSubmit.value = true

    const { statusCode } = await employeeServices.createEmployee({})

    if (statusCode >= 200 && statusCode < 300) {
      toast.add({ severity: 'success', summary: t('common.success'), detail: t('common.added'), life: 3000 })
      router.push(PATH_EMPLOYEES_LIST)
    }
  } catch (error) {
    console.log(error)
  } finally {
    isSubmit.value = false
  }
}

const backToEmployeeInfo = () => {
  headEl?.value?.scrollIntoView()
  currentStep.value = EmployeeEnum.EmployeeInfo
}
</script>

<template>
  <div class="page">
    <div ref="headEl" class="page-content">
      <BreadCrumb />
      <div class="box">
        <h1 class="page-heading m-0 mb-6">
          {{ isPageEdit ? `${t('common.update_employee')}` : t('common.add_employee') }}
        </h1>
        <EmployeesForm :isSubmit="isSubmit" @onSubmit="submitStaffInfo" />
      </div>
    </div>
  </div>
</template>
