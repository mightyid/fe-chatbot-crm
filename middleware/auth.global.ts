export default defineNuxtRouteMiddleware(async (to) => {
  const { user, token, refreshToken, getUserInfo, getUserReferral, getUserAdmin } = useAuth()
  const appStore = useAppStore()
  const strategyAuth = appStore.strategyAuth

  if (!user.value.isLoggedIn && (token.value || refreshToken.value)) {
    if (strategyAuth == 'referral') {
      await getUserReferral()
    } else if (strategyAuth == 'admin') {
      await getUserAdmin()
    } else {
      await getUserInfo()
    }
  }

  if (to.meta.auth === 'guest') {
    return user.value.isLoggedIn ? navigateTo('/crm') : undefined
  }

  if (to.meta.auth !== false && !user.value.isLoggedIn) {
    return navigateTo('/sign-in')
  }
})
