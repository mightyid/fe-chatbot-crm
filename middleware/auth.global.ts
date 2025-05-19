export default defineNuxtRouteMiddleware(async (to) => {
  const { user, token, refreshToken, getUserInfo } = useAuth()

  if (!user.value.isLoggedIn && (token.value || refreshToken.value)) {
    await getUserInfo()
  }

  if (to.meta.auth === 'guest') {
    return user.value.isLoggedIn ? navigateTo('/') : undefined
  }

  if (to.meta.auth !== false && !user.value.isLoggedIn) {
    return navigateTo('/sign-in')
  }
})
