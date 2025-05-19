import type { GenderType } from '~/types'
import type { OrderProductType } from '~/types/sale'
import type { ProcessStepType, TestTypeChemicalItemType } from '~/types/settings'
import type { TestReportTypeType } from '~/types/testReport'

// Patient
export const PATIENT_FORM_INIT = {
  name: '',
  phone: '',
  personal_id: '',
  email: '',
  gender: 0 as GenderType,
  birthday: null as null | string | Date,
  blood_type: '',
  country: null as null | string,
  province: null as null | string,
  district: null as null | string,
  township: null as null | string,
  address: '',
  career: '',
  responsible: null as null | string, // phu trach
}

// Test Report
export const TEST_REPORT_FORM_INIT = {
  name: '',
  patient: null as string | null,
  test_type: null as string | null,
  process: null as string | null,
  note: '',
  specimen: null as string | null, // mẫu
  specimen_by: null as string | null, // ng lấy mẫu
  take_time: null as null | string | Date,
  result_time: null as null | string | Date,
  type: null as null | string,
}

// Employee
export const ROLE_FORM_INIT = {
  name: '',
  permissions: [],
  is_admin: false,
  is_active: true,
}

export const EMPLOYEE_FROM_INIT = {
  avatar: '',
  name: '',
  phone: '',
  gender: 0 as GenderType,
  province: null,
  district: null,
  township: null,
  address: '',
  email: '',
  password: '' as undefined | string,
  role_id: '',
  is_active: true,
}

export const KPI_FORM_INIT = {
  staff: null as null | string,
  kpi: null as null | number,
  include_order: false,
  include_test: false,
  from: null as null | string | Date,
  to: null as null | string | Date,
  is_active: true,
}

// Sale
export const ORDER_FORM_INIT = {
  name: '',
  customer_id: null as null | string,
  sale_date: null as null | string | Date,
  payment_date: null as null | string | Date,
  products: [] as OrderProductType[],
  phone: '',
  email: '',
  province: null as null | string,
  district: null as null | string,
  township: null as null | string,
  address: '',
  note: '',
}

export const CUSTOMER_FORM_INIT = {
  name: '',
  phone: '',
  email: null,
  province: null as null | string,
  district: null as null | string,
  township: null as null | string,
  address: '',
  note: '',
}

// Settings
export const CHEMICAL_FORM_INIT = {
  name: '',
  trade_name: '',
  quantity: null,
  unit: '',
  price: null,
  brand: '',
  country: null,
  description: '',
  content: '',
  is_active: true,
}

export const TEST_TYPE_FORM_INIT = {
  name: '',
  price: null,
  needs: [] as TestTypeChemicalItemType[],
  description: '',
  is_active: true,
}

export const SPECIMEN_FORM_INIT = {
  name: '',
  is_active: true,
}

export const UNIT_FORM_INIT = {
  name: '',
  is_active: true,
}

export const DEPARTMENT_FORM_INIT = {
  name: '',
  // test_type: '',
  description: '',
  content: '',
  staffs: [] as { _id: string }[],
  is_active: true,
}

export const PROCESS_FORM_INIT = {
  name: '',
  description: '',
  steps: [] as ProcessStepType[],
  is_active: true,
}
