<script lang="ts" setup>
import readXlsxFile from 'read-excel-file'
const props = defineProps({
  columns: {
    type: Object,
    default: {},
  },
})
const listColTable = ref([])
const dataTable = ref([])
const dataSelect = ref({})
const emit = defineEmits(['onCancel', 'onSubmit'])
const label_id = ref(null)
const labels = ref([])
const { $api } = useNuxtApp()
const readFile = async (e: Event) => {
  //@ts-ignore
  const file = e.target?.files[0]
  if (file) {
    readXlsxFile(file).then((rows: any) => {
      console.log(rows, 'rows')
      if (rows.length > 0) {
        listColTable.value = rows[0]
        dataTable.value = rows.slice(1)
        console.log(dataTable.value, 'dataTable.value')
      }
    })
  }
}
const getLabel = async () => {
  const { data }: any = await $api(`crm-label`, {
    method: 'GET',
  })
  labels.value = unref(data)?.result || []
}
getLabel()
const reset = () => {
  dataTable.value = []
  dataSelect.value = {}
  listColTable.value = []
}
const importExcel = () => {
  const arr = [] as any
  dataTable.value.forEach((item) => {
    let obj = {}
    Object.keys(dataSelect.value).forEach((itemChild, index) => {
      //@ts-ignore

      if (dataSelect.value[itemChild]) {
        //@ts-ignore
        obj[dataSelect.value[itemChild]] = item[itemChild]
      }
    })
    console.log(obj)
    arr.push(obj)
  })
  emit('onSubmit', {
    data: arr,
    label_id: label_id.value,
  })
}
</script>

<template>
  <div class="fc gap-2">
    <div class="fr ai-c gap-4">
      <label
        for="input"
        class="group cursor-pointer py-1 px-[12px] cursor-pointer w-full flex items-center justify-center gap-4 bg-black-10 border-1 border-black-40 border-dashed rounded transition-all hover:bg-primary-20 hover:border-primary-35"
      >
        <img class="icon group-hover:hidden cursor-pointer" src="~/assets/icons/i-upload.svg" alt="" />
        <img class="icon hidden group-hover:block cursor-pointer" src="~/assets/icons/i-upload-active.svg" alt="" />
        <span class="text-base font-normal c-black-60 transition-all group-hover:c-primary"> Upload file </span>
        <input
          type="file"
          id="input"
          name="input"
          accept=".xlsx,.xls"
          class="hidden"
          multiple="false"
          @change="readFile"
        />
      </label>
    </div>
    <table class="mt-4">
      <thead>
        <tr>
          <th v-for="(item, index) in listColTable" :key="item">
            <div class="fc">
              <BaseInputSelect
                show-clear
                :options="columns"
                v-model="dataSelect[index]"
                :option-label="'label'"
                :name="dataSelect[index] + item"
                :option-value="'_id'"
              />
              <div class="text-base">
                <!-- {{ item }} -->
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in dataTable" :key="item">
          <td v-for="item2 in item" :key="item2">
            <div class="mx-1">
              {{ item2 }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <BaseInputSelectTag
      v-model="label_id"
      :options="labels"
      label="Label"
      name="Label"
      option-label="name"
      :rules="{
        required: true,
      }"
      option-value="_id"
      v-if="dataTable?.length"
    />
    <div class="fr ai-c jc-fe gap-4" v-if="dataTable?.length">
      <Button label="Cancel" severity="secondary" @click="emit('onCancel')" />
      <Button
        label="Import"
        severity="primary"
        @click="importExcel"
        :disabled="!Object.keys(dataSelect).length || !label_id"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
thead {
  th {
    text-align: start;
  }
}
table,
th,
td {
  border: 1px solid #cccccc;
}
</style>
