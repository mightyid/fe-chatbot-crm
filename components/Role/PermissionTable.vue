<script lang="ts" setup>
import { cloneDeep } from 'lodash'
import _ from 'lodash'

const props = defineProps({
  data: {
    type: Array,
    default: [],
  },
  isSubmit: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array,
    default: [],
  },
})

const emit = defineEmits(['onChange'])

const { t } = useI18n()

const permissionOptions = ref<PermissionGroup[]>([])

interface Permission {
  key: string | null
  checked: boolean
  type: string
}

interface PermissionGroup {
  cate: string
  permissions: Permission[]
  checkedAll: boolean
}

interface CheckStatus {
  all: boolean
  view: boolean
  create: boolean
  update: boolean
  delete: boolean
  [key: string]: boolean
}

const checkStatus = ref<CheckStatus>({
  all: false,
  view: false,
  create: false,
  update: false,
  delete: false,
})

const isRequired = computed(() => {
  return (
    props.isSubmit &&
    !permissionOptions.value.some((group) => group.permissions.some((permission) => permission.checked))
  )
})

const tickCheckbox = () => {
  let countCreate = 0
  let countUpdate = 0
  let countView = 0
  let countDelete = 0
  let countOriginCreate = 0
  let countOriginView = 0
  let countOriginUpdate = 0
  let countOriginDelete = 0
  permissionOptions.value.forEach((group) => {
    group.checkedAll = !group.permissions.some((item: any) => !item.checked && item.key)
    group.permissions.forEach((permission: any) => {
      switch (permission.type) {
        case 'view':
          if (permission.key) countOriginView++
          if (permission.checked) countView++
          break
        case 'update':
          if (permission.key) countOriginUpdate++
          if (permission.checked) countUpdate++
          break
        case 'delete':
          if (permission.key) countOriginDelete++
          if (permission.checked) countDelete++
          break
        case 'create':
          if (permission.key) countOriginCreate++
          if (permission.checked) countCreate++
          break
      }
    })
  })

  checkStatus.value.create = countCreate === countOriginCreate
  checkStatus.value.view = countView === countOriginView
  checkStatus.value.update = countUpdate === countOriginUpdate
  checkStatus.value.delete = countDelete === countOriginDelete
}

const customPermission = (data: any) => {
  const result: PermissionGroup[] = []

  const permissionTemplate: Permission[] = [
    { key: null, checked: false, type: 'view' },
    { key: null, checked: false, type: 'create' },
    { key: null, checked: false, type: 'update' },
    { key: null, checked: false, type: 'delete' },
  ]

  data.forEach((permission: any) => {
    const match = permission.key.match(/^([^_]+)_(.*)$/)
    if (match) {
      const [_, grantType, grantName] = match
      let category = result.find((grant) => grant.cate === grantName)

      if (!category) {
        category = { cate: grantName, permissions: cloneDeep(permissionTemplate), checkedAll: false }
        result.push(category)
      }

      const permissionItem = category.permissions.find((item) => item.type === grantType)
      if (permissionItem) {
        permissionItem.key = permission.key
      }
    }
  })

  permissionOptions.value = result
}

const checkAllEachPermission = (status: boolean, group: any, index: number) => {
  permissionOptions.value[index].permissions = permissionOptions.value[index].permissions?.map((permission: any) => ({
    ...permission,
    checked: permission.key ? status : permission.checked,
  }))

  tickCheckbox()

  if (!status) {
    checkStatus.value.all = false
  }
}

const checkAllEachPermissionType = (status: boolean, type: string) => {
  if (!status) {
    checkStatus.value.all = false
  } else if (
    checkStatus.value.create &&
    checkStatus.value.view &&
    checkStatus.value.update &&
    checkStatus.value.delete
  ) {
    checkStatus.value.all = true
  }

  permissionOptions.value?.forEach((group: any) => {
    group.permissions?.forEach((permission: any) => {
      if (permission.type === type && permission.key) {
        permission.checked = status
      }
    })

    if (checkStatus.value.all) {
      group.checkedAll = true
    } else {
      group.checkedAll = group.permissions
        ?.filter((permission: any) => permission.key)
        ?.every((permission: any) => permission.checked)
    }
  })
}

const checkAllPermission = (status: boolean) => {
  checkStatus.value.create = status
  checkStatus.value.update = status
  checkStatus.value.view = status
  checkStatus.value.delete = status

  permissionOptions.value?.forEach((group: any) => {
    group.checkedAll = status
    group.permissions?.forEach((permission: any) => {
      if (permission.key) {
        permission.checked = status
      }
    })
  })
}

