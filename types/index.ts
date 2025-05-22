type LocaleType = 'en' | 'vi'

type ParamsGetListType = {
  page?: number
  limit?: number | string
  search?: string
}

type PaginationType = {
  current_page: number
  limit: number
  total: number
  total_page: number
}

type ResponseType<T = Record<string, any>> = {
  statusCode: number
  result: T
}

type ResponseDataType<T = Record<string, any>> = {
  statusCode: number
  data: T
}

type listResponseType<K extends string, T> = {
  statusCode: number
  result: {
    current_page: number
    limit: number
    total: number
    total_page: number
  } & { [key in K]: T }
}
type listResponseTypeAll = {
  statusCode: number
  total: number
  total_page: number
  result: any[] | object
}

type MediaType = {
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

export type {
  LocaleType,
  PaginationType,
  ParamsGetListType,
  ResponseType,
  listResponseType,
  ResponseDataType,
  MediaType,
  listResponseTypeAll,
}
