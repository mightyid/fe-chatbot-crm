<script setup lang="ts">

interface FunctionItem {
  id: string
  key: string
  value: string
}

type ModelValue = Record<string, string> | null | undefined

const props = defineProps<{
  modelValue: ModelValue
  label?: string
  required?: boolean
  className?: string
}>()

const emit = defineEmits<{
  (e: "update:modelValue", v: Record<string, string>): void
}>()

// Nếu bạn đã có helper generateRandomId thì import vào, còn không dùng fallback này.
const generateRandomId = () =>
  (globalThis.crypto?.randomUUID?.() ?? `id_${Date.now()}_${Math.random().toString(16).slice(2)}`)

const convertObjectToItems = (obj: ModelValue): FunctionItem[] => {
  if (!obj || typeof obj !== "object") return []
  return Object.entries(obj).map(([key, value]) => ({
    id: generateRandomId(),
    key,
    value: String(value ?? ""),
  }))
}

const items = ref<FunctionItem[]>(convertObjectToItems(props.modelValue))
const jsonErrors = ref<Record<string, string>>({})
const editingId = ref<string | null>(null)
const initialized = ref(false)

const editingItem = computed(() => items.value.find((i) => i.id === editingId.value) || null)
const editingIndex = computed(() => items.value.findIndex((i) => i.id === editingId.value))

const openEdit = (id: string) => (editingId.value = id)
const closeEdit = () => (editingId.value = null)

const validateJson = (value: string): boolean => {
  if (!value.trim()) return true
  try {
    JSON.parse(value.trim())
    return true
  } catch {
    return false
  }
}

// Update v-model when items change
const updateModelValue = (newItems: FunctionItem[]) => {
  const newValue: Record<string, string> = {}
  const errors: Record<string, string> = {}

  newItems.forEach((item) => {
    const k = item.key.trim()
    const v = item.value.trim()
    if (k && v) {
      if (validateJson(v)) newValue[k] = v
      else errors[item.id] = "Invalid JSON format"
    }
  })

  jsonErrors.value = errors
  emit("update:modelValue", newValue)
}

const handleAdd = () => {
  const newId = generateRandomId()
  const newItems = [...items.value, { id: newId, key: "", value: "" }]
  items.value = newItems
  updateModelValue(newItems)
}

const handleRemove = (index: number) => {
  const newItems = items.value.filter((_, i) => i !== index)
  items.value = newItems
  updateModelValue(newItems)

  // nếu đang edit item bị xóa thì đóng modal
  if (editingId.value && !newItems.some((i) => i.id === editingId.value)) closeEdit()
}

const handleKeyChange = (index: number, newKey: string) => {
  const newItems = [...items.value]
  newItems[index] = { ...newItems[index], key: newKey }
  items.value = newItems
  updateModelValue(newItems)
}

const handleValueChange = (index: number, newValue: string) => {
  const newItems = [...items.value]
  newItems[index] = { ...newItems[index], value: newValue }
  items.value = newItems
  updateModelValue(newItems)
}

// Sync khi modelValue đổi từ bên ngoài (edit page load dữ liệu)
watch(
  () => props.modelValue,
  (val) => {
    if (!initialized.value) {
      initialized.value = true
      return
    }

    const fieldObj = (val ?? {}) as Record<string, string>
    const fieldKeys = Object.keys(fieldObj)

    // giống logic bên React: chỉ sync từ ngoài vào nếu có data và items đang rỗng
    if (fieldKeys.length > 0 && items.value.length === 0) {
      items.value = convertObjectToItems(val)
    }
  }
)
</script>

<template>
  <div :class="className">
    <div class="mb-2 flex items-center gap-2">
      <label v-if="label" class="text-base font-normal c-black-90">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>

      <button type="button" @click="handleAdd" class="inline-flex items-center">
        <img class="icon" src="~/assets/icons/i-plus-circle-primary.svg" alt="" />
      </button>
    </div>

    <div class="space-y-4">
      <div v-for="(item, index) in items" :key="item.id" class="flex flex-col">
        <div class="flex gap-4 items-center">
          <div class="flex-1">
            <InputText
              class="flex-1 w-full"
              :value="item.key"
              @input="handleKeyChange(index, ($event.target as HTMLInputElement).value)"
              placeholder="Function name"
              :required="required"
            />
          </div>

          <div class="flex">
            <button type="button" @click="openEdit(item.id)">
              <img class="icon" src="~/assets/icons/i-pen-circle.svg" alt="edit" />
            </button>

            <button type="button" @click="handleRemove(index)">
              <img class="icon" src="~/assets/icons/i-trash-red.svg" alt="remove" />
            </button>
          </div>
        </div>

        <p v-if="jsonErrors[item.id]" class="text-sm text-red-500">
          {{ jsonErrors[item.id] }}
        </p>
      </div>
    </div>

    <!-- Simple Dialog (no external UI lib) -->
    <Teleport to="body">
      <div
        v-if="editingId !== null"
        class="fixed inset-0 z-50 flex items-center justify-center"
        aria-modal="true"
        role="dialog"
      >
        <div class="absolute inset-0 bg-black/40" @click="closeEdit" />

        <div class="relative z-10 w-[95vw] max-w-3xl rounded-xl bg-white p-4 shadow-lg">
          <div class="flex items-start justify-between gap-4">
            <h3 class="text-base font-semibold">
              {{ editingItem?.key || "Edit Function" }}
            </h3>

            <button type="button" class="text-sm" @click="closeEdit">✕</button>
          </div>

          <div class="mt-4">
            <textarea
              class="w-full rounded-md border px-3 py-2 text-sm outline-none max-h-[80vh]"
              :class="editingId && jsonErrors[editingId] ? 'border-red-500' : ''"
              :rows="20"
              :value="editingItem?.value || ''"
              @input="
                editingIndex >= 0 &&
                  handleValueChange(editingIndex, ($event.target as HTMLTextAreaElement).value)
              "
              placeholder="Definition (JSON format)"
            />
            <p v-if="editingId && jsonErrors[editingId]" class="text-sm text-red-500 mt-1">
              {{ jsonErrors[editingId] }}
            </p>
            <p v-else class="h-6"></p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
