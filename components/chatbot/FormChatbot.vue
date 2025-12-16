<script setup lang="ts">
import { useForm } from 'vee-validate'

const props = defineProps({
  data: {
    type: Object,
    required: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
})
const { $api } = useNuxtApp()
const { t } = useI18n()
const emit = defineEmits(['onSubmit', 'onCancel', 'onEdit'])
const route = useRoute()
const { handleSubmit, resetForm } = useForm()
const isAdminQuery = ref(route.query?.isAdmin === 'true' || props.isAdmin)
const form = ref<any>({
  is_active: true,
  is_show: true,
  name: '',
  avatar: '',
  message: 'Xin chào',
  form: [],
  position: 'right',
  color: '#3ABFF8',
  scripts: [],
  api_key: '',
  organization: '',
  webhook: '',
  label_btn: 'Start Chat',
  vector_store_id: '',
  instruction: '',
  model: '',
  top_p: 0.7,
  temperature: 1.5,
  functions: {},
})
const formOptions = ref<any>([])
const onSubmit = handleSubmit(() => {
  const newForm = form.value.form.map((item: any) => {
    return {
      key: item.key,
      label: formOptions.value.find((x: any) => x.key === item.key)?.label,
    }
  })
  if (!props.isEdit) {
    emit('onSubmit', { ...toRaw(form.value), form: newForm })
  } else {
    emit('onEdit', { ...toRaw(form.value), _id: props.data?._id, form: newForm })
  }
  // resetForm({
  //   values: {
  //     name: '',
  //   },
  // })
})
const onUpload = (obj: any) => {
  form.value.avatar = obj.url
}
const getFormOptions = async () => {
  const { result }: any = await $api('crm-field')
  formOptions.value = result || []
}
if (!props.isAdmin) {
  getFormOptions()
}

const modelOptions = ref([])

const loadModelOpenAI = async () => {
  const { result }: any = await $api('setting/key?key=CHATGPT_MODEL', {
    method: 'GET',
  })
  modelOptions.value = result.map((model: string) => ({ value: model }) ) || []
}

if (isAdminQuery.value) {
  loadModelOpenAI()
}

const heighInstruction = ref('h-36');
const editInstruction = () => {
  if (heighInstruction.value === 'h-36') {
    heighInstruction.value = 'h-[500px]';
  } else {
    heighInstruction.value = 'h-36';
  }
}

watch(
  () => props.data,
  (newValue) => {
    form.value = JSON.parse(JSON.stringify(newValue))
  },
  { deep: true },
)
</script>

<template>
  <form autocomplete="off" @submit.prevent="onSubmit">
    <div class="grid grid-cols-2 gap-6">
      <div class="grid-row-span-2">
        <BaseButtonUpload acceptFile="image/*" @onUpload="onUpload" :acl="true">
          <BaseAvatar :url="form.avatar" type="square" :size="125" aspect="126/160" v-if="form.avatar" />
          <div class="w-[125px] h-[160px] flex flex-col justify-center items-center bg-black-10 rounded" v-else>
            <img src="~/assets/icons/i-camera-bg-gray.svg" />
            <span class="text-base font-normal text-center c-black-60">{{ t('common.avatar') }}</span>
          </div>
        </BaseButtonUpload>
      </div>
      <BaseInputText
        class="flex-1"
        name="name"
        :label="t('common.name')"
        :rules="{ required: true }"
        v-model="form.name"
      />

      <BaseInputText
        class="flex-1"
        name="message"
        label="Message"
        :rules="{ required: false }"
        v-model="form.message"
      />
      <BaseInputText
        class="flex-1"
        name="label_btn"
        label="Text Button Start"
        :rules="{ required: false }"
        v-model="form.label_btn"
      />
      <BaseInputText
        class="flex-1"
        name="color"
        label="Mãu màu (#hex)"
        placeholder="#3abff8"
        :rules="{ required: false }"
        v-model="form.color"
      />
      <BaseInputSelect
        class="flex-1"
        name="position"
        label="Position"
        :options="['left', 'right']"
        option-label=""
        option-value=""
        :rules="{ required: false }"
        v-model="form.position"
      />
      <BaseSwitch class="flex-1" name="is_active" :label="t('common.active')" v-model="form.is_active" />
      <BaseSwitch class="flex-1" name="is_show" label="Show Popup" v-model="form.is_show" />
    </div>
    <div class="my-4 text-lg c-primary font-bold" v-if="isAdminQuery">Config ChatGPT</div>
    <div class="grid grid-cols-2 gap-6" v-if="isAdminQuery">
      <BaseInputText
        class="flex-1"
        name="api_key"
        label="API Key"
        :rules="{ required: false }"
        v-model="form.api_key"
      />
      <BaseInputText
        class="flex-1"
        name="organization"
        label="Organization"
        :rules="{ required: false }"
        v-model="form.organization"
      />
      <BaseInputText
        class="flex-1"
        name="vector_store_id"
        label="Vector Store ID"
        :rules="{ required: false }"
        v-model="form.vector_store_id"
      />
      <BaseInputSelect
        class="flex-1"
        label="Model"
        :rules="{ required: false }"
        :options="modelOptions"
        name="model"
        option-label="value"
        option-value="value"
        v-model="form.model"
        :filterDefault="true"
      />
      <BaseInputText
        class="flex-1"
        name="webhook"
        label="Webhook"
        :rules="{ required: false }"
        v-model="form.webhook"
      />

      <div className="col-span-2 relative">
        <BaseInputTextArea
          class="flex-1"
          name="instruction"
          label="System Instruction"
          :rules="{ required: false }"
          v-model="form.instruction"
          :classInput="heighInstruction"
          :autoResize="false"
        />
        <button
          className="absolute bottom-2 right-5"
          type="button"
          @click="editInstruction"
        >
          <img v-if="heighInstruction === 'h-36'"
            src="@/assets/icons/i-expand.svg"
            alt="edit"
          />
          <img v-else
            src="@/assets/icons/i-collapse.svg"
            alt="edit"
          />
        </button>
      </div>
    
      <div class="flex flex-col gap-2">
        <label class="flex items-center gap-2 text-base font-normal c-black-90">
          <span>
            Temperature
          </span>
          <InputNumber v-model="form.temperature" inputId="temperature" :min="0" :max="2" :step="0.01"/>
        </label>

        <div class="flex flex-col">
          <Slider v-model="form.temperature" :step="0.01" :min="0" :max="2"/>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label class="flex items-center gap-2 text-base font-normal c-black-90">
          <span>
            Top P
          </span>
          <InputNumber v-model="form.top_p" inputId="top_p" :min="0" :max="1" :step="0.01"/>
        </label>

        <div class="flex flex-col">
          <Slider v-model="form.top_p" :step="0.01" :min="0" :max="1"/>
        </div>
      </div>
    </div>
    <div class="my-4 text-lg c-primary font-bold">
      Form Request
      <img
        src="~/assets/icons/i-add-primary.svg"
        alt=""
        class="cursor-pointer"
        @click="form.form.push({ key: '', label: '' })"
      />
    </div>
    <div class="grid grid-cols-2 gap-6">
      <div class="relative flex-1 fr" v-for="(item, index) in form.form" :key="item.key">
        <Select
          class="flex-1"
          v-model="form.form[index].key"
          :options="formOptions"
          optionLabel="label"
          optionValue="key"
          placeholder="Select"
        />
        <img src="~/assets/icons/i-close-gray.svg" class="cursor-pointer" @click="form.form.splice(index, 1)" alt="" />
      </div>
    </div>

    <div class="flex justify-end gap-4 mt-4">
      <Button
        type="button"
        :label="t('button.cancel')"
        severity="secondary"
        @click="
          () => {
            emit('onCancel')
          }
        "
      />
      <Button type="submit" :label="isEdit ? t('button.save') : t('button.create')" severity="primary" />
    </div>
  </form>
</template>
