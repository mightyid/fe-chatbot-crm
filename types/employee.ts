import type { ParamsGetListType } from '~/types'

export type EmployeeParamsType = ParamsGetListType & {
  branch?: string
  department?: string
  position?: string
  contract_type?: number
  is_active?: number
  is_role?: number
}

export type EmployeeType = {
  password?: string | undefined
  avatar?: string
  code: string
  dob?: string
  name: string
  gender?: string
  phone?: string
  role?: string
  is_admin?: boolean
  is_active?: boolean
  _id: string
  department?: string
  position?: string
  seniority?: string
  seniority_en?: string
  total_annual_leave?: number
  total_bereavement_leave?: number
  total_marriage_leave?: number
  total_maternity_leave?: number
}

export type BodyEmployeeType = {
  code?: string
  password?: string | undefined
  avatar?: string
  name?: string
  phone?: string
  role?: string
  is_admin?: boolean
  is_active?: boolean
  gender?: number | null
  dob?: string // Date of birth
  birthplace_address?: string
  ethnic?: string
  religion?: string
  nationality?: string
  health_status?: number | null // 1?: Khỏe mạnh, 2?: Có bệnh nền, 3?: Khác
  marital_status?: number | null // 1?: Đã kết hôn, 2?: Độc thân, 3?: Góa, 4?: Ly thân, 5?: Ly hôn
  email?: string
  branch?: string
  department?: string
  position?: string
  citizen_id_number?: string
  id_issuing_date?: string
  id_issuing_place?: string
  id_has_chip?: boolean
  permanent_province?: string // Nơi thường trú - Tỉnh/Thành phố
  permanent_district?: string // Nơi thường trú - Quận/Huyện
  permanent_township?: string // Nơi thường trú - Phường/Xã
  permanent_address?: string // Nơi thường trú - Tổ/Thôn/Xóm
  current_province?: string // Nơi thường trú - Tỉnh/Thành phố
  current_district?: string // Nơi thường trú - Quận/Huyện
  current_township?: string // Nơi thường trú - Phường/Xã
  current_address?: string // Nơi thường trú - Tổ/Thôn/Xóm,
  education_level?: number | null
  major?: string
  training_facility?: string
  training_time?: string
  status?: number | null // 1?: Đang làm việc, 2?: Nghỉ việc, 3?: Nghỉ hưu, 4?: Nghỉ thai sản, 5?: Nghỉ phép, 6?: Nghỉ không lương, 7?: Nghỉ việc tạm thời
  start_date?: string
  contract_type?: number | null // 1?: Hợp đồng lao động, 2?: Hợp đồng thời vụ, 3?: Hợp đồng thực tập, 4?: Hợp đồng dài hạn, 5?: Hợp đồng ngắn hạn
  contract_start_date?: string
  contract_end_date?: string
  salary_p1?: number
  salary_p2?: number
  salary_p3?: number
  hourly_salary?: number
  allowances?: any[]
  tax_exemptions?: number | null
  other_duty_fee?: string
  number_working_day?: number
  health_insurance_number?: string
  initial_healthcare_facility?: string // Nơi KCB ban đầu
  bank?: string // Ngân hàng - NGAN_HANG
  bank_branch?: string // Chi nhánh ngân hàng
  bank_account_name?: string
  bank_account_number?: string // Số tài khoản
  tax_code?: string
  is_company_pay?: boolean
  is_auto_pay?: boolean
  is_skip?: boolean
  other_major?: string
  certificate_of_ability?: string
  total_annual_leave?: number // Ngày nghỉ phép năm
  sick_leave?: number // Ngày nghỉ ốm
  total_maternity_leave?: number // Ngày nghỉ thai sản
  total_marriage_leave?: number // Ngày nghỉ kết hôn
  total_bereavement_leave?: number // Ngày nghỉ tang gia
  manager?: string
}

export type EmployeeDetailType = {
  _id?: string
  avatar?: string
  code?: string
  name?: string
  gender?: number
  dob?: string
  birthplace_address?: string
  ethnic?: {
    _id?: string
    code?: string
    name?: string
    orther_name?: string
    is_active?: boolean
  }
  religion?: {
    _id?: string
    code?: string
    name?: string
    is_active?: boolean
  }
  nationality?: {
    _id?: string
    code?: string
    name?: string
    is_active?: boolean
  }
  health_status?: number
  marital_status?: number
  phone?: string
  email?: string
  password?: string | undefined
  branch?: Record<string, string> | null
  department?: Record<string, string> | null
  position?: Record<string, string> | null
  role?: {
    _id?: string
    name?: string
    is_admin?: boolean
    permissions?: string[]
    created_at?: string
    branches?: string[]
    updated_at?: string
  }
  citizen_id_number?: string
  id_issuing_date?: string
  id_issuing_place?: string
  id_has_chip?: boolean
  permanent_province?: {
    _id?: string
    country?: string
    name?: string
    code?: string
    is_active?: boolean
  }
  permanent_district?: {
    _id?: string
    name?: string
    code?: string
    is_active?: boolean
    province?: string
  }
  permanent_township?: {
    _id?: string
    name?: string
    code?: string
    is_active?: boolean
    district?: string
  }
  permanent_address?: string
  current_province?: {
    _id?: string
    country?: string
    name?: string
    code?: string
    is_active?: boolean
  }
  current_district: {
    _id?: string
    name?: string
    code?: string
    is_active?: boolean
    province?: string
  }
  current_township: {
    _id?: string
    name?: string
    code?: string
    is_active?: boolean
    district?: string
  }
  current_address?: string
  education_level?: number | null
  major?: string
  training_facility?: string
  training_time?: string
  status?: number | null
  start_date?: string
  contract_type?: number | null
  contract_start_date?: string
  contract_end_date?: string
  salary_p1?: number
  salary_p2?: number
  salary_p3?: number
  hourly_salary?: number
  allowances?: any[]
  // other_duty_fee: {
  //   _id: '671b0ac0649df67dfba11359'
  //   name: 'Thu nhập từ chuyển nhượng bất động sản'
  //   code: '01'
  //   percent: 0.1
  //   is_active: true
  //   sort_order: 0
  // }
  health_insurance_number?: string
  initial_healthcare_facility?: string
  bank?: string
  bank_branch?: string
  bank_account_name?: string
  bank_account_number?: string
  is_auto_pay: boolean
  is_company_pay: boolean
  tax_exemptions: number | null
  tax_code?: string
  is_active?: true
  is_skip?: false
  other_major?: string
  certificate_of_ability?: string
  last_seen_notification_id?: string
  start_notification_id?: string
  created_at?: string
  total_annual_leave?: number // Ngày nghỉ phép năm
  sick_leave?: number // Ngày nghỉ ốm
  total_maternity_leave?: number // Ngày nghỉ thai sản
  total_marriage_leave?: number // Ngày nghỉ kết hôn
  total_bereavement_leave?: number // Ngày nghỉ tang gia
  total_access: Record<string, any>
  manager: Record<string, any>
}
export interface BodyResetLeaveDay {
  employee_ids: string[]
  type: 'update' | 'reset'
  total_annual_leave?: number
  total_maternity_leave?: number
  total_marriage_leave?: number
  total_bereavement_leave?: number
}
