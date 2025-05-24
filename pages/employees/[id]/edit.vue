<script setup lang="ts">
import EmployeesForm from '~/components/Employees/EmployeesForm.vue'
import { PATH_EMPLOYEES_LIST } from '~/constant/routerPath'

definePageMeta({
  titleBreadCrumb: 'button.add_new',
  permission: 'update_employee',
})

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const employeeServices = useEmployee()
const { $moment } = useNuxtApp()

enum EmployeeEnum {
  EmployeeInfo = 'EmployeeInfo',
  LaborContract = 'LaborContract',
}

const form = ref<any>({
  avatar: '',
  code: '',
  name: '',
  gender: null, //Nam, Nữ Khác
  dob: '', // Date of birth
  birthplace_address: '',
  ethnic: '',
  religion: '',
  nationality: '',
  health_status: null, // 1: Khỏe mạnh, 2: Có bệnh nền, 3: Khác
  marital_status: null, // 1: Đã kết hôn, 2: Độc thân, 3: Góa, 4: Ly thân, 5: Ly hôn
  phone: '',
  email: '',
  password: '',
  branch: null,
  department: null,
  position: '',
  role: '',
  citizen_id_number: '',
  id_issuing_date: '',
  id_issuing_place: '',
  id_has_chip: false,
  permanent_province: '', // Nơi thường trú - Tỉnh/Thành phố
  permanent_district: '', // Nơi thường trú - Quận/Huyện
  permanent_township: '', // Nơi thường trú - Phường/Xã
  permanent_address: '', // Nơi thường trú - Tổ/Thôn/Xóm
  current_province: '', // Nơi thường trú - Tỉnh/Thành phố
  current_district: '', // Nơi thường trú - Quận/Huyện
  current_township: '', // Nơi thường trú - Phường/Xã
  current_address: '', // Nơi thường trú - Tổ/Thôn/Xóm,
  education_level: null,
  major: '',
  training_facility: '',
  training_time: '',
  status: null, // 1: Đang làm việc, 2: Nghỉ việc, 3: Nghỉ hưu, 4: Nghỉ thai sản, 5: Nghỉ phép, 6: Nghỉ không lương, 7: Nghỉ việc tạm thời
  start_date: '',
  contract_type: null, // 1: Hợp đồng lao động, 2: Hợp đồng thời vụ, 3: Hợp đồng thực tập, 4: Hợp đồng dài hạn, 5: Hợp đồng ngắn hạn
  contract_start_date: '',
  contract_end_date: '',
  salary_p1: null,
  salary_p2: null,
  salary_p3: null,
  hourly_salary: null,
  allowances: [],
  tax_exemptions: null,
  other_duty_fee: '',
  number_working_day: null,
  health_insurance_number: '',
  initial_healthcare_facility: '', // Nơi KCB ban đầu
  bank: '', // Ngân hàng - NGAN_HANG
  bank_branch: '', // Chi nhánh ngân hàng
  bank_account_name: '',
  bank_account_number: '', // Số tài khoản
  tax_code: '',
  is_company_pay: false,
  is_auto_pay: false,
  tax: null,
  is_active: false,
  is_skip: false,
  order_major: '',
  manager: '',
  certificate_of_ability: '',
  total_annual_leave: 0, // Ngày nghỉ phép năm
  sick_leave: 0, // Ngày nghỉ ốm
  total_maternity_leave: 0, // Ngày nghỉ thai sản
  total_marriage_leave: 0, // Ngày nghỉ kết hôn
  total_bereavement_leave: 0, // Ngày nghỉ tang gia
})
const isLoading = ref(false)
const isSubmit = ref(false)
const currentStep = ref(EmployeeEnum.EmployeeInfo)
const headEl = ref<any>(null)

const isPageEdit = computed(() => (route.params.id ? true : false))

