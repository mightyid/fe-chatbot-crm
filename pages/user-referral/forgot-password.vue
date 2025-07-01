<script lang="ts" setup>
import { useForm } from 'vee-validate'

type FormType = {
  email: string
  otp: string
  token: string
  newPassword: string
}

type ResultOtpType = {
  result: {
    token: string
    email: string
  }
}

definePageMeta({
  layout: 'auth',
  auth: 'guest',
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { handleSubmit } = useForm()
const { $api } = useNuxtApp()
const form = ref<FormType>({
  email: '',
  otp: '',
  token: '',
  newPassword: '',
})
const currentStep = ref(0)

const previousStep = () => {
  currentStep.value -= 1

  if (currentStep.value < 0) {
    router.push('/login')
  }
}

const nextStep = () => {
  currentStep.value += 1

  if (currentStep.value > 2) {
    router.push('/user-referral/sign-in')
  }
}

const getOtp = async () => {
  return await $api('referral/auth/forgot-password', {
    method: 'POST',
    body: { email: form.value.email },
  })
}

const forgotPassword = async () => {
  const { message, statusCode }: any = await getOtp()

  if (statusCode === 200) {
    nextStep()
  }
}

const resendOtp = async () => {
  await getOtp()
}

const verifyOtp = async () => {
  const { result } = await $api<ResultOtpType>('referral/auth/verify-otp', {
    method: 'POST',
    body: {
      email: form.value.email,
      code: Number(form.value.otp),
    },
  })

  if (result?.token) {
    form.value.token = result?.token
    nextStep()
  }
}

const handleOnComplete = (value: string) => {
  // console.log("OTP completed: ", value)
  verifyOtp()
}

const resetPassword = handleSubmit(async () => {
  const { result, statusCode }: any = await $api('referral/auth/reset-password', {
    method: 'POST',
    body: {
      email: form.value.email,
      token: form.value.token,
      new_password: form.value.newPassword,
    },
  })

  if (statusCode === 200) {
    nextStep()
    toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully', life: 3000 })
  }
})
</script>

<template>
  <div class="page py-4 px-9">
    <h1 class="mb-2 text-3xl font-bold c-black-90">Forgot password</h1>

    <form autocomplete="off" @submit.prevent="forgotPassword" v-if="currentStep === 0">
      <p class="mb-3 text-base font-normal c-gray-50">
        Enter the email address you used when you joined and we’ll send you OTP code to reset your password.
      </p>
      <div class="mb-4">
        <BaseInputText name="email" label="Email" :rules="{ required: true, email: true }" v-model="form.email" />
      </div>

      <div class="flex justify-center gap-4">
        <Button class="min-w-[156px] flex" label="Back" severity="cancel" type="button" @click="previousStep" />
        <Button class="min-w-[156px] flex" label="Continue" severity="primary" type="submit" />
      </div>
    </form>

    <form autocomplete="off" @submit.prevent="verifyOtp" v-else-if="currentStep === 1">
      <p class="mb-4 text-base font-normal c-gray-50">
        Enter the OTP code sent to
        <span class="c-primary">
          {{ form.email }}
        </span>
      </p>

      <button
        class="mb-2 w-full text-base font-normal c-primary text-center underline"
        type="button"
        @click="resendOtp"
      >
        Resend Code
      </button>

      <div class="mb-3">
        <v-otp-input
          class="justify-center gap-4"
          ref="otpInput"
          v-model:value="form.otp"
          input-classes="otp-input"
          separator=""
          :num-inputs="6"
          :should-auto-focus="true"
          input-type="numeric"
          @onComplete="handleOnComplete"
        />
      </div>

      <div class="flex justify-center gap-4">
        <Button class="min-w-[156px] flex" label="Back" severity="cancel" type="button" @click="previousStep" />
        <Button class="min-w-[156px] flex" label="Continue" severity="primary" type="submit" />
      </div>
    </form>

    <form autocomplete="off" @submit.prevent="resetPassword" v-else-if="currentStep === 2">
      <div class="mb-3">
        <BaseInputPassword
          name="new-password"
          label="New password"
          :rules="{ required: true }"
          v-model="form.newPassword"
        />
      </div>

      <div class="flex justify-center gap-4">
        <Button class="min-w-[156px] flex" label="Reset password" severity="primary" type="submit" />
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
:deep(.otp-input) {
  width: 48px;
  height: 48px;
  padding: 6px;
  font-size: 20px;
  border-radius: 4px;
  text-align: center;
  border: 1px solid #d6d6d9;
  transition: all ease 0.3s;

  &:focus {
    border-color: #3ab2f8;
  }
}

// .otp-input.is-complete {}

:deep(.otp-input::-webkit-inner-spin-button, .otp-input::-webkit-outer-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
</style>
