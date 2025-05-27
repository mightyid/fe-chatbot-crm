import { useAppStore } from '~/stores/app'
import { io } from 'socket.io-client'
export default defineNuxtPlugin((nuxtApp) => {
  const url = useRuntimeConfig().public.baseURL
  const { user } = useAuth()
  const appStore = useAppStore()
  let isConnect = false
  let socket = false
  if (!isConnect && user.value.isLoggedIn) {
    //@ts-ignore
    const token = appStore.token
    //@ts-ignore
    socket = io.connect(url, {
      transports: ['websocket'],
      query: {
        token: token,
      },
      reconnection: true,
      reconnectionDelay: 5000,
    })
    nuxtApp.provide('socket', socket)
    isConnect = true
  } else {
    isConnect = false
  }
})
