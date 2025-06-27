<script setup lang="ts">
import { useForm } from 'vee-validate'
import { PATH_EMPLOYEES_LIST } from '~/constant/routerPath'

const props = defineProps({
  isLoadingData: {
    type: Boolean,
    default: false,
  },
  info: {
    type: Object,
    default: () => ({}),
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
  iframe_id: '',
  bot_id: '',
})
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { handleSubmit } = useForm()
const { $api } = useNuxtApp()
const listChatbot = ref<any>([])
const listIframe = ref<any>([])
const isPageEdit = computed(() => (route.params.id ? true : false))
const listRole = ref([])
const getData = async () => {
  const { result }: any = await $api(`user/role`)
  listRole.value = result
}
getData()
const getListIframe = async () => {
  const { result }: any = await $api(`iframe`, {
    method: 'GET',
  })
  listIframe.value = result || []
}
const getListBot = async () => {
  const { loading, result, total_pages, total }: any = await $api('chat-bot', {
    method: 'GET',
  })
  listChatbot.value = result || []
}
getListBot()
getListIframe()

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
watch(
  () => props.info,
  (newValue) => {
    form.value = JSON.parse(JSON.stringify(newValue))
  },
  { immediate: true },
)
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

      <BaseInputText name="name" :label="t('common.name')" :rules="{ required: true }" v-model="form.name" />
      <BaseInputText
        name="email"
        :label="t('common.email')"
        :rules="{ required: true, email: true }"
        :disabled="isPageEdit ? true : false"
        v-model="form.email"
      />

      <BaseInputPassword
        name="password"
        :label="t('common.password')"
        :rules="{ required: isPageEdit ? false : true }"
        v-model="form.password"
      />
      <BaseInputText name="phone" :label="t('common.phone')" :rules="{ required: false }" v-model="form.phone" />
      <BaseInputSelect
        label="Iframe"
        :options="listIframe"
        name="iframe_id"
        :filter="true"
        option-label="name"
        option-value="_id"
        v-model="form.iframe_id"
      />

      <BaseInputSelect
        label="Bot"
        :options="listChatbot"
        name="bot_id"
        :filter="true"
        option-label="name"
        option-value="_id"
        v-model="form.bot_id"
      />
      <BaseSwitch class="mb-6" name="is-active" :label="t('common.active')" v-model="form.is_active" />
    </div>

    <div class="flex justify-end gap-[16px]">
      <Button :label="t('button.cancel')" outlined severity="secondary" type="button" @click="goBack" />
      <Button
        :label="isPageEdit ? t('button.save') : t('button.create')"
        severity="primary"
        type="button"
        @click="submitForm"
      />
    </div>
  </form>
</template>
