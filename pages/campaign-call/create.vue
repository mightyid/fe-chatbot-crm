<script lang="ts" setup>
const { $api } = useNuxtApp()
const router = useRouter()
const toast = useToast()
const { t } = useI18n()

const form = ref({
  name: '',
  instruction: '',
  is_active: false,
})

const isLoading = ref(false)

const onSubmit = async () => {
  if (!form.value.name) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Name is required', life: 3000 })
    return
  }
  isLoading.value = true
  try {
    const { statusCode }: any = await $api('campaign-call', {
      method: 'POST',
      body: form.value,
    })
    if (statusCode === 200) {
      toast.add({ severity: 'success', summary: 'Notifications', detail: 'Created Successfully', life: 3000 })
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
        <!-- <nuxt-link to="/campaign-call">
          <Button severity="secondary" rounded text>
            <template #icon>
              <img src="~/assets/icons/i-arrow-left.svg" alt="" />
            </template>
          </Button>
        </nuxt-link> -->
        <h1 class="page-heading m-0">{{ t('button.create') }} {{ t('common.campaign_call') }}</h1>
      </div>

      <div class="bg-white p-6 rounded shadow-sm max-w-2xl mx-auto">
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
    </div>
  </div>
</template>
