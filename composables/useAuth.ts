import type {
  GenderType,
  RefreshTokenResponseType,
  ResponseType,
  ResponseTypeList,
  ResponseTypeListWithTotalMoney,
} from '~/types'
import { useAppStore } from '~/stores/app'

type BodyUpdateUser = {
  name: string
  avatar: string
  gender: GenderType
  phone: string
  province: string
  district: string
  township: string
  address: string
}

export default function useAuth() {
  const URL = `/user`
  const { $api } = useNuxtApp()
  const appStore = useAppStore()
  const isUser = computed(() => (appStore.strategyAuth == 'user' ? true : false))
  const user = computed(() => appStore.user || {})
  const token = computed(() => appStore.token || '')
  const refreshToken = computed(() => appStore.refreshToken || '')

  async function login(body: { email: string; password: string }) {
    return $api<RefreshTokenResponseType>(isUser.value ? `user/auth/login` : `admin/auth/login`, {
      method: 'POST',
      body,
    })
  }

  async function logout() {
    appStore.updateUser({
      isLoggedIn: false,
    })
    appStore.setToken('')
    appStore.setRefreshToken('')
    navigateTo({ path: '/sign-in', force: true })
  }

  async function getUserInfo() {
    try {
      const { result } = await $api<any>(isUser.value ? `user/info` : `admin/auth/info`, { method: 'GET' })
      appStore.updateUser({
        ...result,
        isLoggedIn: true,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return {
    user,
    token,
    refreshToken,
    setToken: appStore.setToken,
    setRefreshToken: appStore.setRefreshToken,
    login,
    logout,
    getUserInfo,
  }
}
