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
  progressSpinnerClass: {
    type: String,
    default: '',
  },
  file: {
    type: Object,
    default: {},
  },
  loadingSize: {
    type: [String, Number],
    default: '44',
  },
})

const emit = defineEmits(['onUpload'])

const mediaService = useMediaService()

const inputFile = ref<HTMLInputElement>()
const isLoading = ref(false)

const clickInputFile = () => {
  inputFile.value?.click()
}

const handleChange = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files

  if (files && files?.length > 0) {
    for (let item of files) {
      const formData = new FormData()

      formData.append('file', item)
      formData.append('acl', props.acl as any)

      try {
        isLoading.value = true

        const data = await mediaService.uploadMedia(formData)

        emit('onUpload', data)
      } catch (error) {
        console.error(error)
      } finally {
        isLoading.value = false
      }
    }
  }

  // Reset value file
  if (inputFile.value) {
    inputFile.value.value = ''
  }
}

const deleteFile = () => {
  emit('onUpload', {})
}
</script>

<template>
  <component
    class="cursor-pointer no-underline"
    :class="{
      'p-4 border border-dashed border-semantic rounded-lg  bg-white': !$slots.inputContent,
      'cursor-not-allowed opacity-50': isLoading,
    }"
    :is="file?.url ? 'a' : 'div'"
    v-bind="file?.url ? { target: '_blank', href: file?.url } : { type: 'button' }"
    @click="file?.url ? null : clickInputFile()"
  >
    <!-- Slot content -->
    <template v-if="$slots.inputContent">
      <ProgressSpinner :style="{ width: loadingSize + 'px', height: loadingSize + 'px' }" v-if="isLoading" />

      <slot name="inputContent" v-else> </slot>
    </template>

    <!-- Default -->
    <div class="flex items-center gap-3" v-else>
      <ProgressSpinner style="width: 44px; height: 44px" v-if="isLoading" />

      <div class="flex-1 flex items-center gap-3" v-else>
        <!-- Audio -->
        <template v-if="acceptFile?.includes('audio')">
          <img class="w-8 h-8" src="/icons/i-document-upload.svg" alt="" />
          <div class="flex-1">
            <p class="m-0 text-base font-normal c-black-90 line-clamp-1">
              {{ file?.name || 'Upload audio' }}
            </p>
            <p class="m-0 text-s c-black-60 font-normal"> (mp3) </p>
          </div>
        </template>

        <!-- Images -->
        <template v-else-if="acceptFile?.includes('image')">
          <img class="w-8 h-8" src="/icons/i-gallery-upload.svg" alt="" />
          <div class="flex-1">
            <p class="m-0 text-base font-normal c-black-90 line-clamp-1">
              {{ file?.name || 'Upload image' }}
            </p>
            <p class="m-0 text-s c-black-60 font-normal"> (jpg, png) </p>
          </div>
        </template>

        <!-- Other -->
        <template v-else>
          <img class="w-8 h-8" src="/icons/i-gallery-upload.svg" alt="" />
          <div class="flex-1">
            <p class="m-0 text-base font-normal c-black-90 line-clamp-1"> {{ file?.name || 'Upload' }} </p>
          </div>
        </template>
      </div>

      <button type="button" @click.stop.prevent="deleteFile" v-if="file?._id || file?.url">
        <img src="/icons/i-trash-red.svg" alt="" />
      </button>
    </div>

    <input
      :id="name"
      class="hidden"
      type="file"
      :multiple="multiple"
      :accept="acceptFile"
      @change="handleChange"
      ref="inputFile"
    />
  </component>
</template>
