import type { ROLE_FORM_INIT, EMPLOYEE_FROM_INIT } from '~/constant/formInit'
import type { DistrictType, GenderType, ParamsGetListType, ProvinceType, TownshipType } from '.'

export type RoleBodyType = typeof ROLE_FORM_INIT

export type RoleType = {
  _id: string
  name: string
  permissions: string[]
  is_admin: boolean
  is_active: boolean
}

export type PermissionType = {
  name: string
  key: string
  value: string
}

export type EmployeeParamsGetList = ParamsGetListType & {
  is_active?: string
  role_id?: string
  department_id?: string
}

export type EmployeeBodyType = typeof EMPLOYEE_FROM_INIT

export type EmployeeType = {
  _id: string
  avatar: string
  name: string
  phone: string
  gender: null | GenderType
  province: ProvinceType
  district: DistrictType
  township: TownshipType
  address: string
  email: string
  password: undefined | string
  role: {
    _id: string
    name: string
  }
  is_active: true
}
