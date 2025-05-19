import type { GENDER_OPTIONS } from '~/constant'

export type LocaleType = 'vi' | 'en'

export type ParamsGetListType = {
  page?: number
  limit?: number | string
  search?: string
}

export type PaginationType = {
  current_page: number
  limit: number
  total: number
  total_page: number
}

export type ResponseType<T = Record<string, any>> = {
  statusCode: number
  result: T
}

export type ResponseTypeList<T = Record<string, any>> = {
  statusCode: number
  result: T
  page: number
  total: number
}

export type ResponseTypeListWithTotalMoney<T> = ResponseTypeList<T> & { total_money: number }

export type ResponseDataType<T = Record<string, any>> = {
  statusCode: number
  data: T
}

export type MediaType = {
  author: string
  created_at: string
  file_name: string
  key: string
  mime_type: string
  name: string
  size: number
  url: string
  _id: string
}

export type NavItemType = {
  title: string
  key: string
  permissionKey?: string
  icon: string
  iconActive: string
  isCollapse?: boolean
  sub?: SubItemType[]
  to?: string
}

export type SubItemType = {
  title: string
  key: string
  permissionKey?: string
  to: string
}

export type RefreshTokenResponseType = {
  result: { access_token: string; refresh_token: string }
}

export type Error = {
  code?: number
  message?: string
  key?: string
}

export type CountryType = {
  _id: string
  name: string
}

export type ProvinceType = {
  _id: string
  name: string
}

export type DistrictType = {
  _id: string
  name: string
}

export type TownshipType = {
  _id: string
  name: string
}

export type GenderType = null | (typeof GENDER_OPTIONS)[number]['value']
