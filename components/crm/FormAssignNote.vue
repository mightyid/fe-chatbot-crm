<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: () => 'Application',
  },
  data: {
    type: Object,
    default: () => {},
  },
})
const { $api } = useNuxtApp()
const toast = useToast()
const isShowDialog = ref(false)
const users = ref([])
const isLoading = ref(true)
const search = ref('')
const selectedCustomers = ref()
const { $auth: auth }: any = useNuxtApp()
const selectAll = ref(false)

const query = ref({
  page: 1,
  search: '',
})
const mapTitle = computed(() => {
  return 'Select employees to assign application ' + props.data?.student_info?.name
})
const getData = async () => {
  isLoading.value = true
  const { data, loading }: any = await $api('account', {
    method: 'GET',
    params: {
      ...query.value,
    },
  })
  isLoading.value = loading
  users.value = data.value.result
  if (props.data._id) {
    getAssign()
  }
}
const getAssign = async () => {
  isLoading.value = true
  const { data, loading }: any = await $api(`application/assign/${props.data._id}`, {
    method: 'GET',
    params: {
      ...query.value,
    },
  })
  isLoading.value = loading
  console.log(data.value.result)
  selectedCustomers.value = data.value.result
}
const assignAgent = async () => {
  const employees = selectedCustomers.value.map((el: any) => el._id)
  console.log(employees)
  const { data } = await $api(`application/assign/add`)
}

const closeDialog = () => {
  isShowDialog.value = false
}
const openDialog = () => {
  isShowDialog.value = true
}
const rowSelect = async (obj: any) => {
  console.log(obj, 'row')
  const { data } = await $api(`application/assign/${props.data._id}/add`, {
    method: 'POST',
    body: {
      account_id: obj.data._id,
    },
  })
}
const rowUnSelect = async (obj: any) => {
  console.log(obj, 'rowUnSelect')
  const { data } = await $api(`application/assign/${props.data._id}/remove`, {
    method: 'POST',
    body: {
      account_id: obj.data._id,
    },
  })
}
watch(
  () => isShowDialog.value,
  (val) => {
    if (val) {
      getData()
    }
  },
)
watch(
  () => selectedCustomers.value,
  (val) => {
    console.log(val)
  },
)

watchDebounced(
  () => search.value,
  (newValue) => {
    query.value.page = 1
    query.value.search = newValue
    getData()
  },
  { debounce: 600, maxWait: 3000 },
)
</script>

<template>
  <button @click="openDialog">
    <img class="icon-lg" src="~/assets/icons/i-assign-agent-circle.svg" alt="" v-tooltip.top="'Assign'" />
  </button>
  <BaseDialog :width="'800px'" :visible="isShowDialog" :title="mapTitle" @onClose="closeDialog">
    <div class="page">
      <div class="mb-3 flex items-center justify-between gap-4">
        <div class="flex-1 flex items-center justify-end gap-4">
          <InputSearch class="w-[300px]" v-model="search" />
        </div>
      </div>
      <DataTable
        :value="users"
        dataKey="_id"
        rowHover
        paginator
        scrollable
        :rows="1000"
        :loading="isLoading"
        v-model:selection="selectedCustomers"
        :selectAll="false"
        @row-select="rowSelect"
        @row-unselect="rowUnSelect"
      >
        <Column selectionMode="multiple" headerStyle="width: 3rem" alignFrozen="left" disabled></Column>

        <Column header="#" alignFrozen="left">
          <template #body="slotProps">
            {{ slotProps.index + 1 }}
          </template>
        </Column>

        <Column field="name" header="Name" alignFrozen="left">
          <template #body="slotProps">
            <span class="text-base font-normal line-clamp-1">
              {{ slotProps.data.name }}
            </span>
          </template>
        </Column>

        <Column field="email" header="Email">
          <template #body="slotProps">
            <span class="text-base font-normal line-clamp-1">
              {{ slotProps.data.email }}
            </span>
          </template>
        </Column>
        <Column field="role" header="Role">
          <template #body="slotProps">
            <span class="text-base font-normal line-clamp-1">
              {{ slotProps.data?.role?.name ? slotProps.data?.role?.name : 'Admin' }}
            </span>
          </template>
        </Column>

        <Column field="created_at" header="Created at" :frozen="true" alignFrozen="left" class="min-w-200px">
          <template #body="slotProps">
            <span class="text-base font-normal line-clamp-1">
              {{ useMoment(slotProps.data.created_at) }}
            </span>
          </template>
        </Column>
        <template #empty>
          <NoData />
        </template>
      </DataTable>
      <!-- <div class="text-base font-semibold c-[#66B975] t-t--c fr justify-end gap-1 mt-2">
                <Button size="small" label="Cancel" severity="help" @click="closeDialog" />
                <Button size="small" label="Save" severity="info" @click="assignAgent" />
            </div> -->
    </div>
  </BaseDialog>
</template>
