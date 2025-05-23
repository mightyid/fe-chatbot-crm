<script lang="ts" setup>
import FormLabel from './FormLabel.vue'

const isShowDrawerLabel = defineModel('isShowDrawerLabel', { default: false, type: Boolean })
const isShowModalCreateLabel = ref(false)
const isShowModalEditLabel = ref(false)
const dataEdit = ref<any>({})
const toast = useToast()
const labels = ref<any>([])
const confirm = useConfirm()
const emit = defineEmits(['onChange'])
const { $api } = useNuxtApp()
const getData = async () => {
  const { result }: any = await $api(`crm-label`, {
    method: 'GET',
  })
  labels.value = result || []
}

const createLabel = async (obj?: any) => {
  const { result, statusCode }: any = await $api(`crm-label`, {
    method: 'POST',
    body: obj,
  })
  if (statusCode === 200) {
    toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully', life: 3000 })
    isShowModalCreateLabel.value = false
    getData()
    emit('onChange')
  }
}
const editLabel = async (obj: any) => {
  const { statusCode }: any = await $api(`crm-label/${obj._id}`, {
    method: 'PUT',
    body: obj,
  })
  if (statusCode === 200) {
    toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully', life: 3000 })
    isShowModalEditLabel.value = false
    getData()
    emit('onChange')
  }
}
const confirmDelete = async (obj: any) => {
  confirm.require({
    message: 'Are you sure you want to delete?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      const { statusCode }: any = await $api(`crm-label/${obj._id}`, {
        method: 'DELETE',
      })
      if (statusCode === 200) {
        toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully', life: 3000 })
        getData()
        emit('onChange')
      }
    },
  })
}

watch(
  () => isShowDrawerLabel.value,
  (val) => {
    if (val) {
      getData()
    }
  },
)
</script>

<template>
  <Sidebar
    v-model:visible="isShowDrawerLabel"
    header="Labels Management"
    position="right"
    class="!w-[700px]"
    :pt="{
      header: 'w-full !jc-sb ![&>.p-sidebar-header-content]:w-full ![&>.p-sidebar-header-content]:mr-[16px]',
    }"
  >
    <template #header>
      <div class="!w-full fr flex-1 jc-sb">
        <div class="text-base font-bold">Labels Management</div>
        <div class="fr ai-c c-primary gap-2 cursor-pointer mr-4" @click="isShowModalCreateLabel = true">
          <img src="~/assets/icons/i-add-primary.svg" alt="" />
          Label
        </div>
      </div>
    </template>
    <div class="fc w-full overflow-x-hidden gap-[4px]">
      <div
        class="fr jc-sb py-[4px] px-[4px] hover:border-b-[1px] hover:border-b-[#E1E1E1] hover:border-b-solid"
        v-for="item in labels"
      >
        <div class="fr ai-c text-base font-semibold gap-3">
          <TagIcon :color="item?.color" />
          {{ item?.name }}
        </div>
        <div class="fr ai-c gap-1">
          <img
            src="@/assets/icons/i-edit-primary.svg"
            class="icon cursor-pointer"
            alt=""
            @click=";(isShowModalEditLabel = true), (dataEdit = item)"
          />
          <img
            src="@/assets/icons/i-trash-circle.svg"
            class="icon cursor-pointer"
            alt=""
            @click="confirmDelete(item)"
          />
        </div>
      </div>
    </div>
  </Sidebar>
  <BaseDialog :visible="isShowModalCreateLabel" @closeDialog="isShowModalCreateLabel = false">
    <FormLabel @onSubmit="createLabel" @onCancel="isShowModalCreateLabel = false" :isEdit="false" />
  </BaseDialog>
  <BaseDialog :visible="isShowModalEditLabel" @closeDialog="isShowModalEditLabel = true">
    <FormLabel @onEdit="editLabel" @onCancel="isShowModalEditLabel = false" :isEdit="true" :data="dataEdit" />
  </BaseDialog>
</template>
