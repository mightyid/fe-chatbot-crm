<script setup lang="ts">
import XLSX from 'xlsx-js-style'
// import { cloneDeep } from 'lodash'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  width: {
    type: [String, Number],
    default: '80vw',
  },
  dismissableMask: {
    type: Boolean,
    default: true,
  },
  isLoadingImport: {
    type: Boolean,
    default: false,
  },
  optionsImportExcel: {
    type: Array,
    default: [],
  },
  requiredFieldImportExcel: {
    type: Array,
    default: [],
  },
  fileTemplatePath: {
    type: String,
    default: undefined,
  },
  existingData: {
    type: Array,
    default: [],
  },
  messageExistingData: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['onImport', 'onReadFile', 'onClose'])

const { t, te } = useI18n()

const inputElement = ref<HTMLInputElement>()
const fileName = ref('')
const workbook = ref<any>({})
const sheetOptions = ref<any[]>([])
const currentSheetName = ref('')
const dataBySheet = ref<any>([])
const columns = ref<any>([])
const fieldOptions = ref<any[]>([])
const isLoading = ref(false)
const isLoadingDownload = ref(false)

const columnsSelected = computed(() => columns.value?.filter((item: any) => item?.valueSelected))

const missingRequiredFields = computed(() => {
  const arr = [] as any

  props.requiredFieldImportExcel?.forEach((item: any) => {
    const exist = columnsSelected.value?.find((col: any) => col?.valueSelected === item?.key)
    if (!exist?.valueSelected) {
      arr.push({
        ...item,
      })
    }
  })

  return arr
})

const openInputFile = () => {
  inputElement.value?.click()
}

const readFileExcel = async (e: Event) => {
  isLoading.value = true
  resetData()

  const files = (e.target as HTMLInputElement).files
  const file = files ? files[0] : null
  if (file) {
    fileName.value = file?.name
    const data = await file.arrayBuffer()
    /* data is an ArrayBuffer */
    workbook.value = XLSX.read(data)
    sheetOptions.value = workbook.value?.SheetNames || []
  }

  emit('onReadFile')
  resetValueInput()
  isLoading.value = false
}

const closeDialog = () => {
  emit('onClose')
}

const resetData = () => {
  fileName.value = ''
  workbook.value = {}
  sheetOptions.value = []
  currentSheetName.value = ''
  dataBySheet.value = []
  columns.value = []
  fieldOptions.value = fieldOptions.value?.map((item: any) => ({
    ...item,
    isSelected: false,
  }))
}

const resetValueInput = () => {
  // Reset value file
  if (inputElement.value) {
    inputElement.value.value = ''
  }
}

const importExcel = () => {
  const cloneDataBySheet = JSON.parse(JSON.stringify(dataBySheet.value))
  const cloneArrayValueSelected = JSON.parse(JSON.stringify(columnsSelected.value))
  const result = [] as any[]

  cloneDataBySheet?.forEach((item: any) => {
    const newStudent = {} as any

    cloneArrayValueSelected?.forEach((col: any) => {
      newStudent[col?.valueSelected] = item[col?.field] || ''
    })

    result.push(newStudent)
  })

  emit('onImport', result)
}

const downloadFileTemplate = async () => {
  if (props.fileTemplatePath) {
    // const anchor = document.createElement('a')
    // anchor.setAttribute('href', props.fileTemplatePath)
    // anchor.setAttribute('download', '')
    // document.body.appendChild(anchor)
    // await nextTick()
    // anchor.click()
    // anchor?.parentNode?.removeChild(anchor)
    try {
      isLoadingDownload.value = true

      const fullPath = window.origin + props.fileTemplatePath

      const response = await fetch(fullPath)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = props.fileTemplatePath
      document.body.appendChild(a)
      a.click()
      await nextTick()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading the file:', error)
    } finally {
      isLoadingDownload.value = false
    }
  }
}

// On selected field to disabled option
const onSelected = () => {
  const itemsSelected = columns.value?.filter((item: any) => item?.valueSelected)
  const arrayFieldSelected = itemsSelected?.map((item: any) => item?.valueSelected)

  fieldOptions.value = fieldOptions.value?.map((item: any) => {
    return {
      ...item,
      isSelected: arrayFieldSelected?.includes(item?.key) ? true : false,
    }
  })
}

watch(
  () => currentSheetName.value,
  (newValue) => {
    if (newValue) {
      const sheet = workbook.value?.Sheets[newValue]
      const [columnsExcel]: any = XLSX.utils.sheet_to_json(sheet, { header: 1 })
      const result = XLSX.utils.sheet_to_json(sheet)

      // Get columns from excel
      columnsExcel?.forEach((title: any) => {
        columns.value.push({
          field: title,
          header: title,
          valueSelected: '',
        })
      })

      // Filter row not missing one of fields required
      const resultNotRowEmpty = result?.filter((item: any) => {
        // const isEmpty = Object.values(item)?.every((x) => x === null || x === '')

        const isMissingRequired = props.requiredFieldImportExcel?.some((x: any) => {
          const key = fileName.value?.includes('template-employee') ? t(x?.name, 1, { locale: 'en' }) : t(x?.name) // File language english to translate en

          // console.log(item, key, !item.hasOwnProperty(key))
          return !item.hasOwnProperty(key) || item[key] === null || item[key] === ''
        })

        // console.log(item, isMissingRequired)

        return !isMissingRequired
      })

      dataBySheet.value = resultNotRowEmpty
    }
  },
)

