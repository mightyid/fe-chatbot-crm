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
const { t } = useI18n()
const form = ref({
  email: '',
  password: '',
})
appStore.strategyAuth = 'user'

const isLoading = ref(false)
const onSubmit = handleSubmit(async () => {
  try {
    isLoading.value = true
    // appStore.strategyAuth = 'user'
    const body = {
      email: form.value.email,
      password: form.value.password,
    }

    const { result }: any = await login(body)

    setToken(result?.access_token)
    setRefreshToken(result?.refresh_token)
    await getUserInfo()

    // redirectBack('/')
    window.location.reload()
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
    <h2 class="mt-0 mb-[24px] text-3xl font-semibold c-black-90"> {{ t('common.login') }} </h2>

    <form autocomplete="off" @submit.prevent="onSubmit">
      <div class="mb-4">
        <BaseInputText
          :label="t('common.email')"
          name="email"
          :rules="{ required: true, email: true }"
          v-model="form.email"
        />
      </div>

      <div class="mb-4">
        <BaseInputPassword
          :label="t('common.password')"
          name="password"
          :rules="{ required: true }"
          v-model="form.password"
        />
        <div class="flex jc-fe">
          <nuxt-link class="text-base font-normal c-[#2187FF] no-underline" :to="`/forgot-password`">
            {{ t('common.forgot_password') }}
          </nuxt-link>
        </div>
      </div>

      <Button class="ml-auto !flex" :label="t('common.login')" severity="primary" type="submit" :loading="isLoading" />
      <nuxt-link to="/user-referral/sign-in" class="mt-0 mb-[24px] text-base c-black-90">
        {{ t('common.login_with_referral') }}
      </nuxt-link>
    </form>
  </div>
</template>
