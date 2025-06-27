<script lang="ts" setup>
import { useForm } from 'vee-validate'
const props = defineProps({
  isShowIframe: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})
const { handleSubmit, resetForm } = useForm()
const { user } = useAuth()
const iframe = ref('')
const emit = defineEmits(['onClose', 'onSubmit', 'onCancel'])
const toast = useToast()
const label_id = ref('')
const is_active = ref(true)
const name = ref('')
const route = useRoute()
const { t } = useI18n()
const columns = ref<any>([])
const labels = ref([])
const { $api } = useNuxtApp()

const getData = async () => {
  const { result }: any = await $api(`iframe/${route.params.id}`, {
    method: 'GET',
  })
  // columns.value = result || []
  name.value = result.name
  label_id.value = result.label
  is_active.value = result.is_active
  columns.value.map((el: any) => {
    if (result.fields.includes(el._id)) {
      el.is_choose = true
    }
    return el
  })
}
const getDataColumn = async () => {
  const { result }: any = await $api(`crm-field`, {
    method: 'GET',
  })
  columns.value = result.map((el: any) => ({ ...el, is_choose: false })) || []
  if (props.isEdit) {
    getData()
  }
}
const getDataLabel = async () => {
  const { result }: any = await $api(`crm-label`, {
    method: 'GET',
  })
  labels.value = result || []
  // getData()
}
getDataColumn()
getDataLabel()
const createIframe = async () => {
  const ids = columns.value.filter((el: any) => el.is_choose)

  const form = {
    label_id: label_id.value || undefined,
    fields: ids.map((el: any) => el._id) || undefined,
    is_active: is_active.value,
    name: name.value || '',
  }
  emit('onSubmit', form)
}

const onSubmit = handleSubmit(() => {
  createIframe()
})
watch(
  () => props.isShowIframe,
  (val) => {
    if (val) {
      // getIframe()
    }
  },
)

const copyIframe = () => {
  navigator.clipboard.writeText(iframe.value)
  toast.add({ severity: 'success', summary: 'Notifications', detail: 'Copied', life: 3000 })
}
</script>

<template>
  <form class="fc" @submit.prevent="onSubmit">
    <BaseInputText name="name" :label="t('common.name')" v-model="name" :rules="{ required: true }" />
    <BaseInputSelectTag
      v-model="label_id"
      class="mt-2"
      :options="labels"
      :label="t('common.label')"
      name="Label"
      option-label="name"
      :rules="{ required: true }"
      option-value="_id"
    />
    <div class="fc mt-2 mb-2">
      <div class="fr jc-sb py-[4px] px-[4px]" v-for="element in columns" :key="element._id">
        <div class="fr ai-c text-base font-semibold gap-3">
          <BaseCheckbox :name="element.label" v-model="element.is_choose" />
          {{ element?.label }}
        </div>
      </div>
    </div>
    <BaseSwitch v-model="is_active" :label="t('common.active')" name="active" />

    <div class="flex justify-end gap-4 mb-4 mt-4">
      <Button :label="t('button.cancel')" severity="secondary" @click="emit('onCancel')" />
      <Button :label="`${isEdit ? t('button.save') : t('button.create')}`" severity="primary" type="submit" />
    </div>
  </form>
  <!-- <BaseInputTextArea class="mb-3 c-primary !bg-b-0" name="iframe" v-model="iframe" :disabled="true" v-if="iframe" />
  <div class="flex ai-c jc-c mb-3">
    <Qr-Code v-if="iframe" :value="iframe" />
  </div> -->
  <!-- <div class="flex justify-end gap-4">
    <Button :label="t('button.cancel')" severity="secondary" type="button" @click="emit('onClose')" />
    <Button label="Copy Link" severity="primary" type="button" @click="copyIframe" v-if="iframe" />
  </div> -->
</template>