const getEmployeeById = async () => {
  try {
    isLoading.value = true
    const { statusCode, result } = await employeeServices.getEmployeeById(route.params.id as string)

    const mapAllowances = result?.allowances?.map((item) => item?._id)

    form.value = {
      avatar: result?.avatar || '',
      code: result?.code || '',
      name: result?.name || '',
      gender: result?.gender || null, //Nam, Nữ Khác
      dob: result?.dob ? $moment(result?.dob).format() : '', // Date of birtvalue.h
      birthplace_address: result?.birthplace_address || '',
      ethnic: result?.ethnic?._id || '',
      religion: result?.religion?._id || '',
      nationality: result?.nationality?._id || '',
      health_status: result?.health_status || null, // 1: Khỏe mạnh, 2: Có bệnh nền, 3: Khác
      marital_status: result?.marital_status || null, // 1: Đã kết hôn, 2: Độc thân, 3: Góa, 4: Ly thân, 5: Ly hôn
      phone: result?.phone || '',
      email: result?.email || '',
      // password: result?.password || '',
      branch: result?.branch?._id || '',
      department: result?.department?._id || '',
      position: result?.position?._id || '',
      role: result?.role?._id || '',
      citizen_id_number: result?.citizen_id_number || '',
      id_issuing_date: result?.id_issuing_date ? $moment(result?.id_issuing_date).format() : '',
      id_issuing_place: result?.id_issuing_place || '',
      id_has_chip: result?.id_has_chip ?? false,
      permanent_province: result?.permanent_province?._id || '', // Nơi thường trú - Tỉnh/Thành phvalue.ố
      permanent_district: result?.permanent_district?._id || '', // Nơi thường trú - Quận/Huyệvalue.n
      permanent_township: result?.permanent_township?._id || '', // Nơi thường trú - Phường/Xvalue.ã
      permanent_address: result?.permanent_address || '', // Nơi thường trú - Tổ/Thôn/Xóvalue.m
      current_province: result?.current_province?._id || '', // Nơi thường trú - Tỉnh/Thành phvalue.ố
      current_district: result?.current_district?._id || '', // Nơi thường trú - Quận/Huyệvalue.n
      current_township: result?.current_township?._id || '', // Nơi thường trú - Phường/Xvalue.ã
      current_address: result?.current_address || '', // Nơi thường trú - Tổ/Thôn/Xómvalue.,
      education_level: result?.education_level || null,
      major: result?.major || '',
      training_facility: result?.training_facility || '',
      training_time: result?.training_time || '',
      status: result?.status || null, // 1: Đang làm việc, 2: Nghỉ việc, 3: Nghỉ hưu, 4: Nghỉ thai sản, 5: Nghỉ phép, 6: Nghỉ không lương, 7: Nghỉ việc tạm thời
      start_date: result?.start_date ? $moment(result?.start_date).format() : '',
      contract_type: result?.contract_type || null, // 1: Hợp đồng lao động, 2: Hợp đồng thời vụ, 3: Hợp đồng thực tập, 4: Hợp đồng dài hạn, 5: Hợp đồng ngắn hạn
      contract_start_date: result?.contract_start_date ? $moment(result?.contract_start_date).format() : '',
      contract_end_date: result?.contract_end_date ? $moment(result?.contract_end_date).format() : '',
      salary_p1: result?.salary_p1 || 0,
      salary_p2: result?.salary_p2 || 0,
      salary_p3: result?.salary_p3 || 0,
      hourly_salary: result?.hourly_salary || 0,
      allowances: mapAllowances || [],
      // other_duty_fee: result?.other_duty_fee || '',
      // number_working_day: result?.number_working_day || 0,
      health_insurance_number: result?.health_insurance_number || '',
      initial_healthcare_facility: result?.initial_healthcare_facility || '', // Nơi KCB ban đầu
      bank: result?.bank || '', // Ngân hàng - NGAN_HANG
      bank_branch: result?.bank_branch || '', // Chi nhánh ngân hàng
      bank_account_name: result?.bank_account_name || '',
      bank_account_number: result?.bank_account_number || '', // Số tài khoản
      tax_code: result?.tax_code || '',
      tax: result?.is_company_pay ? 2 : result?.is_auto_pay ? 1 : null,
      tax_exemptions: result?.tax_exemptions || null,
      is_active: result?.is_active ?? false,
      is_skip: result?.is_skip ?? false,
      other_major: result?.other_major || '',
      manager: result?.manager?._id || '',
      certificate_of_ability: result?.certificate_of_ability || '',
      total_annual_leave: result?.total_annual_leave, // Ngày nghỉ phép năm
      sick_leave: result?.sick_leave, // Ngày nghỉ ốm
      total_maternity_leave: result?.total_maternity_leave, // Ngày nghỉ thai sản
      total_marriage_leave: result?.total_marriage_leave, // Ngày nghỉ kết hôn
      total_bereavement_leave: result?.total_bereavement_leave, // Ngày nghỉ tang gia
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
getEmployeeById()

const submitStaffInfo = async () => {
  headEl?.value?.scrollIntoView()
  currentStep.value = EmployeeEnum.LaborContract
}

const updateStaffInfomation = async () => {
  try {
    isSubmit.value = true

    const { statusCode } = await employeeServices.updateEmployeeById(route.params.id as string, {
      avatar: form.value.avatar || '',
      code: form.value.code || '',
      name: form.value.name || '',
      gender: form.value.gender || null, //Nam, Nữ Khác
      dob: form.value.dob ? $moment(form.value.dob).format('YYYY-MM-DD') : '', // Date of birtvalue.h
      birthplace_address: form.value.birthplace_address || '',
      ethnic: form.value.ethnic || '',
      religion: form.value.religion || '',
      nationality: form.value.nationality || '',
      health_status: form.value.health_status || null, // 1: Khỏe mạnh, 2: Có bệnh nền, 3: Khác
      marital_status: form.value.marital_status || null, // 1: Đã kết hôn, 2: Độc thân, 3: Góa, 4: Ly thân, 5: Ly hôn
      phone: form.value.phone || '',
      email: form.value.email || '',
      password: form.value.password ? form.value.password : undefined,
      branch: form.value.branch || null,
      department: form.value.department || null,
      position: form.value.position || '',
      role: form.value.role || '',
      citizen_id_number: form.value.citizen_id_number || '',
      id_issuing_date: form.value.id_issuing_date ? $moment(form.value.id_issuing_date).format('YYYY-MM-DD') : '',
      id_issuing_place: form.value.id_issuing_place || '',
      id_has_chip: form.value.id_has_chip ?? false,
      permanent_province: form.value.permanent_province || null, // Nơi thường trú - Tỉnh/Thành phvalue.ố
      permanent_district: form.value.permanent_district || null, // Nơi thường trú - Quận/Huyệvalue.n
      permanent_township: form.value.permanent_township || null, // Nơi thường trú - Phường/Xvalue.ã
      permanent_address: form.value.permanent_address || '', // Nơi thường trú - Tổ/Thôn/Xóvalue.m
      current_province: form.value.current_province || null, // Nơi thường trú - Tỉnh/Thành phvalue.ố
      current_district: form.value.current_district || null, // Nơi thường trú - Quận/Huyệvalue.n
      current_township: form.value.current_township || null, // Nơi thường trú - Phường/Xvalue.ã
      current_address: form.value.current_address || '', // Nơi thường trú - Tổ/Thôn/Xómvalue.,
      education_level: form.value.education_level || null,
      major: form.value.major || '',
      training_facility: form.value.training_facility || '',
      training_time: form.value.training_time || '',
      status: form.value.status || null, // 1: Đang làm việc, 2: Nghỉ việc, 3: Nghỉ hưu, 4: Nghỉ thai sản, 5: Nghỉ phép, 6: Nghỉ không lương, 7: Nghỉ việc tạm thời
      start_date: form.value.start_date ? $moment(form.value.start_date).format('YYYY-MM-DD') : '',
      contract_type: form.value.contract_type || null, // 1: Hợp đồng lao động, 2: Hợp đồng thời vụ, 3: Hợp đồng thực tập, 4: Hợp đồng dài hạn, 5: Hợp đồng ngắn hạn
      contract_start_date: form.value.contract_start_date
        ? $moment(form.value.contract_start_date).format('YYYY-MM-DD')
        : '',
      contract_end_date: form.value.contract_end_date ? $moment(form.value.contract_end_date).format('YYYY-MM-DD') : '',
      salary_p1: form.value.salary_p1 || 0,
      salary_p2: form.value.salary_p2 || 0,
      salary_p3: form.value.salary_p3 || 0,
      hourly_salary: form.value.hourly_salary || 0,
      allowances: form.value.allowances || [],
      other_duty_fee: form.value.other_duty_fee || '',
      number_working_day: form.value.number_working_day || 0,
      health_insurance_number: form.value.health_insurance_number || '',
      initial_healthcare_facility: form.value.initial_healthcare_facility || '', // Nơi KCB ban đầvalue.u
      bank: form.value.bank || '', // Ngân hàng - NGAN_HANvalue.G
      bank_branch: form.value.bank_branch || '', // Chi nhánh ngân hànvalue.g
      bank_account_name: form.value.bank_account_name || '',
      bank_account_number: form.value.bank_account_number || '', // Số tài khoảvalue.n
      tax_code: form.value.tax_code || '',
      is_company_pay: form.value.tax == 2 ? true : false,
      is_auto_pay: form.value.tax == 1 ? true : false,
      tax_exemptions: form.value.tax_exemptions || 0,
      is_active: form.value.is_active ?? false,
      is_skip: form.value.is_skip ?? false,
      other_major: form.value.other_major || '',
      manager: form.value.manager || null,
      certificate_of_ability: form.value.certificate_of_ability || '',
      total_annual_leave: form.value.total_annual_leave, // Ngày nghỉ phép năm
      sick_leave: form.value.sick_leave, // Ngày nghỉ ốm
      total_maternity_leave: form.value.total_maternity_leave, // Ngày nghỉ thai sản
      total_marriage_leave: form.value.total_marriage_leave, // Ngày nghỉ kết hôn
      total_bereavement_leave: form.value.total_bereavement_leave, // Ngày nghỉ tang gia
    })

    if (statusCode >= 200 && statusCode < 300) {
      toast.add({ severity: 'success', summary: t('common.success'), detail: t('common.updated'), life: 3000 })
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

onMounted(() => {
  if (route.query?.redirect === 'contract') {
    currentStep.value = EmployeeEnum.LaborContract
  }
})
</script>

<template>
  <div class="page">
    <div ref="headEl" class="page-content">
      <BreadCrumbLinks />
      <div class="box">
        <h1 class="page-heading m-0 mb-6">
          {{ isPageEdit ? `${t('common.update_employee')}` : t('common.add_employee') }}
        </h1>

        <div class="mb-6 flex justify-center items-center gap-6">
          <div class="text-base font-semibold c-primary flex items-center gap-2">
            <span
              class="w-[28px] h-[28px] flex justify-center items-center border border-solid border-primary rounded-[50%]"
              v-if="currentStep === EmployeeEnum.EmployeeInfo"
            >
              1
            </span>

            <span v-else>
              <img class="w-[28px] h-[28px]" src="~/assets/icons/i-tick-primary-circle.svg" />
            </span>
            <span> {{ t('common.employee_information') }} </span>
          </div>

          <div
            :class="['flex-1 h-[2px]  bg-black-40', currentStep === EmployeeEnum.LaborContract ? 'bg-primary' : '']"
          ></div>

          <div
            class="text-base font-semibold c-black-50 flex items-center gap-2"
            :class="currentStep === EmployeeEnum.LaborContract ? '!c-primary' : ''"
          >
            <span
              class="w-[28px] h-[28px] flex justify-center items-center border border-solid border-black-50 rounded-[50%]"
              :class="currentStep === EmployeeEnum.LaborContract ? 'border-primary' : ''"
            >
              2
            </span>
            <span> {{ t('common.labor_contract') }} </span>
          </div>
        </div>

        <EmployeesForm
          :isLoadingData="isLoading"
          v-model:avatar="form.avatar"
          v-model:code="form.code"
          v-model:name="form.name"
          v-model:dob="form.dob"
          v-model:gender="form.gender"
          v-model:email="form.email"
          v-model:phone="form.phone"
          v-model:password="form.password"
          v-model:role_id="form.role_id"
          v-model:is_admin="form.is_admin"
          v-model:is_active="form.is_active"
          v-model:birthplace_address="form.birthplace_address"
          v-model:certificate_of_ability="form.certificate_of_ability"
          v-model:citizen_id_number="form.citizen_id_number"
          v-model:current_address="form.current_address"
          v-model:current_district="form.current_district"
          v-model:current_province="form.current_province"
          v-model:current_township="form.current_township"
          v-model:education_level="form.education_level"
          v-model:ethnic="form.ethnic"
          v-model:health_status="form.health_status"
          v-model:id_has_chip="form.id_has_chip"
          v-model:id_issuing_date="form.id_issuing_date"
          v-model:id_issuing_place="form.id_issuing_place"
          v-model:major="form.major"
          v-model:marital_status="form.marital_status"
          v-model:nationality="form.nationality"
          v-model:other_major="form.other_major"
          v-model:permanent_address="form.permanent_address"
          v-model:permanent_district="form.permanent_district"
          v-model:permanent_province="form.permanent_province"
          v-model:permanent_township="form.permanent_township"
          v-model:religion="form.religion"
          v-model:role="form.role"
          v-model:training_facility="form.training_facility"
          v-model:training_time="form.training_time"
          v-model:is_skip="form.is_skip"
          v-model:manager="form.manager"
          @onSubmit="submitStaffInfo"
          v-if="currentStep === EmployeeEnum.EmployeeInfo"
        />
      </div>
    </div>
  </div>
</template>
