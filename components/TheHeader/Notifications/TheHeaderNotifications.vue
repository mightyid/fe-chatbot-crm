<script setup lang="ts">
import TheHeaderNotificationsItem from './TheHeaderNotificationsItem.vue'
import { useAppStore } from '~/stores/app'
import { NOTIFICATION_EVENT } from '~/constant/eventKeys'

const { $auth, $socket } = useNuxtApp()
const appStore = useAppStore()
const { t } = useI18n()
const route = useRoute()
const notificationServices = useNotification()
const { $auth: auth } = useNuxtApp()

const overPanel = ref()
const notifications = ref<any>([])
const pagination = ref({
  currentPage: 1,
  totalPage: 1,
})
const numberUnread = ref<any>(undefined)
const isLoading = ref(false)

const isDisabledButtonSeenAll = computed(() => {
  const totalNotSeen = notifications.value?.filter((item: any) => !item?.seen?.includes($auth?.user?._id))?.length

  return totalNotSeen ? false : true
})

const toggle = (event: Event) => {
  overPanel.value.toggle(event)
  notifications.value = []
  pagination.value.currentPage = 1
  pagination.value.totalPage = 1
  getNotifications()
}

const hidePanel = () => {
  overPanel.value.hide()
}

const getNumberUnread = async () => {
  try {
    const { result, statusCode } = await notificationServices.getNumberUnread()

    numberUnread.value = result?.number && result?.number > 99 ? '99+' : result?.number
  } catch (error) {
    console.log(error)
  }
}
getNumberUnread()

const getNotifications = async () => {
  try {
    isLoading.value = true

    const { result = {}, statusCode } = await notificationServices.getNotifications({
      page: pagination.value.currentPage,
      limit: 20,
    })

    notifications.value = [...notifications.value, ...result.data]
    pagination.value.totalPage = result?.total_page

    numberUnread.value = undefined
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const loadMoreNotifications = useThrottleFn(() => {
  if (pagination.value.currentPage < pagination.value.totalPage) {
    pagination.value.currentPage += 1
    getNotifications()
  }
}, 1000)

const seenAll = async () => {
  try {
    const { result, statusCode } = await notificationServices.seenAllNotifications()

    if (statusCode >= 200 && statusCode < 300) {
      const newData = notifications.value?.map((item: any) => {
        item.seen = [...item.seen, $auth?.user?._id]
        return item
      })

      notifications.value = newData
    }
  } catch (error) {
    console.log(error)
  }
}

const seenNotificationById = async (record: any) => {
  // Check notification seen
  const isSeen = record?.seen?.includes($auth?.user?._id)

  if (!isSeen) {
    const { result, statusCode } = await notificationServices.seenNotificationById(record?._id)

    if (statusCode >= 200 && statusCode < 300) {
      const index = notifications.value?.findIndex((item: any) => item?._id === record?._id)

      if (index !== -1) {
        const newItem = {
          ...notifications.value[index],
          seen: [...notifications.value[index]?.seen, $auth?.user?._id],
        }
        notifications.value?.splice(index, 1, newItem)
      }
    }
  }

  // hidePanel()
}

const listenNotification = (res: any) => {
  // console.log(new Date().toLocaleString(), res)

  if (res?._id) {
    notifications.value?.unshift(res)

    if (numberUnread.value === 99 || numberUnread.value === '99') {
      numberUnread.value = '99'
    } else if (numberUnread.value > 99 || numberUnread.value == '99+') {
      numberUnread.value = '99+'
    } else {
      numberUnread.value = numberUnread.value ? numberUnread.value + 1 : 1
    }
  }
}

onMounted(() => {
  $socket.on(NOTIFICATION_EVENT, listenNotification)
})

onBeforeUnmount(() => {
  $socket.off(NOTIFICATION_EVENT)
})

watch(
  () => route.query,
  (newValue) => {
    hidePanel()
  },
)
</script>

<template>
  <button class="p-0" v-badge.danger="numberUnread" type="button" @click="toggle">
    <img class="icon" src="~/assets/icons/i-noti.svg" alt="" />
  </button>

  <OverlayPanel class="!top-[50px]" ref="overPanel">
    <div class="w-[500px]">
      <div class="mb-4 flex items-center justify-between gap-4">
        <span class="text-xl font-normal c-gray-50"> {{ t('common.notifications') }} </span>

        <div class="flex items-center gap-4">
          <button
            class="p-0 flex items-center gap-1"
            type="button"
            :disabled="isDisabledButtonSeenAll"
            @click="seenAll"
          >
            <img class="icon" src="~/assets/icons/i-tick-primary.svg" alt="" />
            <span class="text-base font-normal c-primary"> {{ t('common.mark_all_read') }} </span>
          </button>

          <button class="p-0" type="button" @click="hidePanel">
            <img class="icon" src="~/assets/icons/i-close-black.svg" alt="" />
          </button>
        </div>
      </div>

      <template v-if="notifications?.length > 0">
        <VirtualScroller
          class="-mx-3"
          scrollHeight="60vh"
          :items="notifications"
          :itemSize="40"
          :loading="isLoading"
          @scroll="loadMoreNotifications"
        >
          <template v-slot:item="{ item, options }">
            <TheHeaderNotificationsItem :key="item?._id" :data="item" @click="seenNotificationById(item)" />
          </template>
        </VirtualScroller>
      </template>

      <template v-else>
        <p class="text-base font-normal" v-if="!isLoading">
          {{ t('common.no_data') }}
        </p>
      </template>

      <template v-if="pagination.currentPage === 1">
        <div class="my-6 text-center" v-if="isLoading">
          <ProgressSpinner />
        </div>
      </template>

      <nuxt-link class="block mt-2 text-base font-normal c-primary text-center no-underline" to="/notifications/system">
        {{ t('common.view_all') }}
      </nuxt-link>
    </div>
  </OverlayPanel>
</template>

<style lang="scss" scoped>
:deep(.p-badge-dot) {
  display: none;
}
</style>
