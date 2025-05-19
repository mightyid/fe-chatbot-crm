import type { ResponseType } from '~/types'
import type { CountryType, DistrictType, ProvinceType, TownshipType } from '~/types'

export default function useZoneService() {
  const URL = '/zone'

  const { $api } = useNuxtApp()

  const country = reactive({
    data: [] as CountryType[],
    isLoading: false,
  })

  const getCountries = async () => {
    country.isLoading = true

    try {
      const { result } = await $api<ResponseType<any[]>>(`${URL}/country`, {
        method: 'GET',
      })

      country.data = result || []
    } catch (error) {
    } finally {
      country.isLoading = false
    }
  }

  const province = reactive({
    data: [] as ProvinceType[],
    isLoading: false,
  })

  const getProvinces = async (countryId?: string) => {
    province.isLoading = true

    try {
      const urlByCondition = countryId ? `${URL}/country/${countryId}/province` : `${URL}/province`

      const { result } = await $api<ResponseType<any[]>>(urlByCondition, {
        method: 'GET',
      })

      province.data = result || []
    } catch (error) {
    } finally {
      province.isLoading = false
    }
  }

  const district = reactive({
    data: [] as DistrictType[],
    isLoading: false,
  })

  const getDistricts = async (provinceId: string) => {
    district.isLoading = true

    try {
      const { result } = await $api<ResponseType<any[]>>(`${URL}/province/${provinceId}/district`, {
        method: 'GET',
      })

      district.data = result || []
    } catch (error) {
    } finally {
      district.isLoading = false
    }
  }

  const township = reactive({
    data: [] as TownshipType[],
    isLoading: false,
  })

  const getTownships = async (districtId: string) => {
    township.isLoading = true

    try {
      const { result } = await $api<ResponseType<any[]>>(`${URL}/district/${districtId}/township`, {
        method: 'GET',
      })

      township.data = result || []
    } catch (error) {
    } finally {
      township.isLoading = false
    }
  }

  return {
    country,

    getCountries,

    province,
    getProvinces,

    district,
    getDistricts,

    township,
    getTownships,
  }
}
