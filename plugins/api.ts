import type { RefreshTokenResponseType } from '~/types'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const { token, refreshToken, setToken, setRefreshToken, logout } = useAuth()
  const toast = useToast()

  const showError = (response: any) => {
    // toast.add({
    //   severity: 'error',
    //   summary: 'Error ' + response?._data?.statusCode,
    //   detail: response?._data?.message || response?._data?.key,
    //   life: 3000,
    // })
  }

  let isRefreshingToken = false

  const handleRefreshToken = async ({ request, response, options }: any) => {
    if (isRefreshingToken) return

    try {
      isRefreshingToken = true

      const { result } = await $fetch<RefreshTokenResponseType>(`/admin/auth/refresh-token`, {
        baseURL: config.public.apiBase as string,
        method: 'POST',
        body: {
          refresh_token: refreshToken.value,
        },
      })

      setToken(result?.access_token)
      setRefreshToken(result?.refresh_token)

      // Reload page after refresh token
      window.location.reload()
    } catch (error) {
      console.error(error)
      showError(response)
      logout()
    } finally {
      isRefreshingToken = false
    }
  }

  const api = $fetch.create({
    baseURL: config.public.apiBase as string,

    onRequest({ request, options, error }) {
      if (token.value) {
        // note that this relies on ofetch >= 1.4.0 - you may need to refresh your lockfile
        options.headers.set('Authorization', `Bearer ${token.value}`)
      }
    },

    async onResponse({ request, response, options }) {},

    async onResponseError({ request, response, options }) {
      // Refresh token
      if (response.status === 401 && response?._data?.key === 'EXPIRED_TOKEN') {
        if (!refreshToken.value) {
          await navigateTo('/sign-in')
        } else {
          if (!isRefreshingToken) {
            await handleRefreshToken({ request, response, options })
          }
        }
      } else {
        showError(response)
      }

      console.error(response)
    },

    retry: false,
  })

  nuxtApp.provide('api', api)
})
