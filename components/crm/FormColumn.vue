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
const { t } = useI18n()
const emit = defineEmits(['onSubmit', 'onCancel', 'onEdit'])
const fields = ref<any>([
  {
    value: 'name',
    label: t('common.name'),
  },
  {
    value: 'email',
    label: t('common.email'),
  },
  {
    value: 'phone',
    label: t('common.phone'),
  },
  // {
  //   value: 'country',
  //   label: 'Country',
  // },
  // {
  //   value: 'city',
  //   label: 'City',
  // },
  // {
  //   value: 'state',
  //   label: 'State',
  // },
  // {
  //   value: 'street',
  //   label: 'Street',
  // },
  // {
  //   value: 'passport',
  //   label: 'Passport',
  // },
])
const { handleSubmit, resetForm } = useForm()

const form = ref<any>({
  label: props.data?.label || '',
  key: props.data?.key || '',
  is_active: props.data?.is_active || true,
  is_fixed: props.data?.is_fixed || false,
  width: props.data?.width || 200,
  field_profile: props.data?.field_profile || '',
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
if (props?.isEdit) {
  form.value = props.data
}
watch(
  () => props.data,
  (newValue) => {
    console.log('watch')
    form.value = newValue
  },
  { deep: true },
)
</script>

<template>
  <form autocomplete="off" @submit.prevent="onSubmit">
    <div class="text-2xl font-bold text-center">{{ isEdit ? 'Edit Column' : 'Create Field' }}</div>
    <div class="grid grid-cols-1 gap-6">
      <BaseInputText
        class="flex-1"
        name="label"
        :label="t('common.name')"
        :rules="{ required: true }"
        v-model="form.label"
      />
      <BaseInputText class="flex-1" name="key" label="Key" :rules="{ required: true }" v-model="form.key" />
      <BaseInputNumber class="flex-1" name="width" label="Width" :rules="{ required: true }" v-model="form.width" />
      <!-- <BaseInputSelect
        class="flex-1"
        :options="fields"
        name="field_profile"
        label="Field profile"
        option-label="label"
        option-value="value"
        :rules="{ required: false }"
        v-model="form.field_profile"
      /> -->
      <!-- <BaseInputText
        class="flex-1"
        name="field_profile"
        label="Field profile"
        :rules="{ required: false }"
        v-model="form.field_profile" /> -->
      <BaseSwitch class="flex-1" name="is_active" :label="t('common.active')" v-model="form.is_active" />
      <BaseSwitch class="flex-1" name="is_fixed" label="Fixed" v-model="form.is_fixed" />
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
