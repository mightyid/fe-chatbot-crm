<script setup lang="ts">
import { useForm } from 'vee-validate'
import ImportExcelReferral from '~/components/crm/ImportExcelReferral.vue'

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
const route = useRoute()
const { handleSubmit, resetForm } = useForm()
const isShowImportExcel = ref(false)
const listChatbot = ref<any>([])
const listIframe = ref<any>([])
const bot_id = ref('')
const iframe_id = ref('')
const form = ref<any>({
  name: '',
  email: '',
  phone: '',
})
const columns = ref<any>([
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'phone',
    label: 'Phone',
  },
])

const listUser = ref<any>([])
const confirm = useConfirm()
const addUser = handleSubmit(() => {
  const data = {
    ...form.value,
    _id: new Date().getTime(),
  }
  listUser.value.push(data)
})

const getListIframe = async () => {
  const { result }: any = await $api(`iframe`, {
    method: 'GET',
  })
  listIframe.value = result || []
}
const getListBot = async () => {
  const { loading, result, total_pages, total }: any = await $api('chat-bot', {
    method: 'GET',
  })
  listChatbot.value = result || []
}
getListBot()
getListIframe()

const confirmDelete = (record: any) => {
  confirm.require({
    message: 'Are you sure you want to delete?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      listUser.value = listUser.value.filter((item: any) => item.email !== record.email && item.phone !== record.phone)
    },
    reject: () => {
      // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
    },
  })
}
const importExcel = async (obj: any) => {
  console.log(obj, 'obj')
  obj?.forEach((el: any) => {
    if (el.email && el.phone) {
      listUser.value.push(el)
    }
  })
  isShowImportExcel.value = false
}

const onSubmit = () => {
  emit('onSubmit', {
    listData: listUser.value,
    iframe_id: iframe_id.value,
    bot_id: bot_id.value,
  })
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
  <Button @click="isShowImportExcel = true" class="mb-4"> Import Excel </Button>

  <form autocomplete="off" @submit.prevent="addUser">
    <div class="grid grid-cols-4 gap-6">
      <BaseInputText class="flex-1" name="name" label="Name" :rules="{ required: true }" v-model="form.name" />
      <BaseInputText class="flex-1" name="email" label="Email" :rules="{ required: false }" v-model="form.email" />
      <BaseInputText class="flex-1" name="phone" label="Phone" :rules="{ required: true }" v-model="form.phone" />

      <div class="flex-1 fc jc-fe">
        <Button type="submit"> Add User </Button>
      </div>
    </div>
  </form>
  <DataTable :value="listUser" dataKey="_id" rowHover lazy scrollable class="mt-4">
    <Column header="Name">
      <template #body="slotProps">
        <span class="fr ai-c gap-2">
          {{ slotProps.data.name }}
        </span>
      </template>
    </Column>
    <Column header="Email" field="email"> </Column>
    <Column header="Phone" field="phone"> </Column>

    <Column header="Actions" :frozen="true" alignFrozen="right" :pt="{ root: { class: 'flex jc-fe' } }">
      <template #body="slotProps">
        <div class="flex gap-2 jc-fe">
          <button @click="confirmDelete(slotProps.data)">
            <img class="icon-lg" src="~/assets/icons/i-trash-circle.svg" alt="" v-tooltip.top="'Delete'" />
          </button>
        </div>
      </template>
    </Column>

    <template #empty>
      <NoData />
    </template>
  </DataTable>

  <div class="grid grid-cols-2 gap-4 mt-4">
    <div class="grid grid-cols-2 gap-4">
      <BaseInputSelect
        label="Iframe"
        :options="listIframe"
        name="iframe_id"
        :filter="true"
        option-label="name"
        option-value="_id"
        v-model="iframe_id"
      />

      <BaseInputSelect
        label="Bot"
        :options="listChatbot"
        name="bot_id"
        :filter="true"
        option-label="name"
        option-value="_id"
        v-model="bot_id"
      />
    </div>
    <div class="fr jc-fe ai-e gap-4">
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
      <Button
        :disabled="listUser.length > 0 && bot_id && iframe_id ? false : true"
        :label="isEdit ? 'Save' : 'Invite'"
        severity="primary"
        @click="onSubmit"
      />
    </div>
  </div>
  <BaseDialog :visible="isShowImportExcel" title="Import Excel" @onClose="isShowImportExcel = false" width="960px">
    <ImportExcelReferral :columns="columns" @on-cancel="isShowImportExcel = false" @on-submit="importExcel" />
  </BaseDialog>
</template>
