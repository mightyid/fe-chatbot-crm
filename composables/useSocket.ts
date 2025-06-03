import { io } from 'socket.io-client'
export const useSocket = () => {
  const url = useRuntimeConfig().public.baseURL
  const { user } = useAuth()
  const appStore = useAppStore()
  const { $auth: auth } = useNuxtApp()
  let socket: any = useNuxtApp().$socket || null
  if (!socket) {
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
    useNuxtApp().provide('socket', socket)
  }
  return socket
}
