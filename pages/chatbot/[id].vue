<script lang="ts" setup>
const route = useRoute()
const { $api } = useNuxtApp()
const confirm = useConfirm()
const toast = useToast()
const { t } = useI18n()
const query = ref({
  page: Number(route.query?.page) || 1,
  search: (route.query?.search as string) || '',
  limit: 20,
})
const isLoading = ref(false)
const totalRecords = ref(0)
const chatbot = ref<any>({})
const listFiles = ref([])
const firstIndexPage = computed(() => {
  return query.value.page > 1 ? (query.value.page - 1) * query.value.limit + 1 : 1
})

const getBot = async () => {
  const { result }: any = await $api(`chat-bot/${route.params.id}`, {
    method: 'GET',
  })
  chatbot.value = result
  if (result.config_gpt?.success) {
    getData()
  }
}
getBot()

const getData = async () => {
  isLoading.value = true

  const { result, total_pages, total }: any = await $api(`chat-bot/${route.params.id}/vector-file`, {
    method: 'GET',
    params: {
      ...query.value,
    },
  })
  listFiles.value = result || []
  totalRecords.value = total_pages * query.value.limit || 0
  useQueryURL(query.value)
  isLoading.value = false
}

const changePage = (e: any) => {
  query.value.limit = e.rows
  query.value.page = e.page + 1
  getData()
}
const confirmDelete = (record: any) => {
  confirm.require({
    message: t('common.confirm_delete'),
    header: t('common.confirmation'),
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: t('button.cancel'),
    acceptLabel: t('button.delete'),
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      const { statusCode }: any = await $api(`chat-bot/${route.params.id}/vector-file/${record._id}`, {
        method: 'DELETE',
      })
      if (statusCode === 200) {
        getData()
        toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully', life: 3000 })
      }
    },
  })
}

const addFileVector = async (files: any[]) => {
  if (!files.length) return

  try {
    isLoading.value = true
    for(let i = 0; i < files.length; i++) {
      await $api(`chat-bot/${route.params.id}/vector-file`, {
        method: 'POST',
        body: {
          file_id: files[i]._id,
        },
      })
    }
    toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully', life: 3000 })
    getData()
  } catch (error) {
    isLoading.value = false
  }
}

const copyCodeIframe = (val: any) => {
  const url = `${window.location.origin}/bot/${val._id}`
  const position = `${val.position}: 0px`
  const iframe =
    '<script>' +
    `
      const iframe = document.createElement('iframe');
      iframe.id = 'iframe_mightyid';
      iframe.setAttribute('style', 'position: fixed; ${position}; bottom: 0px; width: 402px; height: 506px; background: transparent; border: none; z-index: 100000000;');
      iframe.setAttribute('src', '${url}');
      document.body.appendChild(iframe);
      window.addEventListener("message", receiveMessage, false);
      function receiveMessage(event) {
        const newIf = document.querySelector("#iframe_mightyid")
        if(newIf && event.data.isClose) {
          newIf.remove()
        }
        if (event.data.isCollapse == true) {
          newIf.setAttribute(
            'style',
            'position: fixed; ${position}; bottom: 0px; width: 225px; height: 160px; background: transparent; border: none; z-index: 100000000;',
          )
        }
        if (event.data.isOpen == true) {
          newIf.setAttribute(
            'style',
            'position: fixed; ${position}; bottom: 0px; width: 402px; height: 506px; background: transparent; border: none; z-index: 100000000;',
          )
        }
      }
       ` +
    '<' +
    '/' +
    'script>'
  navigator.clipboard.writeText(iframe)
  toast.add({ severity: 'success', summary: 'Notifications', detail: 'Copied', life: 3000 })
}
const copyBot = (val: any) => {
  const url = `${window.location.origin}/bot/${val}`
  navigator.clipboard.writeText(url)
  toast.add({ severity: 'success', summary: 'Notifications', detail: 'Copied', life: 3000 })
}
watchDebounced(
  () => query.value.search,
  (newValue) => {
    query.value.page = 1
    getData()
  },
  { debounce: 600, maxWait: 3000 },
)
</script>

