<script setup lang="ts">
import { GENDER_OPTIONS } from '~/constant'

definePageMeta({
  auth: 'guest',
  layout: 'auth',
})

const { $api } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const { handleSubmit } = useForm()
const { login, setToken, setRefreshToken } = useAuth()
const { showToastError, showToastSuccess } = useShowToast()
const redirectBack = useRedirectBack()
const appStore = useAppStore()
const form = ref({
  name: '',
  password: '',
  address: '',
  gender: 1,
  birthday: null,
  avatar: '',
})

const isLoading = ref(false)
const onSubmit = handleSubmit(async () => {
  try {
    isLoading.value = true
    appStore.strategyAuth = 'referral'
    const body = {
      ...form.value,
    }

    const { result, statusCode }: any = await $api(`referral/register/${route.params.id}`, {
      method: 'POST',
      body,
    })
    console.log(result, 'result')
    if (statusCode == 200) {
      router.push('/user-referral/sign-in')
      showToastSuccess('Đăng ký thành công', 3000)
    }
  } catch (error: any) {
    console.log({ error })

    if ((error?.statusCode === 400 || error?.statusCode === 401) && error?.response?._data?.key === 'UNAUTHORIZED') {
      // showToastError({
      //   ...error,
      //   data: {
      //     ...error?.data,
      //     message: 'Email hoặc mật khẩu không chính xác',
      //   },
      // })
    } else {
      // showToastError(error)
    }
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="page">
    <h2 class="mt-0 mb-[24px] text-3xl font-semibold c-black-90"> Register Referral </h2>

    <form autocomplete="off" @submit.prevent="onSubmit">
      <div class="grid grid-cols-1 gap-4">
        <BaseInputText :label="t('common.name')" name="name" v-model="form.name" :rules="{ required: true }" />

        <BaseInputPassword
          :label="t('common.password')"
          name="password"
          v-model="form.password"
          :rules="{ required: true }"
        />

        <BaseInputText label="Address" name="address" v-model="form.address" :rules="{ required: true }" />

        <BaseInputCalendar label="Birthday" name="birthday" v-model="form.birthday" :rules="{ required: false }" />

        <BaseInputSelect
          v-model="form.gender"
          name="gender"
          :label="t('common.gender')"
          :options="GENDER_OPTIONS"
          option-label="name"
          option-value="value"
        />
      </div>

      <Button
        class="ml-auto !flex mt-4"
        :label="t('common.login')"
        severity="primary"
        type="submit"
        :loading="isLoading"
      />
    </form>
  </div>
</template>
