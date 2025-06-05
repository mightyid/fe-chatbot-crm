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
const emit = defineEmits(['onSubmit', 'onCancel', 'onEdit'])
const labels = ref<any>([])
const columns = ref<any>([])
const { handleSubmit, resetForm } = useForm()
const form = ref<any>({
  data: {},
  label_id: null,
  new_field: [],
})
const getLabels = async () => {
  const { result }: any = await $api('crm-label', {
    method: 'GET',
  })
  labels.value = result || []
}
const getColumns = async () => {
  const { result }: any = await $api('crm-field', {
    method: 'GET',
  })
  columns.value = result || []
  if (!form.value.data) form.value.data = {}
  columns.value.forEach((column: any) => {
    if (!form.value.data[column.key]) form.value.data[column.key] = ''
    // form.value.data[column.key] = form.value.data[column.key] || ''
  })
}

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

getLabels()
getColumns()
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
      <BaseInputSelectTag
        v-model="form.label_id"
        name="label"
        label="Label"
        option-label="name"
        option-value="_id"
        :options="labels"
        :rules="{ required: true }"
      />
      <div class="flex gap-2 flex-col">
        <label class="text-base font-normal c-black-90" for="props.name"> Name</label>
        <InputText name="name" type="text" placeholder="Enter" v-model="form.name" />
      </div>
      <div class="flex gap-2 flex-col" v-for="column in columns" :key="column._id" v-if="columns.length">
        <label class="text-base font-normal c-black-90" for="props.name"> {{ column?.label }} </label>
        <InputText :name="column.label" type="text" placeholder="Enter" v-model="form.data[column.key]" />
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
