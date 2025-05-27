<script setup lang="ts">
definePageMeta({
  auth: 'guest',
  layout: 'auth',
})

const { $api } = useNuxtApp()
const router = useRouter()
const { handleSubmit } = useForm()
const { login, setToken, setRefreshToken, getUserInfo } = useAuth()
const { showToastError } = useShowToast()
const redirectBack = useRedirectBack()
const appStore = useAppStore()
const form = ref({
  email: '',
  password: '',
})
const isLoading = ref(false)
const onSubmit = handleSubmit(async () => {
  try {
    isLoading.value = true
    appStore.strategyAuth = 'user'
    const body = {
      email: form.value.email,
      password: form.value.password,
    }

    const { result } = await login(body)

    setToken(result?.access_token)
    setRefreshToken(result?.refresh_token)
    await getUserInfo()

    redirectBack('/')
  } catch (error: any) {
    console.log({ error })

    if ((error?.statusCode === 400 || error?.statusCode === 401) && error?.response?._data?.key === 'UNAUTHORIZED') {
      showToastError({
        ...error,
        data: {
          ...error?.data,
          message: 'Email hoặc mật khẩu không chính xác',
        },
      })
    } else {
      showToastError(error)
    }
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="page">
    <h2 class="mt-0 mb-[24px] text-3xl font-semibold c-black-90"> Đăng nhập </h2>

    <form autocomplete="off" @submit.prevent="onSubmit">
      <div class="mb-4">
        <BaseLabel text="Email" showRequired />
        <BaseInputText name="email" :rules="{ required: true, email: true }" v-model="form.email" />
      </div>

      <div class="mb-4">
        <div class="flex justify-between">
          <BaseLabel text="Mật khẩu" showRequired />
          <nuxt-link class="text-base font-normal c-[#2187FF] no-underline" :to="`/forgot-password`">
            Quên mật khẩu
          </nuxt-link>
        </div>
        <BaseInputPassword name="password" :rules="{ required: true }" v-model="form.password" />
      </div>

      <Button class="ml-auto !flex" label="Đăng nhập" severity="primary" type="submit" :loading="isLoading" />
    </form>
  </div>
</template>
