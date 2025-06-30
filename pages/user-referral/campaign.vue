<script lang="ts" setup>
const route = useRoute()
const { $api } = useNuxtApp()
const confirm = useConfirm()
const toast = useToast()
const query = ref({
  page: Number(route.query?.page) || 1,
  search: (route.query?.search as string) || '',
})
const { t } = useI18n()
const isLoading = ref(false)
const perPage = ref(20)
const totalRecords = ref(0)
const listIframe = ref([])
const isShowDetailLink = ref(false)
const linkDetail = ref('')
const isShowCreateLinkBot = ref(false)
const listChatbot = ref<any>([])
const bot_id = ref('')
const recordActive = ref<any>({})
const { user } = useAuth()
const firstIndexPage = computed(() => {
  return query.value.page > 1 ? (query.value.page - 1) * perPage.value + 1 : 1
})

const getListBot = async () => {
  const { loading, result, total_pages, total }: any = await $api('chat-bot', {
    method: 'GET',
    params: {
      ...query.value,
    },
  })
  listChatbot.value = result || []
}
const getData = async () => {
  isLoading.value = true

  const { loading, result, total_pages, total }: any = await $api('iframe', {
    method: 'GET',
    params: {
      ...query.value,
    },
  })
  listIframe.value = result || []
  totalRecords.value = total_pages * perPage.value || 0
  useQueryURL(query.value)
  isLoading.value = false
  nextTick(() => {
    getListBot()
  })
}
getData()

const changePage = (e: any) => {
  perPage.value = e.rows
  query.value.page = e.page + 1
  getData()
}
const confirmDelete = (record: any) => {
  confirm.require({
    message: t('common.confirm_delete'),
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: t('button.cancel'),
    acceptLabel: t('button.delete'),
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      const { data }: any = await $api(`iframe/${record._id}`, {
        method: 'DELETE',
      })
      if (data.value.statusCode === 200) {
        getData()
        toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully', life: 3000 })
      }
    },
    reject: () => {
      // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
    },
  })
}
const linkIframeBot = computed(() => {
  return `${window.location.origin}/bot/${bot_id.value}?iframe_id=${recordActive.value?._id}`
})
const openViewDetailLink = (record: any) => {
  isShowDetailLink.value = true
  linkDetail.value = `${window.location.origin}/iframe/crm/create?company_id=${user?.value.company?._id}&iframe_id=${record._id}&label=${record.label}`
}
const openCreateLinkBot = (record: any) => {
  isShowCreateLinkBot.value = true
  recordActive.value = record
}
const copyLink = (link: string) => {
  navigator.clipboard.writeText(link)
  toast.add({ severity: 'success', summary: 'Notifications', detail: 'Copied', life: 3000 })
}
</script>

<template>
  <div class="page">
    <div class="page-content">
      <div class="flex flex-row items-center justify-between">
        <div class="page-heading m-0"> {{ t('common.campaign') }} </div>
        <div class="flex items-center justify-end gap-4">
          <nuxt-link to="/link/create">
            <Button type="button" size="small" :label="t('button.create')">
              <template #icon>
                <img src="~/assets/icons/i-plus-white.svg" alt="" />
              </template>
            </Button>
          </nuxt-link>
        </div>
      </div>
      <div class="bg-white fc p-4 mt-4 rounded">
        <BaseSearch v-model="query.search" @onSearch="getData" />
        <DataTable
          :value="listIframe"
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
              <div :to="`/crm/${slotProps.data._id}`" class="fr ai-c gap-2">
                {{ slotProps.index + firstIndexPage }}
                <TagIcon :color="slotProps.data?.label?.color" v-if="slotProps.data?.label" />
              </div>
            </template>
          </Column>
          <Column :header="t('common.name')">
            <template #body="slotProps">
              <span class="fr ai-c gap-2">
                {{ slotProps.data.name }}
              </span>
            </template>
          </Column>

          <Column field="status" :header="t('common.status')">
            <template #body="slotProps">
              <!-- <BaseSwitch v-model="slotProps.data.is_active" :disabled="true" /> -->
              <img src="~/assets/icons/i-check-primary.svg" v-if="slotProps.data.is_active" alt="" />
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
                <button @click="openCreateLinkBot(slotProps.data)" v-tooltip.top="'Link campaign with bot'">
                  <img class="icon-lg" src="~/assets/icons/i-eye-secondary-circle.svg" alt="" />
                </button>
                <button @click="openViewDetailLink(slotProps.data)" alt="" v-tooltip.top="'Link campaign'">
                  <img class="icon-lg" src="~/assets/icons/i-eye-secondary-circle.svg" />
                </button>
                <nuxt-link :to="`/link/edit/${slotProps.data._id}`">
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
    <BaseDialog :visible="isShowDetailLink" @closeDialog="isShowDetailLink = false">
      <div class="fc">
        <span class="text-base break-all">
          {{ linkDetail }}
        </span>
        <div class="flex ai-c jc-c mb-3">
          <Qr-Code v-if="linkDetail" :value="linkDetail" />
        </div>
      </div>
      <div class="flex justify-end gap-4 mt-4">
        <Button :label="t('button.cancel')" severity="secondary" type="button" @click="isShowDetailLink = false" />
        <Button label="Copy Link" severity="primary" type="button" @click="copyLink(linkDetail)" v-if="linkDetail" />
      </div>
    </BaseDialog>
    <BaseDialog :visible="isShowCreateLinkBot" @closeDialog="isShowCreateLinkBot = false">
      <div class="fc gap-4">
        <BaseInputSelect
          :options="listChatbot"
          optionLabel="name"
          optionValue="_id"
          :filterDefault="true"
          v-model="bot_id"
          label="BOT"
        />
        <span class="text-base break-all" v-if="bot_id">
          {{ linkIframeBot }}
        </span>
        <div class="flex ai-c jc-c mb-3" v-if="bot_id">
          <Qr-Code v-if="linkIframeBot" :value="linkIframeBot" />
        </div>
      </div>
      <div class="flex justify-end gap-4 mt-4">
        <Button :label="t('button.cancel')" severity="secondary" type="button" @click="isShowCreateLinkBot = false" />
        <Button label="Copy Link" severity="primary" type="button" @click="copyLink(linkIframeBot)" v-if="bot_id" />
      </div>
    </BaseDialog>
  </div>
</template>
