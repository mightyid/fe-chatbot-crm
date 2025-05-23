<script lang="ts" setup>
import RoleForm from '~/components/Role/RoleForm.vue'
import { PATH_ROLE_LIST } from '~/constant/routerPath'
import type { BodyRoleType } from '~/types/settings'

definePageMeta({
  titleBreadCrumb: 'button.edit',
  permission: 'update_role',
})

const { $auth } = useNuxtApp()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const allowanceServices = useRole()

const isLoading = ref(false)
const isSubmit = ref(false)
const form = ref<BodyRoleType>({
  name: '',
  branches: [],
  permissions: [],
  is_admin: false,
  is_active: false,
})

const roleId = computed(() => route.params.id as string)

const getRoleById = async () => {
  try {
    isLoading.value = true
    const { statusCode, result = {} } = await allowanceServices.getRoleById(roleId.value)

    form.value = {
      name: result?.name || '',
      branches: result?.branches || [],
      permissions: result?.permissions || [],
      is_admin: result?.is_admin ?? false,
      is_active: result?.is_active ?? false,
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
getRoleById()

const updateRoleById = async (newPermissions: string[]) => {
  try {
    isSubmit.value = true

    const { statusCode } = await allowanceServices.updateRoleById(roleId.value, {
      name: form.value.name || '',
      is_admin: form.value.is_admin ?? false,
      is_active: form.value.is_active ?? false,
      branches: form.value.branches || [],
      permissions: newPermissions || [],
    })

    if (statusCode >= 200 && statusCode < 300) {
      // Fetch user if role update same user's role
      const userRoleId = ($auth?.user as any)?.role?._id
      if (roleId.value === userRoleId) {
        $auth.fetchUser()
      }

      toast.add({ severity: 'success', summary: t('common.success'), detail: t('common.updated'), life: 3000 })
      router.push(PATH_ROLE_LIST)
    }
  } catch (error) {
    console.log(error)
  } finally {
    isSubmit.value = false
  }
}

const redirectToRoleList = () => {
  router.push(PATH_ROLE_LIST)
}
</script>

<template>
  <div class="page">
    <div class="page-content">
      <BreadCrumb />

      <div class="box p-4">
        <div class="my-6 text-center" v-if="isLoading">
          <ProgressSpinner />
        </div>

        <template v-else>
          <RoleForm
            v-model:name="form.name"
            v-model:branches="form.branches"
            v-model:permissions="form.permissions"
            v-model:is_admin="form.is_admin"
            v-model:is_active="form.is_active"
            :isSubmit="isSubmit"
            @onSubmit="updateRoleById"
            @onCancel="redirectToRoleList"
          />
        </template>
      </div>
    </div>
  </div>
</template>
