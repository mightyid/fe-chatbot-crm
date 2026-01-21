<script setup lang="ts">
import { useForm } from 'vee-validate'
import FormChatbotFunction from './FormChatbotFunction.vue'

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
  account_sid: '',
  auth_token: '',
  phone_sid: '',
  voice: '',
  realtime_model: '', 
  phone_number: '',
})
const formOptions = ref<any>([])
const onSubmit = handleSubmit(() => {
  let newForm = form.value.form;
  console.log('isAdminQuery', newForm);
  if (!props.isAdmin) {
    newForm = form.value.form.map((item: any) => {
      return {
        key: item.key,
        label: formOptions.value.find((x: any) => x.key === item.key)?.label,
      }
    })
  }
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

const voiceOptions = ref([])
const loadVoiceOpenAI = async () => {
  const { result }: any = await $api('setting/key?key=CHATGPT_VOICE', {
    method: 'GET',
  })
  voiceOptions.value = result.map((model: string) => ({ value: model }) ) || []
}

const voiceModelOptions = ref([]);
const loadVoiceModelOpenAI = async () => {
  const { result }: any = await $api('setting/key?key=CHATGPT_REALTIME_MODEL', {
    method: 'GET',
  })
  voiceModelOptions.value = result.map((model: string) => ({ value: model }) ) || []
}

const phoneTwilioOptions = ref([])
const loadPhoneSidTwilio = async () => {
  const { result }: any = await $api('chat-bot/phone-number', {
    method: 'POST',
    body: {
      account_sid: form.value.account_sid,
      auth_token: form.value.auth_token,
    }
  })
  phoneTwilioOptions.value = result || []
}

if (isAdminQuery.value) {
  loadModelOpenAI()
  loadPhoneSidTwilio()
  loadVoiceOpenAI()
  loadVoiceModelOpenAI()
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

watch(
  () => form.value.auth_token,
  (newValue) => {
    if (form.value.auth_token && form.value.account_sid) {
      loadPhoneSidTwilio()
    } else {
      phoneTwilioOptions.value = []
    }
  },
)

watch(
  () => form.value.account_sid,
  (newValue) => {
    if (form.value.auth_token && form.value.account_sid) {
      loadPhoneSidTwilio()
    } else {
      phoneTwilioOptions.value = []
    }
  },
)
watch(
  () => form.value.phone_sid,
  (newValue) => {
    if (newValue) {
      const find = phoneTwilioOptions.value.find((x: any) => x.sid === newValue);
      if (find) {
        form.value.phone_number = find['phone'];
      } else {
        form.value.phone_number = '';
      }
    } else {
      form.value.phone_number = '';
    }
  },
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
    <div class="my-4 text-lg c-primary font-bold" v-if="isAdminQuery">
      <hr>
      Config Twilio
      <img v-if="form.config_twilio?.success" class="icon" src="~/assets/icons/i-check-primary.svg" alt="" />
    </div>
    <div class="grid grid-cols-2 gap-6" v-if="isAdminQuery">
      <BaseInputText
        class="flex-1"
        name="account_sid"
        label="Account SID"
        :rules="{ required: false }"
        v-model="form.account_sid"
      />
      <BaseInputText
        class="flex-1"
        name="auth_token"
        label="Auth Token"
        :rules="{ required: false }"
        v-model="form.auth_token"
      />
      <BaseInputSelect
        class="flex-1"
        label="Phone number"
        :rules="{ required: false }"
        :options="phoneTwilioOptions"
        name="phone_sid"
        option-label="phone"
        option-value="sid"
        v-model="form.phone_sid"
      />
      <BaseInputSelect
        class="flex-1"
        label="Voice"
        :rules="{ required: false }"
        :options="voiceOptions"
        name="voice"
        option-label="value"
        option-value="value"
        v-model="form.voice"
      />

      <BaseInputSelect
        class="flex-1"
        label="Realtime Model OpenAI"
        :rules="{ required: false }"
        :options="voiceModelOptions"
        name="voice_model"
        option-label="value"
        option-value="value"
        v-model="form.realtime_model"
      />
    </div>
    <div class="my-4 text-lg c-primary font-bold" v-if="isAdminQuery">
      <hr>
      Config ChatGPT
      <img v-if="form.config_gpt?.success" class="icon" src="~/assets/icons/i-check-primary.svg" alt="" />
    </div>
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
    
      <div class="flex flex-col gap-2 mb-4">
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

      <div class="flex flex-col gap-2 mb-4">
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

      <FormChatbotFunction v-model="form.functions" label="Functions"/>

    </div>
    <div class="my-4 text-lg c-primary font-bold" v-if="!isAdmin">
      Form Request
      <img
        src="~/assets/icons/i-add-primary.svg"
        alt=""
        class="cursor-pointer"
        @click="form.form.push({ key: '', label: '' })"
      />
    </div>
    <div class="grid grid-cols-2 gap-6" v-if="!isAdmin">
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
