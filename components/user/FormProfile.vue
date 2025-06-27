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
const { user } = useAuth()
const emit = defineEmits(['onSubmit', 'onCancel', 'onEdit'])
const { handleSubmit, resetForm } = useForm()
const form = ref<any>({
  name: user.value?.name,
  avatar: user.value?.avatar,
  phone: user.value?.phone,
  email: user.value?.email,
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
  form.value.avatar = obj.url
}

watch(
  () => props.data,
  (newValue) => {
    form.value = JSON.parse(JSON.stringify(newValue))
  },
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
            <span class="text-base font-normal text-center c-black-60"> Avatar </span>
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
        :disabled="true"
      />
      <BaseInputText
        class="flex-1"
        name="phone"
        :label="t('common.phone')"
        :rules="{ required: true }"
        v-model="form.phone"
      />
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
      <Button type="submit" :label="isEdit ? t('button.save') : t('common.update')" severity="primary" />
    </div>
  </form>
</template>