watch(
  () => props.optionsImportExcel,
  (newValue) => {
    if (newValue) {
      const cloneData = JSON.parse(JSON.stringify(props.optionsImportExcel))
      fieldOptions.value = cloneData?.map((item: any) => {
        return {
          ...item,
          name: t(item?.name),
        }
      })
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => props.visible,
  () => {
    resetData()
    resetValueInput()
  },
)
</script>

<template>
  <Dialog
    class="[&>.p-dialog-content]:py-3 [&>.p-dialog-content]:px-3 [&>.p-dialog-content]:rounded"
    modal
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    :style="{ width }"
    :showHeader="false"
    :dismissableMask="dismissableMask"
    :visible="visible"
    @update:visible="closeDialog"
  >
    <button class="absolute top-[16px] right-[16px]" type="button" @click="closeDialog">
      <img src="~/assets/icons/i-close-gray.svg" alt="" />
    </button>

    <h3 class="mb-3 text-2xl font-bold c-black-90 text-center" v-if="title">
      {{ title }}
    </h3>

    <div class="mb-6 flex items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <Button class="gap-2" type="button" @click="openInputFile">
          <img src="~/assets/icons/i-upload-white.svg" alt="" />
          <span> {{ fileName ? fileName : t('common.upload_excel') }} </span>
        </Button>
        <input class="hidden" type="file" accept=".xlsx, .xls, .csv" ref="inputElement" @change="readFileExcel" />

        <BaseInputSelect
          class="w-[300px]"
          name="sheet-name"
          :placeholder="t('common.spreadsheet_name')"
          :options="sheetOptions"
          :optionLabel="null"
          :optionValue="null"
          optionDisabled="isSelected"
          :rules="{ required: true }"
          :loading="isLoading"
          v-model="currentSheetName"
        />
      </div>

      <Button
        class="gap-2"
        type="button"
        :loading="isLoadingDownload"
        @click="downloadFileTemplate"
        v-if="fileTemplatePath"
      >
        <img src="~/assets/icons/i-download-white.svg" alt="" />
        <span> {{ t('common.download_file_template') }} </span>
      </Button>
    </div>

    <!-- Show Data existing -->
    <template v-if="existingData && existingData?.length > 0">
      <h3 class="mb-3 text-base font-normal c-danger">
        {{ messageExistingData }}
      </h3>

      <DataTable class="mb-[24px]" :value="existingData" :loading="isLoading" scrollable scrollHeight="55vh">
        <Column header="#" style="width: 80px">
          <template #body="slotProps">
            {{ slotProps?.index + 1 }}
          </template>
        </Column>

        <Column style="min-width: 200px">
          <template #header>
            <p class="m-0 whitespace-nowrap c-danger">
              {{ t('common.field_is_duplicated') }}
            </p>
          </template>

          <template #body="slotProps">
            <p class="m-0 whitespace-nowrap c-danger">
              <span v-for="(item, index) in slotProps?.data?.key" :key="item">
                {{ te(`common.${item}`) ? t(`common.${item}`) : item }}
                {{ index < slotProps?.data?.key?.length - 1 ? ', ' : '' }}
              </span>
            </p>
          </template>
        </Column>

        <Column
          style="min-width: 200px"
          v-for="item of fieldOptions"
          :key="item.key"
          :header="t(item?.name)"
          :field="item.key"
        >
        </Column>

        <template #empty> {{ t('common.no_data') }} </template>
      </DataTable>
    </template>

    <!-- Show data sheet -->
    <template v-else>
      <DataTable class="mb-[24px]" :value="dataBySheet" :loading="isLoading" scrollable scrollHeight="55vh">
        <Column header="#" style="width: 80px">
          <template #body="slotProps">
            {{ slotProps?.index + 1 }}
          </template>
        </Column>

        <Column style="min-width: 160px" v-for="col of columns" :key="col.field" :field="col.field">
          <template #header>
            <BaseInputSelect
              class="w-[160px]"
              :name="col?.field"
              :options="fieldOptions"
              optionLabel="name"
              optionValue="key"
              optionDisabled="isSelected"
              :showClearDefault="true"
              :filterDefault="true"
              v-model="col.valueSelected"
              @update:modelValue="onSelected"
            />
          </template>
        </Column>

        <template #empty> {{ t('common.no_data') }} </template>
      </DataTable>

      <p class="p-error text-sm text-right" v-if="missingRequiredFields?.length > 0">
        <span> *{{ t('common.required_field') }}: </span>

        <span v-for="(item, index) in missingRequiredFields" :key="item?.value">
          {{ index < missingRequiredFields?.length - 1 ? t(item?.name) + ', ' : t(item?.name) }}
        </span>
      </p>
    </template>

    <div class="flex justify-end gap-[16px]">
      <Button size="large" :label="t('button.back')" severity="secondary" outlined type="button" @click="closeDialog" />

      <Button
        class="gap-2"
        :label="t('button.save')"
        severity="primary"
        type="button"
        :loading="isLoadingImport"
        :disabled="!isLoadingImport && missingRequiredFields?.length <= 0 ? false : true"
        @click="importExcel"
        v-if="existingData?.length <= 0"
      />
    </div>
  </Dialog>
</template>
