<script lang="ts" setup>
import FormColumn from './FormColumn.vue'
import draggable from 'vuedraggable'

const isShowDrawerColumn = defineModel('isShowDrawerColumn', { default: false, type: Boolean })
const isShowModalCreateColumn = ref(false)
const isShowModalEditColumn = ref(false)
const dataEdit = ref<any>({})
const toast = useToast()
const columns = ref<any>([])
const confirm = useConfirm()
const emit = defineEmits(['onChange'])
const { $api } = useNuxtApp()
const getData = async () => {
  const { result }: any = await $api(`crm-field`, {
    method: 'GET',
  })
  columns.value = result || []
}

const createColumn = async (obj?: any) => {
  const { result, statusCode }: any = await $api(`crm-field`, {
    method: 'POST',
    body: obj,
  })
  if (statusCode === 200) {
    toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully', life: 3000 })
    isShowModalCreateColumn.value = false
    emit('onChange')
    getData()
  }
}
const editColumn = async (obj: any) => {
  const { result, statusCode }: any = await $api(`crm-field/${obj._id}`, {
    method: 'PUT',
    body: obj,
  })
  if (statusCode === 200) {
    toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully', life: 3000 })
    isShowModalEditColumn.value = false
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
      const { statusCode }: any = await $api(`crm-field/${obj._id}`, {
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
// const debounceFnSort = useDebounceFn(async () => {

// }, 2000)
const sortColumns = async () => {
  const ids = columns.value.map((item: any, index: number) => {
    return {
      field_id: item._id,
      pos: index,
      // name: item.label,
    }
  })
  console.log(ids, 'ids')
  const { data }: any = await $api(`crm-field/change/pos`, {
    method: 'PUT',
    body: {
      pos_data: ids,
    },
  })
  emit('onChange')
}

watch(
  () => isShowDrawerColumn.value,
  (val) => {
    if (val) {
      getData()
    }
  },
)
</script>

<template>
  <Sidebar
    v-model:visible="isShowDrawerColumn"
    header="Fields Management"
    position="right"
    class="!w-[700px]"
    :pt="{
      header: 'w-full !jc-sb ![&>.p-sidebar-header-content]:w-full ![&>.p-sidebar-header-content]:mr-[16px]',
    }"
  >
    <template #header>
      <div class="!w-full fr flex-1 jc-sb">
        <div class="text-base font-bold">Fields Management</div>
        <div class="fr ai-c c-primary gap-2 cursor-pointer" @click="isShowModalCreateColumn = true">
          <img src="~/assets/icons/i-add-primary.svg" alt="" />
          Field
        </div>
      </div>
    </template>
    <draggable v-model="columns" group="people" item-key="id" @end="sortColumns">
      <template #item="{ element }">
        <div class="fr jc-sb py-[4px] px-[4px] hover:border-b-[1px] hover:border-b-[#E1E1E1] hover:border-b-solid">
          <div class="fr ai-c text-base font-semibold gap-3">
            <img src="@/assets/icons/i-menu-bar.svg" class="cursor-pointer" alt="" />
            <BaseCheckbox :name="element.label" v-model="element.is_active" @update:modelValue="editColumn(element)" />
            {{ element?.label }}
          </div>
          <div class="fr ai-c gap-1">
            <img
              src="@/assets/icons/i-edit-primary.svg"
              class="icon cursor-pointer"
              alt=""
              @click=";(isShowModalEditColumn = true), (dataEdit = element)"
            />
            <img
              src="@/assets/icons/i-trash-circle.svg"
              class="icon cursor-pointer"
              alt=""
              @click="confirmDelete(element)"
            />
          </div>
        </div>
      </template>
    </draggable>
    <!-- <div class="fc w-full overflow-x-hidden gap-[4px]">
      <div class="fr jc-sb py-[4px] px-[4px] rounded hover:bg-b-0" v-for="item in columns">
        <div class="fr ai-c text-base font-semibold gap-3">
          <BaseCheckbox :name="item.label" v-model="item.is_active" @update:modelValue="editColumn(item)" />
          {{ item?.label }}
        </div>
        <div class="fr ai-c gap-1">
          <img
            src="@/assets/icons/i-edit-primary.svg"
            class="icon cursor-pointer"
            alt=""
            @click=";(isShowModalEditColumn = true), (dataEdit = item)" />
          <img
            src="@/assets/icons/i-trash-circle.svg"
            class="icon cursor-pointer"
            alt=""
            @click="confirmDelete(item)" />
        </div>
      </div>
    </div> -->
  </Sidebar>
  <BaseDialog :visible="isShowModalCreateColumn" @closeDialog="isShowModalCreateColumn = false">
    <FormColumn @onSubmit="createColumn" @onCancel="isShowModalCreateColumn = false" :isEdit="false" />
  </BaseDialog>
  <BaseDialog :visible="isShowModalEditColumn" @closeDialog="isShowModalEditColumn = true">
    <FormColumn @onEdit="editColumn" @onCancel="isShowModalEditColumn = false" :isEdit="true" :data="dataEdit" />
  </BaseDialog>
</template>
