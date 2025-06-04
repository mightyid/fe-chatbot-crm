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
})

const listColors = ['#6F57CF', '#AB99EC', '#E93C82', '#0091FF', '#66B975', '#E6484E']
const emit = defineEmits(['onSubmit', 'onCancel', 'onEdit'])

const { handleSubmit, resetForm } = useForm()

const form = ref<any>({
  name: props.data?.name || '',
  color: props.data?.color || '#6F57CF',
  color_custom: props.data?.color_custom || '#000000',
})

const onSubmit = handleSubmit(() => {
  if (!props.isEdit) {
    emit('onSubmit', { ...toRaw(form.value) })
  } else {
    emit('onEdit', { ...toRaw(form.value), _id: props.data?._id })
  }
  // resetForm({
  //   values: {
  //     name: '',
  //   },
  // })
})
const changeColor = (color: any) => {
  console.log(color, 'color')
  form.value.color = form.value.color_custom
}

watch(
  () => props.data,
  (newValue) => {
    form.value = { ...newValue }
  },
  { deep: true },
)
</script>

<template>
  <form autocomplete="off" @submit.prevent="onSubmit">
    <div class="text-2xl font-bold text-center">{{ isEdit ? 'Edit Label' : 'Create Label' }}</div>
    <div class="grid grid-cols-1 gap-6">
      <BaseInputText class="flex-1" name="name" label="Name" :rules="{ required: true }" v-model="form.name" />
      <div class="fr ai-c gap-4">
        <div
          class="p-[6px] rounded relative cursor-pointer"
          :class="color == form.color ? 'border border-solid border-[#cccccc]' : ''"
          @click="form.color = color"
          v-for="color in listColors"
        >
          <div class="w-[46px] h-[46px] fr ai-c jc-c rounded-full" :style="{ backgroundColor: color }"></div>
          <img
            v-if="form.color == color"
            src="~/assets/icons/i-check-white.svg"
            class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] icon"
            alt=""
          />
        </div>
        <label
          for="inputColor"
          class="p-[6px] rounded relative cursor-pointer"
          @click="form.color = form.color_custom"
          :class="form.color == form.color_custom ? 'border border-solid border-[#cccccc]' : ''"
        >
          <div class="w-[46px] h-[46px] fr ai-c jc-c rounded-full overflow-hidden">
            <input
              v-model="form.color_custom"
              @change="changeColor"
              id="inputColor"
              type="color"
              class="z-1 min-w-[80px] h-[60px] fr ai-c jc-c rounded-full cursor-pointer !border-none"
            />
          </div>
          <img src="@/assets/icons/i-pen-black.svg" class="w-[16px] absolute top-[0px] right-[0px] z-999" alt="" />
          <img
            v-if="form.color == form.color_custom"
            src="~/assets/icons/i-check-white.svg"
            class="absolute z-[9] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] icon"
            alt=""
          />
        </label>
      </div>
    </div>

    <div class="flex justify-end gap-4 mt-4">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="
          () => {
            emit('onCancel')
          }
        "
      />
      <Button type="submit" :label="isEdit ? 'Save' : 'Create'" severity="primary" />
    </div>
  </form>
</template>
