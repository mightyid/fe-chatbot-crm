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
  name: '',
  description: '',
  email: '',
  password: '',
  logo: '',
  is_active: true,
  bot_quantity: 1,
})

const onSubmit = handleSubmit(() => {
  if (!props.isEdit) {
    emit('onSubmit', { ...toRaw(form.value) })
  } else {
    emit('onEdit', { ...toRaw(form.value), _id: props.data?._id })
  }
  // resetForm({
  //   values: {
  //     name: '',
  //   },
  // })
})
const onUpload = (obj: any) => {
  form.value.logo = obj.url
}

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
          <BaseAvatar :url="form.avatar" type="square" :size="125" aspect="126/160" v-if="form.logo" />
          <div class="w-[125px] h-[160px] flex flex-col justify-center items-center bg-black-10 rounded" v-else>
            <img src="~/assets/icons/i-camera-bg-gray.svg" />
            <span class="text-base font-normal text-center c-black-60">{{ t('common.avatar') }}</span>
          </div>
        </BaseButtonUpload>
      </div>
      <BaseInputText
        class="flex-1"
        name="name"
        :label="t('common.name')"
        :rules="{ required: true }"
        v-model="form.name"
      />
      <BaseInputText
        class="flex-1"
        name="email"
        :label="t('common.email')"
        :rules="{ required: true }"
        v-model="form.email"
      />

      <BaseInputTextArea
        class="flex-1"
        name="description"
        label="Description"
        :rules="{ required: false }"
        v-model="form.description"
      />
    </div>
    <div class="my-4 text-lg c-primary font-bold">Config </div>
    <div class="grid grid-cols-2 gap-6">
      <BaseInputNumber
        class="flex-1"
        name="bot_quantity"
        label="Bot Quantity"
        :rules="{ required: isEdit ? false : true }"
        v-model="form.bot_quantity"
      />
      <BaseInputPassword
        class="flex-1"
        name="password"
        :label="t('common.password')"
        :rules="{ required: isEdit ? false : true }"
        v-model="form.password"
      />
      <BaseSwitch class="flex-1" name="is_active" :label="t('common.active')" v-model="form.is_active" />
    </div>
    <div class="flex justify-end gap-4 mt-4">
      <Button
        type="button"
        :label="t('button.cancel')"
        severity="secondary"
        @click="
          () => {
            emit('onCancel')
          }
        "
      />
      <Button type="submit" :label="isEdit ? t('button.save') : t('button.create')" severity="primary" />
    </div>
  </form>
</template>
