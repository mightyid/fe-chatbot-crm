<script lang="ts" setup>
const { $api } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const { t } = useI18n()

const id = route.params.id as string
const form = ref({
  name: '',
  instruction: '',
  is_active: false,
})

const isLoading = ref(false)
const isFetching = ref(true)

const getDetail = async () => {
  try {
    const { result }: any = await $api(`campaign-call/${id}`, {
      method: 'GET',
    })
    if (result) {
      form.value = {
        name: result.name,
        instruction: result.instruction,
        is_active: result.is_active,
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    isFetching.value = false
  }
}
getDetail()

const onSubmit = async () => {
  if (!form.value.name) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Name is required', life: 3000 })
    return
  }
  isLoading.value = true
  try {
    const { statusCode }: any = await $api(`campaign-call/${id}`, {
      method: 'PUT',
      body: form.value,
    })
    if (statusCode === 200) {
      toast.add({ severity: 'success', summary: 'Notifications', detail: 'Updated Successfully', life: 3000 })
      router.push('/campaign-call')
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="page">
    <div class="page-content">
      <div class="flex items-center gap-4 mb-6">
        <h1 class="page-heading m-0">{{ t('button.edit') }} {{ t('common.campaign_call') }}</h1>
      </div>

      <div class="bg-white p-6 rounded shadow-sm max-w-2xl mx-auto" v-if="!isFetching">
        <div class="fc gap-6">
          <div class="fc gap-2">
            <label class="font-medium">{{ t('common.name') }} <span class="text-red-500">*</span></label>
            <InputText v-model="form.name" :placeholder="t('common.enter') + ' ' + t('common.name')" />
          </div>

          <div class="fc gap-2">
            <label class="font-medium">{{ t('common.instruction') }}</label>
            <Textarea
              v-model="form.instruction"
              rows="5"
              :placeholder="t('common.enter') + ' ' + t('common.instruction')"
            />
            <small class="text-gray-500 italic">Use {{ name }} for placeholder</small>
          </div>

          <div class="flex items-center gap-3">
            <InputSwitch v-model="form.is_active" />
            <label class="font-medium cursor-pointer" @click="form.is_active = !form.is_active">
              {{ t('common.active') }}
            </label>
          </div>

          <div class="flex justify-end gap-3 mt-4">
            <Button :label="t('button.cancel')" severity="secondary" @click="router.push('/campaign-call')" />
            <Button :label="t('button.save')" :loading="isLoading" @click="onSubmit" />
          </div>
        </div>
      </div>
      <div class="flex justify-center p-8" v-else>
        <ProgressSpinner />
      </div>
    </div>
  </div>
</template>
