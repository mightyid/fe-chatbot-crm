export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, token, refreshToken } = useAuth()
  const appStore = useAppStore()
  const isReferral = appStore.strategyAuth == 'referral' ? true : false
  const isPublicPage = to.path.startsWith('/terms') || to.path.startsWith('/privacy') || to.meta.auth === false
  if (isPublicPage) return

  if (user.value.isLoggedIn && isReferral) {
    if (!to.fullPath.includes('user-referral')) {
      return navigateTo('/user-referral')
    }
  }

  if (to.fullPath.includes('user-referral')) {
    appStore.strategyAuth = 'referral'
  }
})
