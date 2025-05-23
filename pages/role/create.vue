<script lang="ts" setup>
import RoleForm from '~/components/Role/RoleForm.vue'
import useRole from '~/composables/useRole'
import { PATH_ROLE_LIST } from '~/constant/routerPath'

definePageMeta({
  titleBreadCrumb: 'button.add_new',
  permission: 'create_role',
})

const { t } = useI18n()
const router = useRouter()
const toast = useToast()
const roleServices = useRole()

const isSubmit = ref(false)
const form = ref({
  name: '',
  branches: [],
  permissions: [],
  is_admin: false,
  is_active: true,
})

const createRole = async (newPermissions: string[]) => {
  try {
    isSubmit.value = true

    const { statusCode } = await roleServices.createRole({
      name: form.value.name || '',
      is_admin: form.value.is_admin ?? false,
      branches: form.value.branches || [],
      permissions: newPermissions || [],
      is_active: form.value.is_active ?? false,
    })

    if (statusCode >= 200 && statusCode < 300) {
      toast.add({ severity: 'success', summary: t('common.success'), detail: t('common.added'), life: 3000 })
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
        <RoleForm
          v-model:name="form.name"
          v-model:is_admin="form.is_admin"
          v-model:is_active="form.is_active"
          v-model:branches="form.branches"
          v-model:permissions="form.permissions"
          :isSubmit="isSubmit"
          @onSubmit="createRole"
          @onCancel="redirectToRoleList"
        />
      </div>
    </div>
  </div>
</template>
