import type { ResponseType, ResponseTypeList, ResponseTypeListWithTotalMoney } from '~/types'
import type { EmployeeType, EmployeeBodyType, EmployeeParamsGetList } from '~/types/employee'

export default function useEmployeeService() {
  const URL = '/admin/user'

  const { $api } = useNuxtApp()

  async function getEmployees(params: EmployeeParamsGetList) {
    return $api<ResponseTypeList<EmployeeType[]>>(URL, {
      method: 'GET',
      params,
    })
  }

  async function getEmployeeById(id: string) {
    return $api<ResponseType<EmployeeType>>(`${URL}/${id}`, {
      method: 'GET',
    })
  }

  async function createEmployee(body: EmployeeBodyType) {
    return $api<ResponseType>(URL, {
      method: 'POST',
      body,
    })
  }

  async function updateEmployeeById(id: string, body: EmployeeBodyType) {
    return $api<ResponseType>(`${URL}/${id}`, {
      method: 'PUT',
      body,
    })
  }

  async function deleteEmployeeById(id: string) {
    return $api<ResponseType>(`${URL}/${id}`, {
      method: 'DELETE',
    })
  }

  return {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployeeById,
    deleteEmployeeById,
  }
}
