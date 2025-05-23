<script setup lang="ts">
import useMoment from '@/composables/useMoment'
definePageMeta({
  permission: 'manager_application',
})
const appStore = useAppStore()
const route = useRoute()
const router = useRouter()
const parentURL = `/crm/${route.params.id}`
const isShowOpenDialog = ref(false)
const toast = useToast()
const labels = ref<any>([])
const { $api } = useNuxtApp()
const links = ref([
  {
    title: 'Lead CRM',
    to: '/crm',
  },
  {
    title: 'Detail Lead CRM',
    to: route.path,
  },
])

const detail = ref<any>({})
const TAB_LIST = computed(() => {
  let tabs = [
    {
      title: 'Detail',
      to: parentURL,
    },
    {
      title: 'Note',
      to: parentURL + '/note',
    },
  ]

  return tabs
})

const currentTab = ref(route.path)
const changeCurrentTab = (key: string) => {
  currentTab.value = key
}
const getDetail = async () => {
  const { result } = await $api<any>(`lead/${route.params.id}`, {
    method: 'GET',
  })
  if (result) {
    detail.value = result || {}
  }
}
const getDataLabels = async () => {
  const { result } = await $api<any>(`crm-label`, {
    method: 'GET',
  })
  if (result) {
    labels.value = result || {}
  }
}
getDataLabels()
getDetail()

watch(
  () => route.path,
  (newValue) => {
    currentTab.value = route.path
    links.value[1].to = route.path
  },
  { deep: true },
)
</script>

<template>
  <div class="page">
    <div class="page-content">
      <BreadCrumbLinks :links="links" />

      <div class="p-3 bg-white rounded">
        <div>
          <div class="mb-3 flex items-center gap-4 justify-between min-h-42px">
            <div class="flex items-center gap-2">
              <TagIcon
                :color="labels.find((item :any) => item._id === detail?.label)?.color"
                v-if="labels.length > 0 && detail?.label"
              />
              <h2
                class="name text-lg c-black-90 font-bold"
                v-if="labels.length > 0 && detail?.label"
                :style="{color: labels.find((item :any) => item._id === detail?.label)?.color}"
              >
                {{ labels.find((item: any) => item._id === detail?.label)?.name }}
              </h2>
              <!-- <StatusApplication :status="detail.status" @changeStatus="changeStatus" :listReason="detail.reason" /> -->
            </div>
            <div class="fr ai-c gap-4">
              <nuxt-link :to="`/crm/edit/${route.params.id}`">
                <Button label="Edit CRM" type="button" />
              </nuxt-link>
            </div>
          </div>

          <!-- Tab List -->
          <div class="mb-4 flex items-center ovf-a w-full border-b border-b-black-20 border-b-solid">
            <nuxt-link
              class="py-1 px-4 text-base c-black-60 rounded-t cursor-pointer hover:bg-gray-20 flex-nowrap whitespace-nowrap min-w-fit"
              v-for="item in TAB_LIST"
              :key="item.to"
              :to="item.to"
              :class="item.to === currentTab ? ['!bg-primary', '!c-white'] : null"
              @click="changeCurrentTab(item.to)"
            >
              {{ item.title }}
            </nuxt-link>
          </div>
        </div>

        <NuxtPage :data="detail" @onGetData="getDetail" />
      </div>
    </div>
  </div>
</template>
