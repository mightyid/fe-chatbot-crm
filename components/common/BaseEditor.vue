<script setup lang="ts">
import { useField } from 'vee-validate'
// @ts-ignore
import EditorCustomBuild from 'ckeditor5-custom-build/build/ckeditor'

const props = defineProps({
  name: {
    type: String,
    default: '',
    required: true,
  },
  modelValue: {
    type: [String, null] as PropType<String | null>,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  label: {
    type: String,
  },
  styleInput: {
    type: Object,
    default: () => ({}),
  },
  classInput: {
    type: [String, Object, Array],
    default: '',
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
  editorConfig: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
const mediaServices = useMedia()

class MyUploadAdapter {
  public loader

  constructor(loader: any) {
    // Save Loader instance to update upload progress.
    this.loader = loader
  }

  async upload() {
    const file = await this.loader.file
    const formData = new FormData()
    formData.append('file', file)
    formData.append('acl', true as any) //public file

    return new Promise(async (resolve, reject) => {
      const result = await mediaServices.uploadMedia(formData)

      if (result?._id) {
        resolve({ default: result?.url })
      }
    })
  }

  abort() {
    // Reject promise returned from upload() method.
  }
}

function MyCustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    // Configure the URL to the upload script in your back-end here!
    return new MyUploadAdapter(loader)
  }
}

const config = ref({
  extraPlugins: [MyCustomUploadAdapterPlugin],
  mediaEmbed: {
    previewsInData: true,
  },
  ...props.editorConfig,
})
const ckeditorInstance = ref()

const { value, errorMessage, handleBlur } = useField(() => props.name, props.rules, {
  initialValue: props.modelValue as string,
  syncVModel: true,
})

const changeValue = (value: any) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-base font-normal c-black-90" :for="props.name" v-if="label">
      {{ label }} <span class="c-danger" v-if="rules.required">*</span>
    </label>
    <ckeditor
      :id="props.name"
      :class="[classInput, errorMessage ? 'p-invalid' : '']"
      :style="styleInput"
      :editor="(EditorCustomBuild as any)"
      :config="config"
      :placeholder="placeholder ? placeholder : t('common.enter')"
      :modelValue="(modelValue as string)"
      @update:modelValue="changeValue"
      @blur="handleBlur($event, true)"
    />
    <small class="p-error" v-show="errorMessage">{{ errorMessage || '&nbsp' }}</small>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ck) {
  .ck-source-editing-area {
    min-height: 300px;
  }

  .ck-content {
    min-height: 300px;

    h1,
    h2,
    h3,
    h4,
    p,
    b,
    i,
    s,
    u,
    ul,
    li,
    ol,
    a {
      all: revert;
    }

    .ck-placeholder:before {
      left: 12px;
    }
  }

  .ck-icon.ck-icon_inherit-color :not([fill]) {
    fill: unset;
  }
}
</style>
