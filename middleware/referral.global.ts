export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, token, refreshToken } = useAuth()
  const appStore = useAppStore()
  const isReferral = appStore.strategyAuth == 'referral' ? true : false
  if (user.value.isLoggedIn && isReferral) {
    if (!to.fullPath.includes('user-referral')) {
      return navigateTo('/user-referral')
    }
  }

  if (to.fullPath.includes('user-referral')) {
    appStore.strategyAuth = 'referral'
  }
})
