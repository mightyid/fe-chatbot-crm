<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    default: `id-btn-upload-${Math.random() * 10}`,
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
  disabled: {
    type: Boolean,
    default: false,
  },
  buttonClass: {
    type: String,
    default: '',
  },
  progressSpinnerClass: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['onUpload'])

const mediaServices = useMedia()

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
  <div class="base-button-upload">
    <label class="w-fit block" :class="disabled ? [''] : ['cursor-pointer']" :for="disabled ? '' : name">
      <div class="text-center" v-if="isLoading">
        <ProgressSpinner :class="progressSpinnerClass" />
      </div>

      <template v-else>
        <slot v-if="$slots.default"></slot>

        <Button
          :class="buttonClass"
          label="Upload"
          severity="primary"
          type="button"
          :disabled="disabled"
          @click="clickInputFile"
          v-else
        />
      </template>
    </label>

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
