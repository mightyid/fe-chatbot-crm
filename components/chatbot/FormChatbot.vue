<script setup lang="ts">
import { useForm } from 'vee-validate'

const props = defineProps({
  data: {
    type: Object,
    required: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})
const { $api } = useNuxtApp()
const { t } = useI18n()
const emit = defineEmits(['onSubmit', 'onCancel', 'onEdit'])
const { handleSubmit, resetForm } = useForm()
const form = ref<any>({
  is_active: true,
  name: '',
  avatar: '',
  message: 'Xin chào',
  form: [],
  position: 'right',
  color: '',
  scripts: [],
  assistant_id: '',
  api_key: '',
  organization: '',
})
const formOptions = ref<any>([])
const onSubmit = handleSubmit(() => {
  const newForm = form.value.form.map((item: any) => {
    return {
      key: item.key,
      label: formOptions.value.find((x: any) => x.key === item.key)?.label,
    }
  })
  if (!props.isEdit) {
    emit('onSubmit', { ...toRaw(form.value), form: newForm })
  } else {
    emit('onEdit', { ...toRaw(form.value), _id: props.data?._id, form: newForm })
  }
  resetForm({
    values: {
      name: '',
    },
  })
})
const onUpload = (obj: any) => {
  form.value.avatar = obj.url
}
const getFormOptions = async () => {
  const { result }: any = await $api('crm-field')
  console.log(result, 'result')
  formOptions.value = result || []
}
getFormOptions()

watch(
  () => props.data,
  (newValue) => {
    form.value = JSON.parse(JSON.stringify(newValue))
  },
  { deep: true },
)
</script>

<template>
  <form autocomplete="off" @submit.prevent="onSubmit">
    <div class="grid grid-cols-2 gap-6">
      <div class="grid-row-span-2">
        <BaseButtonUpload acceptFile="image/*" @onUpload="onUpload" :acl="true">
          <BaseAvatar :url="form.avatar" type="square" :size="125" aspect="126/160" v-if="form.avatar" />
          <div class="w-[125px] h-[160px] flex flex-col justify-center items-center bg-black-10 rounded" v-else>
            <img src="~/assets/icons/i-camera-bg-gray.svg" />
            <span class="text-base font-normal text-center c-black-60">{{ t('common.avatar') }}</span>
          </div>
        </BaseButtonUpload>
      </div>
      <BaseInputText class="flex-1" name="name" label="Name" :rules="{ required: true }" v-model="form.name" />

      <BaseInputText
        class="flex-1"
        name="message"
        label="Message"
        :rules="{ required: false }"
        v-model="form.message"
      />
      <BaseInputSelect
        class="flex-1"
        name="position"
        label="Position"
        :options="['left', 'right']"
        option-label=""
        option-value=""
        :rules="{ required: false }"
        v-model="form.position"
      />
      <BaseSwitch class="flex-1" name="is_active" label="Active" v-model="form.is_active" />
    </div>
    <div class="my-4 text-lg c-primary font-bold">Config ChatGPT</div>
    <div class="grid grid-cols-2 gap-6">
      <BaseInputText
        class="flex-1"
        name="assistant_id"
        label="Assistant ID"
        :rules="{ required: false }"
        v-model="form.assistant_id"
      />
      <BaseInputText
        class="flex-1"
        name="api_key"
        label="API Key"
        :rules="{ required: false }"
        v-model="form.api_key"
      />
      <BaseInputText
        class="flex-1"
        name="organization"
        label="Organization"
        :rules="{ required: false }"
        v-model="form.organization"
      />
    </div>
    <div class="my-4 text-lg c-primary font-bold">
      Form Request
      <img
        src="~/assets/icons/i-add-primary.svg"
        alt=""
        class="cursor-pointer"
        @click="form.form.push({ key: '', label: '' })"
      />
    </div>
    <div class="grid grid-cols-2 gap-6">
      <div class="relative flex-1 fr" v-for="(item, index) in form.form" :key="item.key">
        <Select
          class="flex-1"
          v-model="form.form[index].key"
          :options="formOptions"
          optionLabel="label"
          optionValue="key"
          placeholder="Select"
        />
        <img src="~/assets/icons/i-close-gray.svg" class="cursor-pointer" @click="form.form.splice(index, 1)" alt="" />
      </div>
    </div>

    <div class="flex justify-end gap-4 mt-4">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="
          () => {
            emit('onCancel')
          }
        "
      />
      <Button type="submit" :label="isEdit ? 'Save' : 'Create'" severity="primary" />
    </div>
  </form>
</template>
