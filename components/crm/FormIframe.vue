<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { useAppStore } from '~/stores/app'
const props = defineProps({
  isShowIframe: {
    type: Boolean,
    default: false,
  },
  columns: {
    type: Array as any,
    default: [],
  },
  labels: {
    type: Array as any,
    default: [],
  },
})
const { $auth: auth } = useNuxtApp()
const { handleSubmit, resetForm } = useForm()

const iframe = ref('')
const emit = defineEmits(['onClose'])
const appStore = useAppStore()
const toast = useToast()
const newColumns = ref<any>([])
const label_id = ref('')
const is_active = ref(true)
const name = ref('')
const { $api } = useNuxtApp()
const getIframe = async () => {
  const { data }: any = await $api('lead/iframe', {
    method: 'GET',
  })
  is_active.value = data.value?.result.is_active || false
  label_id.value = data.value?.result.label || false
  name.value = data.value?.result.name || ''
  newColumns.value.forEach((element: any) => {
    if (data.value?.result?.columns.includes(element._id)) {
      element.is_active = true
    } else {
      element.is_active = false
    }
  })
  //@ts-ignore
  iframe.value = `${window.location.origin}/iframe/crm/create?agent_id=${auth?.user?.agent?._id}&crm_id=${data.value.result._id}&label=${data.value.result.label}`
}
const updateIframe = async () => {
  const ids = newColumns.value.filter((el: any) => el.is_active)

  const { data }: any = await $api('lead/iframe', {
    method: 'PUT',
    body: {
      label_id: label_id.value || undefined,
      columns: ids.map((el: any) => el._id) || undefined,
      is_active: is_active.value,
      name: name.value || '',
    },
  })
  if (data.value?.statusCode == 200) {
    getIframe()
  }
}
getIframe()

const onSubmit = handleSubmit(() => {
  updateIframe()
})
watch(
  () => props.isShowIframe,
  (val) => {
    if (val) {
      getIframe()
    }
  },
)
watch(
  () => props.columns,
  (val) => {
    newColumns.value = JSON.parse(JSON.stringify(val))
  },
  { immediate: true },
)
const copyIframe = () => {
  navigator.clipboard.writeText(iframe.value)
  toast.add({ severity: 'success', summary: 'Notifications', detail: 'Copied', life: 3000 })
}
</script>

<template>
  <form class="fc" @submit.prevent="onSubmit">
    <BaseInputText name="name" label="Name" v-model="name" :rules="{ required: true }" />
    <BaseInputSelectTag
      v-model="label_id"
      class="mt-2"
      :options="labels"
      label="Label"
      name="Label"
      option-label="name"
      :rules="{ required: true }"
      option-value="_id"
    />
    <div class="fc mt-2 mb-2">
      <div class="fr jc-sb py-[4px] px-[4px]" v-for="element in newColumns" :key="element._id">
        <div class="fr ai-c text-base font-semibold gap-3">
          <BaseCheckbox :name="element.label" v-model="element.is_active" />
          {{ element?.label }}
        </div>
      </div>
    </div>
    <BaseSwitch v-model="is_active" label="Active" name="active" />

    <div class="flex justify-end gap-4 mb-4 mt-4">
      <Button label="Update Iframe" severity="primary" type="submit" />
    </div>
  </form>
  <BaseInputTextArea class="mb-3 c-primary" name="iframe" v-model="iframe" :disabled="true" v-if="iframe" />
  <div class="flex ai-c jc-c mb-3">
    <Qr-Code v-if="iframe" :value="iframe" />
  </div>
  <div class="flex justify-end gap-4">
    <Button label="Cancel" severity="cancel" type="button" @click="emit('onClose')" />
    <Button label="Copy Link" severity="primary" type="button" @click="copyIframe" v-if="iframe" />
  </div>
</template>
