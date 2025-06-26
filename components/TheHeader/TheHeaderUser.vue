<script setup lang="ts">
import { iProfile, iSetting, iLogout, iKey, iUpdateInformation } from '~/assets/icons'

const { user, logout } = useAuth()
const { t } = useI18n()
const router = useRouter()
const isReferral = computed(() => (useAppStore().strategyAuth == 'referral' ? true : false))
const overPanel = ref()
const actions = ref([
  {
    icon: iUpdateInformation,
    name: 'common.update_information',
    action() {
      router.push('/update-information')
      hidePanel()
    },
  },
  {
    icon: iUpdateInformation,
    name: 'Company Profile',
    action() {
      router.push('/company-profile')
      hidePanel()
    },
  },
  {
    icon: iProfile,
    name: 'Change Password',
    action() {
      router.push('/change-password')
      hidePanel()
    },
  },
  {
    icon: iLogout,
    name: 'common.logout',
    action() {
      logout()
      hidePanel()
    },
  },
])
const actionsUserReferral = ref([
  {
    icon: iLogout,
    name: 'common.logout',
    action() {
      logout()
      hidePanel()
    },
  },
])

const toggle = (event: Event) => {
  overPanel.value.toggle(event)
}

const hidePanel = () => {
  overPanel.value.hide()
}
</script>

<template>
  <BaseAvatar class="cursor-pointer" :size="32" @click="toggle" :url="user.avatar" />

  <OverlayPanel ref="overPanel">
    <div class="w-[300px]">
      <div class="mb-[16px] flex items-center gap-[12px]">
        <BaseAvatar :size="32" :url="user.avatar" />
        <div class="flex-1 flex-col">
          <span class="text-base font-normal c-black-90 line-clamp-1">
            {{ user.name }}
          </span>
          <span class="text-xs font-normal c-gray-50 line-clamp-1">
            {{ user.email }}
          </span>
        </div>
      </div>

      <div class="mx-[-12px]">
        <template v-for="item in isReferral ? actionsUserReferral : actions" :key="item?.name">
          <div
            class="p-[12px] flex items-center gap-[12px] bg-white cursor-pointer transition-all hover:bg-gray-10"
            @click="item?.action"
          >
            <img class="icon" :src="item?.icon" alt="" />
            <span
              class="text-base font-normal"
              :class="item?.name?.includes('common.logout') ? 'c-danger' : 'c-gray-50'"
            >
              {{ t(item?.name) }}
            </span>
          </div>
        </template>
      </div>
    </div>
  </OverlayPanel>
</template>
