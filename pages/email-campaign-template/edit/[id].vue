<script setup lang="ts">
import useEmailTemplateService from '~/composables/controller/useEmailTemplateService'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const { getTemplateDetail, updateTemplate } = useEmailTemplateService()

const id = route.params.id as string

const form = ref({
  name: '',
  html: '',
})

const isLoading = ref(false)
const isFetching = ref(true)
const editorRef = ref<any>(null)

async function getDetail() {
  try {
    const result: any = await getTemplateDetail(id)
    if (result.result) {
      form.value.name = result.result.name || ''
      form.value.html = result.result.template || ''
    }
  } catch (error) {
    console.error('Fetch error:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch template', life: 3000 })
  } finally {
    isFetching.value = false
  }
}

onMounted(() => {
  getDetail()
})

async function onUpdate() {
  if (!form.value.name) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Template name is required', life: 3000 })
    return
  }

  isLoading.value = true
  try {
    const result: any = await updateTemplate({
      template_id: id,
      name: form.value.name,
      template: form.value.html,
      design: form.value.html, // Lưu HTML vào design field
    })

    if (result.statusCode === 200) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Template updated successfully', life: 3000 })
      router.push('/email-campaign-template')
    }
  } catch (error) {
    console.error('Update error:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update template', life: 3000 })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="page-wrapper">
    <div class="top-bar">
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-bold">Edit Email Template</h1>
      </div>
      <div class="flex gap-3">
        <Button label="Cancel" severity="secondary" @click="router.back()" />
        <Button label="Save Changes" :loading="isLoading" @click="onUpdate" icon="pi pi-check" />
      </div>
    </div>

    <div v-if="isFetching" class="loading-state">
      <ProgressSpinner />
      <p>Loading template...</p>
    </div>

    <div v-else class="content-wrapper">
      <div class="name-input-bar">
        <label>Template Name</label>
        <InputText v-model="form.name" placeholder="Enter template name" class="flex-1" />
      </div>

      <div class="editor-container">
        <SimpleHtmlEditor ref="editorRef" v-model="form.html" />
      </div>
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

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.name-input-bar {
  background: white;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 16px;
}

.name-input-bar label {
  font-weight: 600;
  min-width: 120px;
  font-size: 14px;
}

.editor-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
}

.loading-state p {
  color: #64748b;
  font-size: 14px;
}
</style>
