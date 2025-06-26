import { useAppStore } from '~/stores/app'

export default function useAuth() {
  const URL = `/user`
  const { $api } = useNuxtApp()
  const appStore = useAppStore()
  const isUser = computed(() => (appStore.strategyAuth == 'user' ? true : false))
  const user = computed(() => appStore.user || {})
  const token = computed(() => appStore.token || '')
  const refreshToken = computed(() => appStore.refreshToken || '')

  async function login(body: { email: string; password: string }) {
    return $api(`user/auth/login`, {
      method: 'POST',
      body,
    })
  }
  async function loginAdmin(body: { email: string; password: string }) {
    return $api(`admin/auth/login`, {
      method: 'POST',
      body,
    })
  }
  async function loginReferral(body: { email: string; password: string }) {
    return $api(`referral/auth/login`, {
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
      const { result } = await $api<any>(`user/info`, { method: 'GET' })
      appStore.updateUser({
        ...result,
        isLoggedIn: true,
      })
    } catch (error) {
      console.error(error)
    }
  }
  async function getUserAdmin() {
    try {
      const { result } = await $api<any>(`admin/auth/info`, { method: 'GET' })
      appStore.updateUser({
        ...result,
        isLoggedIn: true,
      })
    } catch (error) {
      console.error(error)
    }
  }
  async function getUserReferral() {
    try {
      const { result } = await $api<any>(`referral/info`, { method: 'GET' })
      appStore.updateUser({
        ...result?.referralInfo,
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
    loginReferral,
    getUserInfo,
    getUserReferral,
    getUserAdmin,
    loginAdmin,
  }
}
