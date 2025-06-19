<script setup lang="ts">
import { useAppStore } from '~/stores/app'

import {
  iChatbot,
  iChatbotActive,
  iCrm,
  iCrmActive,
  iEmployee,
  iEmployeeActive,
  iSetting,
  iSettingActive,
  iUser,
  iUserActive,
} from '~/assets/icons'
// import { cloneDeep } from 'lodash'
import { PATH_EMPLOYEES_LIST, PATH_POSITION_LIST, PATH_ROLE_LIST } from '~/constant/routerPath'
const appStore = useAppStore()
const isUser = computed(() => (appStore.strategyAuth == 'user' ? true : false))

type MenuType = {
  name: string
  menuKey: string
  menus: NavItemType[]
}

type NavItemType = {
  title: string
  key: string
  permissionKey?: string
  icon: string
  iconActive: string
  isCollapse?: boolean
  sub?: SubItemType[]
  to?: string
}

type SubItemType = {
  title: string
  key: string
  permissionKey?: string
  to: string
}

const props = defineProps({
  isSidebarCollapse: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const { t, locale } = useI18n()
const { user }: any = useAuth()

const VERSION = '1.0.0'
const DEFAULT_NAV = [
  {
    name: 'common.menu',
    menuKey: 'menu',
    menus: [
      {
        title: 'CRM',
        key: 'crm',
        icon: iCrm,
        iconActive: iCrmActive,
        to: '/crm',
      },
      {
        title: 'Message',
        key: 'message',
        icon: iEmployee,
        iconActive: iEmployeeActive,
        to: '/chat',
      },
      {
        title: 'Chatbot',
        key: 'chatbot',
        icon: iChatbot,
        iconActive: iChatbotActive,
        to: '/chatbot',
      },
      // {
      //   title: 'common.employee',
      //   key: 'menu-employees',
      //   icon: iEmployee,
      //   iconActive: iEmployeeActive,
      //   sub: [
      //     {
      //       title: 'common.employees',
      //       key: 'employees',
      //       permissionKey: 'view_employee',
      //       to: PATH_EMPLOYEES_LIST,
      //     },
      //     {
      //       title: 'common.role',
      //       key: 'roles',
      //       permissionKey: 'view_roles',
      //       to: PATH_ROLE_LIST,
      //     },
      //   ],
      // },
    ],
  },
] as MenuType[]
const DEFAULT_NAV_ADMIN = [
  {
    name: 'common.menu',
    menuKey: 'menu',
    menus: [
      {
        title: 'Company',
        key: 'crm',
        icon: iCrm,
        iconActive: iCrmActive,
        to: '/admin/company',
      },
    ],
  },
] as MenuType[]

const navByPermissions = ref<MenuType[]>([])

const getNavAdmin = () => {
  navByPermissions.value = []
  // const userPermissions = (user.value?.role?.permissions as string[]) || []
  // const isRoleActive = user.value?.role?.is_active
  // if (user.value?.is_admin) {
  //   navByPermissions.value = JSON.parse(JSON.stringify(DEFAULT_NAV))
  // } else {
  //   const cloneDefaultNav = JSON.parse(JSON.stringify(DEFAULT_NAV))
  //   cloneDefaultNav.forEach((item: MenuType) => {
  //     const menus = [] as NavItemType[]

  //     item?.menus?.forEach((nav: NavItemType) => {
  //       if (nav?.sub && nav?.sub?.length > 0) {
  //         const subMatches = [] as SubItemType[]

  //         nav?.sub?.forEach((sub: SubItemType) => {
  //           if (
  //             (isRoleActive && sub?.permissionKey && userPermissions?.includes(sub?.permissionKey)) ||
  //             !sub.permissionKey
  //           ) {
  //             subMatches.push(sub)
  //           }
  //         })

  //         if (subMatches?.length > 0) {
  //           menus.push({
  //             ...nav,
  //             sub: subMatches,
  //           })
  //         }
  //       } else {
  //         if (
  //           (isRoleActive && nav?.permissionKey && userPermissions?.includes(nav?.permissionKey)) ||
  //           !nav.permissionKey ||
  //           (nav?.permissionKey === 'view_form' && user.value?.is_manager)
  //         ) {
  //           menus?.push(nav)
  //         }
  //       }
  //     })

  //     if (menus?.length > 0) {
  //       navByPermissions.value.push({
  //         name: item?.name,
  //         menuKey: item?.menuKey,
  //         menus,
  //       })
  //     }
  //   })
  // }
  if (isUser.value) {
    navByPermissions.value = JSON.parse(JSON.stringify(DEFAULT_NAV))
  } else {
    navByPermissions.value = JSON.parse(JSON.stringify(DEFAULT_NAV_ADMIN))
  }
}
getNavAdmin()

const checkActiveRoute = (nav: NavItemType) => {
  const currentParentPath = route.path.split('/')[1]

  if (nav?.sub && nav?.sub?.length > 0) {
    return currentParentPath === nav?.key ? true : false
  } else {
    const navToNoSlash = nav?.to?.split('/')[1]

    return currentParentPath === navToNoSlash ? true : false
  }
}

const toggleNavItemByKey = (key: string) => {
  navByPermissions.value?.forEach((item) => {
    const index = item?.menus.findIndex((nav: NavItemType) => nav?.key === key)
    const itemByKey = item?.menus[index]
    if (itemByKey?.sub && itemByKey?.sub?.length > 0) {
      const newItem = {
        ...itemByKey,
        isCollapse: !itemByKey?.isCollapse,
      }
      item?.menus?.splice(index, 1, newItem)
    }
  })
}

watch(
  () => locale.value,
  (newValue) => {
    if (newValue) {
      getNavAdmin()
    }
  },
)

watch(
  () => user,
  (newValue) => {
    if (newValue) {
      getNavAdmin()
    }
  },
  { deep: true },
)

onMounted(() => {
  const parentPath = route.path.split('/')[1]
  toggleNavItemByKey(parentPath)
})
</script>

<template>
  <nav class="pb-1 overflow-y-auto" style="transition: all linear 0.3s">
    <div class="[&:not(:last-child)]:mb-[8px]" v-for="item in navByPermissions" :key="item?.menuKey">
      <p
        class="mt-0 mb-[8px] px-[16px] text-base font-normal c-black-60"
        :class="isSidebarCollapse ? ['text-center'] : ['']"
        v-if="item?.name"
      >
        {{ t(item?.name) }}
      </p>

      <ul class="pl-0 my-0 list-none">
        <li v-for="nav in item?.menus" :key="nav.title">
          <nuxt-link
            class="py-[12px] px-[16px] flex items-center gap-[12px] no-underline cursor-pointer"
            :class="[
              checkActiveRoute(nav) ? ['bg-primary'] : ['bg-white hover:bg-gray-10'],
              isSidebarCollapse ? ['justify-center'] : '',
            ]"
            style="transition: all linear 0.3s"
            :to="nav?.to"
            @click="toggleNavItemByKey(nav?.key)"
          >
            <img class="icon" :src="nav?.iconActive" alt="" v-if="checkActiveRoute(nav)" />
            <img class="icon" :src="nav?.icon" alt="" v-else />
            <Transition name="fade">
              <div class="flex-1 overflow-hidden" v-show="!isSidebarCollapse">
                <span
                  class="block w-max text-base font-normal"
                  :class="checkActiveRoute(nav) ? ['c-white'] : ['c-black-80']"
                  style="transition: all linear 0.3s"
                >
                  {{ t(nav?.title) }}
                </span>
              </div>
            </Transition>

            <img
              class="icon transition-all"
              :class="[nav?.isCollapse && 'rotate-180', checkActiveRoute(nav) && 'brightness-0 invert']"
              src="~/assets/icons/i-angle-down-black.svg"
              alt=""
              v-if="nav?.sub && nav?.sub?.length > 0"
            />
          </nuxt-link>

          <!-- Sub -->
          <template v-if="nav?.sub && nav?.sub?.length > 0">
            <ul class="sub-menu pl-0 my-0 list-none" v-show="nav?.isCollapse">
              <li v-for="children in nav?.sub" :key="children.key">
                <nuxt-link
                  class="py-[12px] px-[16px] flex items-center gap-[12px] no-underline bg-white cursor-pointer hover:bg-gray-10"
                  :class="[isSidebarCollapse ? ['justify-center'] : '']"
                  style="transition: all linear 0.3s"
                  :to="children?.to"
                >
                  <img
                    class="icon"
                    src="~/assets/icons/i-sub-menu-active.svg"
                    alt=""
                    v-if="route.path === children?.to"
                  />
                  <img class="icon" src="~/assets/icons/i-sub-menu.svg" alt="" v-else />
                  <Transition name="fade">
                    <div class="flex-1 overflow-hidden" v-show="!isSidebarCollapse">
                      <span
                        class="block w-max text-base font-normal"
                        :class="route.path === children?.to ? ['c-primary'] : ['c-black-80']"
                        style="transition: all linear 0.3s"
                      >
                        {{ t(children?.title) }}
                      </span>
                    </div>
                  </Transition>
                </nuxt-link>
              </li>
            </ul>
          </template>
        </li>
      </ul>
    </div>

    <p class="m-0 ml-4 text-small c-black-60"> Version: {{ VERSION }} </p>
  </nav>
</template>

<style lang="scss" scoped>
.sub-menu {
  .router-link-active {
    background-color: var(--primary-color-10);
  }
}

// .fade-enter-active {
//   transition: all linear 1s;
// }

.fade-enter-active,
.fade-leave-active {
  transition: all linear 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
