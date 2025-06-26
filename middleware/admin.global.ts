export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, token, refreshToken } = useAuth()
  const appStore = useAppStore()
  const isAdmin = appStore.strategyAuth == 'admin' ? true : false
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
