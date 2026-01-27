export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware entirely for public pages like terms and privacy
  if (to.path === '/terms' || to.path === '/privacy') {
    return undefined
  }

  const { user, token, refreshToken, getUserInfo, getUserReferral, getUserAdmin } = useAuth()
  const appStore = useAppStore()
  const strategyAuth = appStore.strategyAuth

  if (!user.value.isLoggedIn && (token.value || refreshToken.value)) {
    try {
      if (strategyAuth == 'referral') {
        await getUserReferral()
      } else if (strategyAuth == 'admin') {
        await getUserAdmin()
      } else {
        await getUserInfo()
      }
    } catch (error) {
      console.error('Session restore failed:', error)
    }
  }

  // Public pages (accessible by anyone)
  if (to.meta.auth === false || to.meta.auth === 'false') {
    return undefined
  }

  // Guest-only pages (redirect to dashboard if logged in)
  if (to.meta.auth === 'guest') {
    return user.value.isLoggedIn ? navigateTo('/crm') : undefined
  }

  // Protected pages (redirect to sign-in if not logged in)
  if (!user.value.isLoggedIn) {
    return navigateTo('/sign-in')
  }
})
