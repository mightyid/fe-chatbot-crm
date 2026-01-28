<script setup lang="ts">
import useEmailTemplateService from '~/composables/controller/useEmailTemplateService'

const router = useRouter()
const toast = useToast()
const { createTemplate } = useEmailTemplateService()

const form = ref({
  name: '',
  html: '',
})

const isLoading = ref(false)
const editorRef = ref<any>(null)

async function onSave() {
  if (!form.value.name.trim()) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Template name is required', life: 3000 })
    return
  }

  if (!form.value.html.trim()) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Template content (HTML) is required',
      life: 3000,
    })
    return
  }

  isLoading.value = true
  try {
    const result: any = await createTemplate({
      name: form.value.name,
      template: form.value.html,
      design: form.value.html, // Lưu HTML vào design field
    })

    if (result.statusCode === 200) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Template created successfully', life: 3000 })
      router.push('/email-campaign-template')
    }
  } catch (error) {
    console.error('Save error:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create template', life: 3000 })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="page-wrapper">
    <div class="top-bar">
      <div class="flex items-center gap-4">
        <div class="h-6 w-px bg-gray-200"></div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-bold text-gray-400 uppercase">
            Template Name <span class="text-red-500">*</span>
          </label>
          <BaseInputText name="name" v-model="form.name" placeholder="Untitled Template" class="w-80" />
        </div>
      </div>
      <div class="flex gap-3">
        <Button label="Exit" severity="secondary" @click="router.back()" class="p-button-text" />
        <Button label="Save Template" :loading="isLoading" @click="onSave" icon="pi pi-check" />
      </div>
    </div>

    <div class="editor-container">
      <SimpleHtmlEditor ref="editorRef" v-model="form.html" />
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f1f5f9;
}

.top-bar {
  height: 64px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.editor-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}
</style>
