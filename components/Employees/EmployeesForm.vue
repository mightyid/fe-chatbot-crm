<script setup lang="ts">
import { useForm } from 'vee-validate'
import { PATH_EMPLOYEES_LIST } from '~/constant/routerPath'

const props = defineProps({
  isLoadingData: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['onSubmit'])
const form = ref({
  email: '',
  is_active: true,
  name: '',
  phone: '',
  avatar: '',
  password: '',
})
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { handleSubmit } = useForm()

const employeeServices = useEmployee()

const isPageEdit = computed(() => (route.params.id ? true : false))

const goBack = () => {
  const previousPath = (router.options.history.state.back || null) as string

  if (previousPath) {
    router.push(previousPath)
  } else {
    router.push(PATH_EMPLOYEES_LIST)
  }
}

const onUpload = (obj: any) => {
  form.value.avatar = obj.url
}

const submitForm = handleSubmit(() => {
  emit('onSubmit', form.value)
})
</script>

<template>
  <div class="my-6 text-center" v-if="isLoadingData">
    <ProgressSpinner />
  </div>

  <form class="form" autocomplete="off" @submit.prevent="" v-else>
    <div class="mb-[24px] grid grid-cols-3 gap-[24px]">
      <div class="grid-row-span-2">
        <BaseButtonUpload acceptFile="image/*" @onUpload="onUpload" :acl="true">
          <BaseAvatar :url="form.avatar" type="square" :size="125" aspect="126/160" v-if="form.avatar" />
          <div class="w-[125px] h-[160px] flex flex-col justify-center items-center bg-black-10 rounded" v-else>
            <img src="~/assets/icons/i-camera-bg-gray.svg" />
            <span class="text-base font-normal text-center c-black-60">{{ t('common.avatar') }}</span>
          </div>
        </BaseButtonUpload>
      </div>

      <BaseInputText
        name="name"
        label="Name"
        :rules="{ required: true }"
        :disabled="isPageEdit ? true : false"
        v-model="form.name"
      />
      <BaseInputText
        name="email"
        label="Email"
        :rules="{ required: true, email: true }"
        :disabled="isPageEdit ? true : false"
        v-model="form.email"
      />

      <BaseInputPassword
        name="password"
        label="Password"
        :rules="{ required: isPageEdit ? false : true }"
        v-model="form.password"
      />
      <BaseInputText
        name="phone"
        label="Phone"
        :rules="{ required: false }"
        :disabled="isPageEdit ? true : false"
        v-model="form.phone"
      />

      <BaseSwitch class="mb-6" name="is-active" :label="t('common.active')" v-model="form.is_active" />
    </div>

    <div class="flex justify-end gap-[16px]">
      <Button :label="t('button.cancel')" outlined severity="secondary" type="button" @click="goBack" />
      <Button :label="t('button.create')" severity="primary" type="button" @click="submitForm" />
    </div>
  </form>
</template>
