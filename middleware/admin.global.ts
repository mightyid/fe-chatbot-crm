export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, token, refreshToken } = useAuth()
  const appStore = useAppStore()
  const isAdmin = appStore.strategyAuth == 'admin' ? true : false
  const isPublicPage = to.path.startsWith('/terms') || to.path.startsWith('/privacy') || to.meta.auth === false
  if (isPublicPage) return

  if (user.value.isLoggedIn && isAdmin) {
    if (!to.fullPath.includes('admin')) {
      return navigateTo('/admin/company')
    }
  }

  if (to.fullPath.includes('admin')) {
    appStore.strategyAuth = 'admin'
  }
  // if (user.value.isLoggedIn && !isAdmin) {
  //   if (to.fullPath.includes('admin')) {
  //     return navigateTo('/')
  //   }
  // }
})
