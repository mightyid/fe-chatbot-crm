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

const submitForm = handleSubmit(() => {
  emit('onSubmit')
})
</script>

<template>
  <div class="my-6 text-center" v-if="isLoadingData">
    <ProgressSpinner />
  </div>

  <form class="form" autocomplete="off" @submit.prevent="" v-else>
    <div class="mb-[24px] grid grid-cols-3 gap-[24px]">
      <BaseInputText
        name="email"
        label="Email"
        :rules="{ required: true, email: true }"
        :disabled="isPageEdit ? true : false"
        v-model="form.email"
      />

      <BaseSwitch class="mb-6" name="is-active" :label="t('common.active')" v-model="form.is_active" />
    </div>

    <div class="flex justify-end gap-[16px]">
      <Button :label="t('button.cancel')" outlined size="large" severity="secondary" type="button" @click="goBack" />
      <Button size="large" :label="t('button.create')" severity="primary" type="button" @click="submitForm" />
    </div>
  </form>
</template>
