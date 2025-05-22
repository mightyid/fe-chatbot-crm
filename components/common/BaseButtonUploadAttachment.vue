<script setup lang="ts">
import type { MediaType } from '~/types'
import convertSizeFile from '~/utils/convertSizeFile'

const props = defineProps({
  name: {
    type: String,
    default: '',
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  label: {
    type: String,
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  tooltip: {
    type: String,
    default: '',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  acceptFile: {
    type: String,
    default: '*',
  },
  acl: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['onUpload', 'onDeleted'])

const { t } = useI18n()
const confirm = useConfirm()
const toast = useToast()
const { getUrlMediaByKey, ...mediaServices } = useMedia()

const inputFile = ref<HTMLInputElement>()
const isLoading = ref(false)

const clickInputFile = () => {
  inputFile.value?.click()
}

const handleChange = async (e: Event) => {
  isLoading.value = true

  const files = (e.target as HTMLInputElement).files

  if (files && files?.length > 0) {
    const formData = new FormData()

    for (let item of files) {
      formData.append('file', item)
    }
    formData.append('acl', props.acl as any)

    const data = await mediaServices.uploadMedia(formData)
    emit('onUpload', data)
  }

  // Reset value file
  if (inputFile.value) {
    inputFile.value.value = ''
  }

  isLoading.value = false
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="flex items-center gap-2 text-base font-normal c-black-90" :for="props.name" v-if="label">
      <span>
        {{ label }}
        <span class="c-danger" v-if="rules.required">*</span>
      </span>
      <img src="~/assets/icons/i-tooltip.svg" alt="" v-tooltip.top="tooltip" v-if="tooltip" />
    </label>

    <Button
      class="w-fit gap-2 border-transparent"
      :label="t('common.upload_file')"
      severity="secondary"
      type="button"
      :loading="isLoading"
      @click="clickInputFile"
    >
      <template #icon>
        <img src="~/assets/icons/i-upload-primary.svg" alt="" />
      </template>
    </Button>

    <input
      :id="name"
      class="hidden"
      type="file"
      :multiple="multiple"
      :accept="acceptFile"
      @change="handleChange"
      ref="inputFile"
    />
  </div>
</template>
