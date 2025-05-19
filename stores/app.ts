import { defineStore } from 'pinia'

type User = {
  isLoggedIn: boolean
  [key: string]: any
}

export const useAppStore = defineStore('app', {
  state: () => ({
    user: {
      isLoggedIn: false,
    } as User,
    token: useLocalStorage('access_token', ''),
    refreshToken: useLocalStorage('refresh_token', ''),
    socketConnected: false,
  }),
  getters: {},
  actions: {
    updateUser(payload: User) {
      this.user = payload
    },
    setToken(payload: string) {
      this.token = payload
      useLocalStorage('access_token', payload)
    },
    setRefreshToken(payload: string) {
      this.refreshToken = payload
      useLocalStorage('refresh_token', payload)
    },
    updateSocketConnected(payload: boolean) {
      this.socketConnected = payload
    },
  },
})
