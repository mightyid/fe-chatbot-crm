<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
  isNotiPage: {
    type: Boolean,
    default: false,
  },
})

const { t, messages } = useI18n()
const { $auth, $moment }: any = useNuxtApp()
const route = useRoute()
const router = useRouter()

const isSeen = computed(() => props.data?.seen?.includes($auth?.user?._id))

const getRouteByType = () => {
  const {
    data: { key, value },
    redirect_id,
    user,
  } = props.data

  const workScheduleTimeReplace = value?.time?.replace('/', '-')
  const historyTime = value?.date?.replace('/', '-')

  switch (key) {
    // ======================================== Scope Admin ======================================== //
    // Employee

    default:
      return route.fullPath
  }
}
getRouteByType()

const genrateTextByType = () => {
  const value = props.data?.data?.value || {}

  const user = props.data?.user || {}

  const variables = {
    name: user?.name || '',
    employeeName: value?.employee_name || '',
    branchName: value?.branch_name || '',
    departmentName: value?.department_name || '',
    shiftName: value?.shift_name || '',
    holidayName: value?.public_holiday_name || '',
    allowanceName: value?.allowance_name || '',
    positionName: value?.position_name || '',
    roleName: value?.role_name || '',
    wifiName: value?.wifi_attendance_name || '',
    salaryTime: value?.salary_time || '',
    formName: value?.form_name || '',
    newsName: value?.news_name || '',
    contractName: value?.contract_name || '',
    overtimeName: value?.overtime_name || '',
    contractTypeName: value?.contract_type_name || '',
  }

  const formKeys = ['create-form', 'update-form', 'approve-form', 'reject-form']

  const employeeKeys = Object.keys((messages.value.en.notifications as any).employee)

  const keyByScope =
    (($auth?.user?.role?.is_admin || $auth?.user?.role?.permissions?.length > 0) &&
      !employeeKeys?.includes(props.data?.data?.key)) ||
    ($auth?.user?.is_manager && formKeys.includes(props?.data?.data?.key)) // If user is manager and includes formKeys to change key admin
      ? 'admin'
      : 'employee'

  return t(`notifications.${keyByScope}.${props.data?.data?.key}`, {
    ...variables,
  })
}

const getTimeFromNow = () => {
  const createdAt = props.data?.created_at

  const formattedDate = $moment(createdAt).utc().format('DD/MM/YYYY HH:mm:ss')
  const dateObject = $moment(formattedDate, 'DD/MM/YYYY HH:mm:ss').toDate()

  return $moment(dateObject).fromNow()
}
</script>

<template>
  <nuxt-link
    class="py-2 px-3 flex items-start gap-3 no-underline cursor-pointer transition-all hover:bg-gray-10"
    :to="getRouteByType()"
  >
    <BaseAvatar size="24" :url="data?.user?.avatar" />

    <p :class="['m-0 flex-1 text-base font-normal c-gray-50 ', isNotiPage ? 'line-clamp-none' : 'line-clamp-2']">
      {{ genrateTextByType() }}
    </p>

    <span class="flex items-center gap-1">
      <span class="text-sm font-normal c-gray-35">
        {{ getTimeFromNow() || '-' }}
      </span>

      <span :class="['block -mt-2 w-[6px] h-[6px] ', !isSeen ? 'bg-primary rounded-full' : '']"> </span>
    </span>
  </nuxt-link>
</template>