const statusCheck = async (status: boolean, type: string, group: any, groupIndex: number) => {
  if (!status) {
    if (checkStatus.value.all) {
      checkStatus.value.all = false
    }
    if (checkStatus.value[type]) {
      checkStatus.value[type] = false
    }
    if (group.checkedAll) {
      permissionOptions.value[groupIndex].checkedAll = false
    }
  } else {
    const isCheckedAll = permissionOptions.value[groupIndex].permissions
      ?.filter((permission) => permission.key)
      ?.every((permission) => permission.checked)

    permissionOptions.value[groupIndex].checkedAll = isCheckedAll

    checkStatus.value[type] = permissionOptions.value?.every((group: any) =>
      group.permissions?.every((permission: any) => permission.type !== type || !permission.key || permission.checked),
    )
  }
}

watch(
  () => permissionOptions.value,
  (newValue) => {
    if (newValue) {
      let isCheckAll = true
      newValue?.forEach((group: any) => {
        let haveFalse = group.permissions?.some((permission: any) => permission.key && !permission.checked)
        if (haveFalse) {
          isCheckAll = false
          return
        }
      })
      if (isCheckAll) {
        checkStatus.value.all = true
        checkStatus.value.view = true
        checkStatus.value.create = true
        checkStatus.value.update = true
        checkStatus.value.delete = true
      }
      emit('onChange', newValue)
    }
  },
  {
    deep: true,
  },
)

watch(
  () => props.data,
  (newValue) => {
    if (newValue && !_.isEmpty(permissionOptions.value)) {
      permissionOptions.value.forEach((group: any) => {
        group.permissions.forEach((permission: any) => {
          permission.checked = newValue.some((value: any) => value === permission.key)
        })
      })
      tickCheckbox()
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => props.options,
  (newValue) => {
    if (!_.isEmpty(newValue)) {
      customPermission(newValue)

      permissionOptions.value.forEach((group: any) => {
        group.permissions.forEach((permission: any) => {
          permission.checked = props.data.some((value: any) => value === permission.key)
        })
      })

      tickCheckbox()
    }
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>

<template>
  <div class="max-h-[80vh] overflow-auto">
    <table
      class="w-full table-custom-layout"
      :class="isRequired ? 'border border-solid border-red' : 'border-l border-l-solid border-black-40'"
    >
      <thead>
        <tr>
          <th class="">
            {{ t('common.permission_name') }}
          </th>
          <th class="w-100px"> {{ t('common.all') }} </th>
          <th class="w-100px"> {{ t('common.view') }} </th>
          <th class="w-100px"> {{ t('button.create') }} </th>
          <th class="w-100px"> {{ t('button.edit') }} </th>
          <th class="w-100px"> {{ t('button.delete') }} </th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td> {{ t('common.all_roles') }} </td>

          <td>
            <div class="flex justify-center">
              <BaseCheckbox name="check-all-grant" v-model="checkStatus.all" @update:modelValue="checkAllPermission" />
            </div>
          </td>

          <td>
            <div class="flex justify-center">
              <BaseCheckbox
                name="check-view-grant"
                v-model="checkStatus.view"
                @update:modelValue="(values) => checkAllEachPermissionType(values, 'view')"
              />
            </div>
          </td>

          <td>
            <div class="flex justify-center">
              <BaseCheckbox
                name="check-create-grant"
                v-model="checkStatus.create"
                @update:modelValue="(values) => checkAllEachPermissionType(values, 'create')"
              />
            </div>
          </td>

          <td>
            <div class="flex justify-center">
              <BaseCheckbox
                name="check-update-grant"
                v-model="checkStatus.update"
                @update:modelValue="(values) => checkAllEachPermissionType(values, 'update')"
              />
            </div>
          </td>

          <td>
            <div class="flex justify-center">
              <BaseCheckbox
                name="check-delete-grant"
                v-model="checkStatus.delete"
                @update:modelValue="(values) => checkAllEachPermissionType(values, 'delete')"
              />
            </div>
          </td>
        </tr>

        <tr class="hover:bg-black" v-for="(group, index) in permissionOptions" :key="group.cate">
          <td>
            {{ t(`roles.${group.cate}`) }}
          </td>
          <td>
            <div class="flex justify-center">
              <BaseCheckbox
                :name="`${group.cate}-check-all`"
                v-model="group.checkedAll"
                @update:modelValue="(values) => checkAllEachPermission(values, group, index)"
              />
            </div>
          </td>
          <td v-for="permission in group.permissions" :key="permission.key || 'default-key'">
            <div class="flex justify-center">
              <BaseCheckbox
                :name="`${group.cate}-${permission.key}`"
                :disabled="permission.key ? false : true"
                v-model="permission.checked"
                @update:modelValue="(values) => statusCheck(values, permission.type, group, index)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="m-0 mt-1 text-xs c-r-error" v-if="isRequired"> {{ t('common.required_field') }} </p>
  </div>
</template>
