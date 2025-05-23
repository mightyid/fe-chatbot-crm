import type { ResponseType, listResponseType } from '~/types'
import type { RoleType, BodyRoleType, ParamsListType } from '~/types/settings'

export default function useRole() {
  const PARENT_URL = '/user/role'
  const { $api } = useNuxtApp()

  const getRoleList = (params?: ParamsListType) => {
    return $api(`${PARENT_URL}`, {
      method: 'GET',
      params,
    })
  }

  const getRoleById = (id: string) => {
    return $api<ResponseType<RoleType>>(`${PARENT_URL}/${id}`, {
      method: 'GET',
    })
  }

  const createRole = (body: BodyRoleType) => {
    return $api(`${PARENT_URL}`, {
      method: 'POST',
      body,
    })
  }

  const updateRoleById = (id: string, body: BodyRoleType) => {
    return $api(`${PARENT_URL}/${id}`, {
      method: 'PUT',
      body,
    })
  }

  const deleteRoleById = (id: string) => {
    return $api(`${PARENT_URL}/${id}`, {
      method: 'DELETE',
    })
  }

  const getPermissions = () => {
    return $api(`${PARENT_URL}/permissions`, {
      method: 'GET',
    })
  }

  return {
    getRoleList,
    getRoleById,
    createRole,
    updateRoleById,
    deleteRoleById,
    getPermissions,
  }
}
