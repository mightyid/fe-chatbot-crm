<script lang="ts" setup>
import useMoment from '~/composables/useMoment'
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
})
const route = useRoute()
const toast = useToast()
const emit = defineEmits(['onGetData'])
const { $api } = useNuxtApp()
const editorNoteConfig = ref({
  removePlugins: ['Image'],
  placeholder: 'Enter',
  toolbar: {
    items: [
      'undo',
      'redo',
      '|',
      'heading',
      '|',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'bold',
      'italic',
      'strikethrough',
      '|',
      'link',
      'blockQuote',
      '|',
      'bulletedList',
      'numberedList',
    ],
    shouldNotGroupWhenFull: false,
  },
})
const formNote = ref({
  content: '',
})
const createNote = async () => {
  const { result }: any = await $api<any>(`lead/${route.params.id}/note`, {
    method: 'POST',
    body: {
      note: formNote.value.content,
    },
  })

  if (result) {
    toast.add({ severity: 'success', summary: 'Notifications', detail: 'Successfully', life: 3000 })
    emit('onGetData')
    // const index = applications.value.findIndex((item: any) => item?._id === formNote.value?._id)
    // const newItem = {
    //   ...applications.value[index],
    //   note: data.value.result.note,
    // }
    // applications.value.splice(index, 1, newItem)
    // closeNote()
    formNote.value.content = ''
  }
}
</script>

<template>
  <div class="fc min-h-80vh">
    <BaseEditor class="mb-3" :editorConfig="editorNoteConfig" v-model="formNote.content" />

    <div class="flex justify-end gap-4">
      <Button
        label="Create"
        severity="primary"
        type="button"
        @click="createNote"
        :disabled="!formNote.content || formNote.content.length < 1"
      />
    </div>

    <div class="mt-6 flex flex-col gap-6" v-if="data?.notes?.length > 0">
      <div
        class="relative flex items-start gap-3"
        v-for="(item, index) in data.notes?.sort((a: any, b: any) => new Date(b.created_at) - new Date(a.created_at))"
        :key="item._id"
      >
        <BaseAvatar :url="item?.user?.avatar" :size="32" />

        <div class="flex-1">
          <div class="mb-[4px] flex items-center gap-3">
            <p class="text-base font-normal c-black-90 m-0">
              {{ item?.user?.name }}
            </p>
            <span class="text-xs font-normal c-gray-40">
              {{ useMoment(item?.created_at) }}
            </span>
          </div>
          <div class="text-base font-normal c-gray-50" v-html="item?.note"></div>
        </div>

        <div class="absolute top-32 left-16 w-[1px] h-full bg-black-20" v-if="index < data.notes.length - 1"></div>
      </div>
    </div>
  </div>
</template>
