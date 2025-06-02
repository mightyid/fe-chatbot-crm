<script lang="ts" setup>
const route = useRoute()
const { $api } = useNuxtApp()
const confirm = useConfirm()
const toast = useToast()
const query = ref({
  page: Number(route.query?.page) || 1,
  search: (route.query?.search as string) || '',
})
const isLoading = ref(false)
const perPage = ref(20)
const totalRecords = ref(0)
const listChatbot = ref([])
const firstIndexPage = computed(() => {
  return query.value.page > 1 ? (query.value.page - 1) * perPage.value + 1 : 1
})
const getData = async () => {
  isLoading.value = true

  const { loading, result, total_pages, total }: any = await $api('chat-bot', {
    method: 'GET',
    params: {
      ...query.value,
    },
  })
  listChatbot.value = result || []
  totalRecords.value = total_pages * perPage.value || 0
  useQueryURL(query.value)
  isLoading.value = false
}
getData()

const changePage = (e: any) => {
  perPage.value = e.rows
  query.value.page = e.page + 1
  getData()
}
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
      const { statusCode }: any = await $api(`chat-bot/${record._id}`, {
        method: 'DELETE',
      })
      if (statusCode === 200) {
        getData()
        toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully', life: 3000 })
      }
    },
    reject: () => {
      // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
    },
  })
}
const changeStatus = (id: any) => {
  $api(`chat-bot/${id}/change-status`, {
    method: 'PUT',
  })
}
const copyCodeIframe = (val: any) => {
  const url = `${window.location.origin}/bot/${val}`
  const position = 'right: 16px;'
  const iframe =
    '<script>' +
    `
      const iframe = document.createElement('iframe');
      iframe.id = 'iframe_mightyid';
      iframe.setAttribute('style', 'position: fixed; ${position}; bottom: 16px; width: 402px; height: 498px; background: transparent; border: none; z-index: 100000000;');
      iframe.setAttribute('src', '${url}');
      document.body.appendChild(iframe);
      window.addEventListener("message", receiveMessage, false);
      function receiveMessage(event) {
        const newIf = document.querySelector("#iframe_mightyid")
        if(newIf && event.data.isClose) {
          newIf.remove()
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
        <div class="flex items-center justify-end gap-4">
          <nuxt-link to="/chatbot/create">
            <Button type="button" size="small" label="Create">
              <template #icon>
                <img src="~/assets/icons/i-plus-white.svg" alt="" />
              </template>
            </Button>
          </nuxt-link>
        </div>
      </div>
      <div class="bg-white fc p-4 mt-4 rounded gap-4">
        <BaseSearch v-model="query.search" />
        <DataTable
          :value="listChatbot"
          dataKey="_id"
          rowHover
          lazy
          scrollable
          paginator
          :first="firstIndexPage"
          :totalRecords="totalRecords"
          :rows="perPage"
          :loading="isLoading"
          RowsPerPageDropdown
          :rowsPerPageOptions="[20, 50, 100]"
          @page="changePage"
        >
          <Column header="#" :frozen="true" alignFrozen="left">
            <template #body="slotProps">
              <nuxt-link :to="`/crm/${slotProps.data._id}`" class="c-primary fr ai-c gap-2">
                {{ slotProps.index + firstIndexPage }}
                <TagIcon :color="slotProps.data?.label?.color" v-if="slotProps.data?.label" />
              </nuxt-link>
            </template>
          </Column>
          <Column header="Name" :frozen="true" alignFrozen="left">
            <template #body="slotProps">
              <span class="fr ai-c gap-2">
                {{ slotProps.data.name }}
              </span>
            </template>
          </Column>

          <Column style="min-width: 200px" field="config_gpt" header="Config">
            <template #body="slotProps">
              <img
                src="~/assets/icons/i-tick-primary.svg"
                alt=""
                v-if="slotProps.data.config_gpt && slotProps.data.config_gpt.success"
              />
            </template>
          </Column>
          <Column style="min-width: 200px" field="created_at" header="Created at">
            <template #body="slotProps">
              {{ useMoment(slotProps.data.created_at) }}
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="slotProps">
              <BaseSwitch v-model="slotProps.data.is_active" @update:model-value="changeStatus(slotProps.data)" />
            </template>
          </Column>

          <Column header="Actions" :frozen="true" alignFrozen="right" :pt="{ root: { class: 'flex jc-fe' } }">
            <template #body="slotProps">
              <div class="flex gap-2 jc-fe">
                <button @click="copyBot(slotProps.data._id)">
                  <img
                    class="icon-lg"
                    src="~/assets/icons/i-eye-secondary-circle.svg"
                    alt=""
                    v-tooltip.top="'Copy bot'"
                  />
                </button>
                <button @click="copyCodeIframe(slotProps.data._id)">
                  <img
                    class="icon-lg"
                    src="~/assets/icons/i-eye-secondary-circle.svg"
                    alt=""
                    v-tooltip.top="'Copy code iframe'"
                  />
                </button>
                <nuxt-link :to="`/chatbot/edit/${slotProps.data._id}`">
                  <img class="icon-lg" src="~/assets/icons/i-pen-circle.svg" alt="" v-tooltip.top="'Edit'" />
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
      </div>
    </div>
  </div>
</template>
