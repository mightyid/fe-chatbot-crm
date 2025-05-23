<script lang="ts" setup>
import PermissionTable from '~/components/Role/PermissionTable.vue'
import { useForm } from 'vee-validate'
import useRole from '~/composables/useRole'

const props = defineProps({
  isSubmit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['onSubmit', 'onCancel'])

const route = useRoute()
const { t } = useI18n()
const { handleSubmit } = useForm()
const roleServices = useRole()

const name = defineModel('name', { default: '' })
const is_admin = defineModel<boolean>('is_admin', { default: false })
const is_active = defineModel<boolean>('is_active', { default: false })
const branches = defineModel<string[]>('branches', { default: [] })
const permissions = defineModel<string[]>('permissions', { default: [] })

const isRequired = ref(false)
const isLoadingBranch = ref(false)
const isLoadingPermission = ref(false)
const branchOptions = ref<any>([])
const permissionOrigin = ref<any>([])
const newPermissions = ref([])

const getPermissions = async () => {
  isLoadingPermission.value = true

  const { result } = await roleServices.getPermissions()

  permissionOrigin.value = result

  isLoadingPermission.value = false
}
getPermissions()

const onSubmit = handleSubmit(() => {
  if (newPermissions.value?.length === 0 && !is_admin.value) {
    isRequired.value = true
  } else {
    emit('onSubmit', newPermissions.value)
  }
})

const handleCancel = () => {
  emit('onCancel')
}

const changePermissions = (values: any) => {
  let result: any = []
  values.forEach((group: any) => {
    group.permissions?.forEach((permission: any) => {
      if (permission.checked) {
        result.push(permission.key)
      }
    })
  })
  newPermissions.value = result
}
</script>

<template>
  <form class="form" autocomplete="off" @submit.prevent="onSubmit">
    <h1 class="page-heading m-0 mb-4">
      {{ route.params.id ? t('common.edit_role') : t('common.add_new_role') }}
    </h1>

    <BaseInputText
      class="mb-4"
      name="position-name"
      :label="t('common.role_name')"
      :rules="{ required: true }"
      v-model="name"
    />

    <div class="mb-4 flex items-center gap-1">
      <BaseCheckbox name="is_admin" :label="t('common.admin')" v-model="is_admin" />

      <img
        class="icon"
        src="~/assets/icons/i-explain.svg"
        v-tooltip.bottom="{
          value: t('common.role_admin'),
          pt: {
            arrow: {
              style: {
                borderBottomColor: '#8A8A8A',
              },
            },
            text: 'bg-[#8A8A8A] font-normal text-s text-center',
          },
        }"
      />
    </div>

    <div class="mb-4" v-if="!is_admin">
      <BaseInputSelectMultiple
        class="mb-4"
        name="select-branch"
        optionValue="_id"
        optionLabel="name"
        :options="branchOptions"
        :label="t('common.applied_branch')"
        :loading="isLoadingBranch"
        :filterDefault="true"
        :rules="{ required: true }"
        v-model="branches"
      />

      <PermissionTable
        :options="permissionOrigin"
        :data="permissions"
        :isSubmit="isRequired"
        @onChange="changePermissions"
      />
    </div>

    <BaseSwitch class="mb-6" name="is-active" :label="t('common.active')" v-model="is_active" />

    <div class="flex justify-end gap-4">
      <Button severity="secondary" outlined type="button" :label="t('button.cancel')" @click="handleCancel" />

      <Button :loading="isSubmit" :label="route.params.id ? t('button.update') : t('button.create')" type="submit" />
    </div>
  </form>
</template>