<template>
  <div class="page">
    <div class="page-content">
      <div class="flex flex-row items-center justify-between">
        <div class="page-heading m-0">Chatbot</div>
      </div>
      <div class="bg-white fc p-4 mt-4 rounded gap-4">
        <div class="mb-3 flex items-center gap-4 justify-between min-h-42px">
          <div class="flex gap-4 mt-4">
            <BaseAvatar :size="64" :url="chatbot.avatar" />
            <div class="flex flex-col c-black-90 capitalize">
              <span class="text-lg font-semibold">
                {{ chatbot?.name }}
                <img v-if="chatbot?.is_active" class="icon" src="~/assets/icons/i-check-primary.svg" alt="" />
              </span>
              <span>
                <img class="icon" src="~/assets/icons/i-message.svg" alt="" />
                {{ chatbot?.message }}
              </span>
            </div>
          </div>
          <div>
            <button @click="copyBot(chatbot?._id)">
              <img class="icon-lg" src="~/assets/icons/i-copy.svg" alt="" v-tooltip.top="'Copy bot'" />
            </button>
            <button @click="copyCodeIframe(chatbot)">
              <img class="icon-lg" src="~/assets/icons/i-copy.svg" alt="" v-tooltip.top="'Copy code iframe'" />
            </button>
            <nuxt-link :to="`/chatbot/edit/${chatbot?._id}`">
              <img class="icon-lg" src="~/assets/icons/i-pen-circle.svg" alt="" v-tooltip.top="'Edit'" />
            </nuxt-link>
          </div>
        </div>
        <div className="mb-4 flex items-center justify-end gap-4">
          <BaseSearch v-model="query.search" />

          <BaseButtonUpload acceptFile="txt, .pdf, .docx, text/plain, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            @onUpload="addFileVector" :acl="false" :multiple="true"
          >
            <div class="p-2 h-[42px] flex justify-center items-center bg-primary rounded">
              <img src="~/assets/icons/i-upload-white.svg" />
              <span class="text-base font-normal text-center text-white">{{ t('button.upload') }}</span>
            </div>
          </BaseButtonUpload>
        </div>
        <DataTable
          v-if="chatbot.config_gpt?.success"
          :value="listFiles"
          dataKey="_id"
          rowHover
          lazy
          scrollable
          paginator
          :first="firstIndexPage"
          :totalRecords="totalRecords"
          :rows="query.limit"
          :loading="isLoading"
          RowsPerPageDropdown
          :rowsPerPageOptions="[20, 50, 100]"
          @page="changePage"
        >
          <Column header="#" :frozen="true" alignFrozen="left">
            <template #body="slotProps">
              {{ slotProps.index + firstIndexPage }}
            </template>
          </Column>
          <Column :header="t('common.name')" :frozen="true" alignFrozen="left">
            <template #body="slotProps">
              <span class="fr ai-c gap-2">
                {{ slotProps.data?.file?.name }}
              </span>
            </template>
          </Column>

          <Column style="min-width: 200px" field="created_at" :header="t('common.created_at')">
            <template #body="slotProps">
              {{ useMoment(slotProps.data.created_at) }}
            </template>
          </Column>
         
          <Column
            :header="t('common.actions')"
            :frozen="true"
            alignFrozen="right"
            :pt="{ root: { class: 'flex jc-fe' } }"
          >
            <template #body="slotProps">
              <div class="flex gap-2 jc-fe">
                <nuxt-link target="_blank" :to="slotProps.data.file?.url">
                  <img class="icon-lg" src="~/assets/icons/i-download-primary-circle.svg" alt="" v-tooltip.top="'Edit'" />
                </nuxt-link>
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
        <div v-else>
          <h3 class="mb-3 text-base font-normal c-danger">
            {{ t('common.config_gpt_error') }}
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>
