<script lang="ts" setup>
import type { EmployeeDetailType } from '~/types/employee.ts'
import { PATH_EMPLOYEES_LIST } from '~/constant/routerPath'

definePageMeta({
  titleBreadCrumb: 'button.detail',
  permission: 'view_employee',
})

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const employeeServices = useEmployee()

const indexTabActive = ref(0)
const isLoading = ref(false)
const employee = ref<EmployeeDetailType>()

const getEmployeeById = async () => {
  try {
    isLoading.value = true
    const { statusCode, result } = await employeeServices.getEmployeeById(route.params.id as string)
    console.log(result, 'result')
    employee.value = result || {}
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
getEmployeeById()

const redirectTeachersList = () => {
  router.push(PATH_EMPLOYEES_LIST)
}

const redirectEdit = () => {
  router.push(`/employees/${route.params.id}/edit?redirect=${route.query.tab}`)
}
</script>

<template>
  <div class="page">
    <div class="page-content p-4">
      <BreadCrumbLinks class="mb-4" />

      <div class="box p-4">
        <div class="my-6 text-center" v-if="isLoading">
          <ProgressSpinner />
        </div>

        <template v-else>
          <template v-if="employee?._id">
            <div class="flex flex-col gap-4 mb-3 items-center">
              <BaseAvatar :size="80" type="circle" :url="employee?.avatar" v-if="employee?.avatar" />
              <img class="w-[80px] h-[80px] rounded-[50%]" src="~/assets/icons/i-avt-default.svg" v-else />
              <div class="flex flex-col gap-2">
                <div class="mt-0 text-xl font-bold c-black-90">
                  {{ employee?.name }}
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-[16px]">
              <Button
                :label="t('button.back')"
                outlined
                size="large"
                severity="secondary"
                type="button"
                @click="redirectTeachersList"
              />

              <Button
                :label="t('button.edit')"
                size="large"
                severity="primary"
                type="button"
                @click="redirectEdit"
                v-can="'update_employee'"
                v-if="route.query?.tab !== 'activity'"
              />
            </div>
          </template>

          <p class="text-base font-normal" v-else>
            {{ t('common.no_data') }}
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
