import type { ResponseType, listResponseType, listResponseTypeAll } from '~/types'
import type {
  EmployeeType,
  BodyEmployeeType,
  EmployeeDetailType,
  EmployeeParamsType,
  BodyResetLeaveDay,
} from '~/types/employee'

export default function useEmployee() {
  const PARENT_URL = '/user/staff'
  const { $api } = useNuxtApp()

  const CONTENT_EXPORT_EXCEL = [
    {
      name: 'common.employee_code',
      key: 'code',
    },
    {
      name: 'common.full_name',
      key: 'name',
    },
    {
      name: 'common.date_of_birth',
      key: 'dob',
      formatDate: 'DD/MM/YYYY',
    },
    {
      name: 'common.gender',
      key: 'textGender',
    },
    {
      name: 'common.place_of_birth',
      key: 'birthplace_address',
    },
    {
      name: 'common.ethnicity',
      key: 'ethnic.name',
    },
    {
      name: 'common.religion',
      key: 'religion.name',
    },
    {
      name: 'common.nationality',
      key: 'nationality.name',
    },
    {
      name: 'common.health_status',
      key: 'textHealthStatus',
    },
    {
      name: 'common.marital_status',
      key: 'textMaritalStatus',
    },
    {
      name: 'common.contact_phone_number',
      key: 'phone',
    },
    {
      name: 'common.id_card_number',
      key: 'citizen_id_number',
    },
    {
      name: 'common.issue_date',
      key: 'id_issuing_date',
      formatDate: 'DD/MM/YYYY',
    },
    {
      name: 'common.issue_place',
      key: 'id_issuing_place',
    },
    // Địa chỉ thường trú
    {
      name: 'common.permanent_province_city',
      key: 'permanent_province.name',
    },
    {
      name: 'common.permanent_district',
      key: 'permanent_district.name',
    },
    {
      name: 'common.permanent_ward',
      key: 'permanent_township.name',
    },
    {
      name: 'common.permanent_address_detail',
      key: 'permanent_address',
    },
    // Chỗ ở hiện nay
    {
      name: 'common.current_province_city',
      key: 'current_province.name',
    },
    {
      name: 'common.current_district',
      key: 'current_district.name',
    },
    {
      name: 'common.current_ward',
      key: 'current_township.name',
    },
    {
      name: 'common.current_address_detail',
      key: 'current_address',
    },
    {
      name: 'common.education_level',
      key: 'textEducationLevel',
    },
    {
      name: 'common.major',
      key: 'major',
    },
    {
      name: 'common.educational_institution',
      key: 'training_facility',
    },
    {
      name: 'common.training_duration',
      key: 'training_time',
    },
    {
      name: 'common.other_majors',
      key: 'other_major',
    },
    {
      name: 'common.certificates',
      key: 'certificate_of_ability',
    },
    {
      name: 'common.email',
      key: 'email',
    },
    // {
    //   name: 'common.password',
    //   key: 'password',
    // },
    {
      name: 'common.role',
      key: 'role.name',
    },
    {
      name: 'common.active',
      key: 'textActive',
    },

    // Hợp đồng
    {
      name: 'common.branch',
      key: 'branch.name',
    },
    {
      name: 'common.department',
      key: 'department.name',
    },
    {
      name: 'common.position',
      key: 'position.name',
    },
    {
      name: 'common.employment_status',
      key: 'employmentStatus',
    },
    {
      name: 'common.start_date',
      key: 'start_date',
      formatDate: 'DD/MM/YYYY',
    },
    {
      name: 'common.skip_timekeeping',
      key: 'textIsSkip',
    },
    {
      name: 'common.contract_type',
      key: 'textContractType',
    },
    {
      name: 'common.contract_start_date',
      key: 'contract_start_date',
      formatDate: 'DD/MM/YYYY',
    },
    {
      name: 'common.contract_end_date',
      key: 'contract_end_date',
      formatDate: 'DD/MM/YYYY',
    },
    {
      name: 'common.hourly_wage',
      key: 'hourly_salary',
    },
    {
      name: 'common.position_salary',
      key: 'salary_p1',
    },
    {
      name: 'common.competence_salary',
      key: 'salary_p2',
    },
    {
      name: 'common.performance_salary',
      key: 'salary_p3',
    },
    {
      name: 'common.allowance',
      key: 'textAllowances',
    },
    {
      name: 'common.personal_income_tax',
      key: 'textPersonalIncomeTax',
    },
    {
      name: 'common.dependents_count',
      key: 'tax_exemptions',
    },
    {
      name: 'common.social_insurance_number',
      key: 'health_insurance_number',
    },
    {
      name: 'common.initial_healthcare_facility',
      key: 'initial_healthcare_facility',
    },
    {
      name: 'common.bank',
      key: 'bank',
    },
    {
      name: 'common.bank_branch',
      key: 'bank_branch',
    },
    {
      name: 'common.beneficiary_name',
      key: 'bank_account_name',
    },
    {
      name: 'common.account_number',
      key: 'bank_account_number',
    },
    {
      name: 'common.tax_code',
      key: 'tax_code',
    },
    {
      name: 'common.annual_leave_days',
      key: 'textAnnualLeaveDays',
    },
    {
      name: 'common.maternity_leave_days',
      key: 'textMaternityLeaveDays',
    },
    {
      name: 'common.wedding_leave_days',
      key: 'textWeddingLeaveDays',
    },
    {
      name: 'common.bereavement_leave_days',
      key: 'textBereavementLeaveDays',
    },
  ]

  const OPTIONS_IMPORT_EXCEL = [
    {
      name: 'common.employee_code',
      key: 'code',
    },
    {
      name: 'common.full_name',
      key: 'name',
    },
    {
      name: 'common.date_of_birth',
      key: 'dob',
    },
    {
      name: 'common.gender',
      key: 'gender',
    },
    {
      name: 'common.place_of_birth',
      key: 'birthplace_address',
    },
    {
      name: 'common.ethnicity',
      key: 'ethnic',
    },
    {
      name: 'common.religion',
      key: 'religion',
    },
    {
      name: 'common.nationality',
      key: 'nationality',
    },
    {
      name: 'common.health_status',
      key: 'health_status',
    },
    {
      name: 'common.marital_status',
      key: 'marital_status',
    },
    {
      name: 'common.contact_phone_number',
      key: 'phone',
    },
    {
      name: 'common.id_card_number',
      key: 'citizen_id_number',
    },
    {
      name: 'common.issue_date',
      key: 'id_issuing_date',
    },
    {
      name: 'common.issue_place',
      key: 'id_issuing_place',
    },
    // Địa chỉ thường trú
    {
      name: 'common.permanent_province_city',
      key: 'permanent_province',
    },
    {
      name: 'common.permanent_district',
      key: 'permanent_district',
    },
    {
      name: 'common.permanent_ward',
      key: 'permanent_township',
    },
    {
      name: 'common.permanent_address_detail',
      key: 'permanent_address',
    },
    // Chỗ ở hiện nay
    {
      name: 'common.current_province_city',
      key: 'current_province',
    },
    {
      name: 'common.current_district',
      key: 'current_district',
    },
    {
      name: 'common.current_ward',
      key: 'current_township',
    },
    {
      name: 'common.current_address_detail',
      key: 'current_address',
    },
    {
      name: 'common.education_level',
      key: 'education_level',
    },
    {
      name: 'common.major',
      key: 'major',
    },
    {
      name: 'common.educational_institution',
      key: 'training_facility',
    },
    {
      name: 'common.training_duration',
      key: 'training_time',
    },
    {
      name: 'common.other_majors',
      key: 'other_major',
    },
    {
      name: 'common.certificates',
      key: 'certificate_of_ability',
    },
    {
      name: 'common.email',
      key: 'email',
    },
    // {
    //   name: 'common.password',
    //   key: 'password',
    // },
    {
      name: 'common.role',
      key: 'role',
    },

    // Hợp đồng
    {
      name: 'common.branch',
      key: 'branch',
    },
    {
      name: 'common.department',
      key: 'department',
    },
    {
      name: 'common.position',
      key: 'position',
    },
    {
      name: 'common.employment_status',
      key: 'status',
    },
    {
      name: 'common.start_date',
      key: 'start_date',
    },
    // {
    //   name: 'common.skip_timekeeping',
    //   key: 'is_skip',
    // },
    {
      name: 'common.contract_type',
      key: 'contract_type',
    },
    {
      name: 'common.contract_start_date',
      key: 'contract_start_date',
    },
    {
      name: 'common.contract_end_date',
      key: 'contract_end_date',
    },
    {
      name: 'common.hourly_wage',
      key: 'hourly_salary',
    },
    {
      name: 'common.position_salary',
      key: 'salary_p1',
    },
    {
      name: 'common.competence_salary',
      key: 'salary_p2',
    },
    {
      name: 'common.performance_salary',
      key: 'salary_p3',
    },
    {
      name: 'common.allowance',
      key: 'allowance',
    },
    {
      name: 'common.personal_income_tax',
      key: 'tax',
    },
    {
      name: 'common.dependents_count',
      key: 'tax_exemptions',
    },
    {
      name: 'common.social_insurance_number',
      key: 'health_insurance_number',
    },
    {
      name: 'common.initial_healthcare_facility',
      key: 'initial_healthcare_facility',
    },
    {
      name: 'common.bank',
      key: 'bank',
    },
    {
      name: 'common.bank_branch',
      key: 'bank_branch',
    },
    {
      name: 'common.beneficiary_name',
      key: 'bank_account_name',
    },
    {
      name: 'common.account_number',
      key: 'bank_account_number',
    },
    {
      name: 'common.tax_code',
      key: 'tax_code',
    },
  ]

  const REQUIRED_FIELD_IMPORT_EXCEL = [
    {
      name: 'common.full_name',
      key: 'name',
    },
    {
      name: 'common.gender',
      key: 'gender',
    },
    {
      name: 'common.date_of_birth',
      key: 'dob',
    },
    {
      name: 'common.email',
      key: 'email',
    },
  ]

  const getEmployees = (params?: EmployeeParamsType) => {
    return $api<listResponseTypeAll>(PARENT_URL, {
      method: 'GET',
      params,
    })
  }

  const getEmployeesForDayoff = (params?: EmployeeParamsType) => {
    return $api<ResponseType<any>>(`${PARENT_URL}/leave`, {
      method: 'GET',
      params,
    })
  }

  const getEmployeeById = (id: string) => {
    return $api<ResponseType<EmployeeDetailType>>(`${PARENT_URL}/${id}`, {
      method: 'GET',
    })
  }

  const createEmployee = (body: BodyEmployeeType & { email: string }) => {
    return $api(`${PARENT_URL}/create`, {
      method: 'POST',
      body,
    })
  }

  const updateEmployeeById = (id: string, body: BodyEmployeeType) => {
    return $api(`${PARENT_URL}/${id}`, {
      method: 'PUT',
      body,
    })
  }

  const deleteEmployeeById = (id: string) => {
    return $api(`${PARENT_URL}/${id}`, {
      method: 'DELETE',
    })
  }

  const importExcelEmployees = (data: BodyEmployeeType[]) => {
    return $api(`${PARENT_URL}/import`, {
      method: 'POST',
      body: {
        data,
      },
    })
  }

  const resetLeaveDay = (body: BodyResetLeaveDay) => {
    return $api(`${PARENT_URL}/leave/reset`, {
      method: 'POST',
      body,
    })
  }

  const dateResetLeave = (body: { start_date: string | null; end_date: string | null }) => {
    return $api(`/leave-config`, {
      method: 'POST',
      body,
    })
  }

  const getEmployeesExport = (params?: EmployeeParamsType) => {
    return $api<ResponseType<EmployeeType[]>>(`${PARENT_URL}/export`, {
      method: 'GET',
      params,
    })
  }

  return {
    CONTENT_EXPORT_EXCEL,
    OPTIONS_IMPORT_EXCEL,
    REQUIRED_FIELD_IMPORT_EXCEL,
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployeeById,
    deleteEmployeeById,
    importExcelEmployees,
    resetLeaveDay,
    getEmployeesForDayoff,
    getEmployeesExport,
    dateResetLeave,
  }
}
