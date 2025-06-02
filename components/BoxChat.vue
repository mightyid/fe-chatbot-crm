<script lang="ts" setup>
import ChatTyping from './ChatTyping.vue'
import { VMarkdownView } from 'vue3-markdown'
import 'vue3-markdown/dist/vue3-markdown.css'
const props = defineProps({
  listMessage: {
    type: Array as any,
    default: [],
  },
  groupInfo: {
    type: Object as any,
    default: {},
  },
  isTyping: {
    type: Boolean,
    default: false,
  },
  isScrollToBottom: {
    type: Number as any,
    default: new Date().getTime(),
  },
  isMain: {
    type: Boolean,
    default: false,
  },
})
const scrollContainer = ref<any>(null)
const emits = defineEmits(['loadMore'])

const scrollToBottom = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight + 100000000
  }
}

const getDebounce = useDebounceFn(() => {
  emits('loadMore')
}, 1000)

const visibilityChanged = (isVisible: any, entry: any) => {
  if (isVisible) {
    getDebounce()
  }
}
const checkPositionRight = (item: any) => {
  if (props.isMain) {
    if (item.user) return true
    return false
  } else {
    if (item.user) return false
    return true
  }
}
onMounted(() => {
  setTimeout(() => {
    scrollToBottom()
  }, 100)
})
watch(
  () => props.isScrollToBottom,
  () => {
    setTimeout(() => {
      scrollToBottom()
    }, 100)
  },
)
</script>

<template>
  <div class="flex-1 h-full overflow-y-auto pb-2 px-2 hide-scrollbar" ref="scrollContainer">
    <div class="flex flex-col-reverse justify-end gap-2">
      <div
        class="flex flex-col"
        v-for="(item, index) in listMessage"
        :key="item._id"
        :class="checkPositionRight(item) ? 'items-end' : 'items-start'"
        v-observe-visibility="{
          callback: index === listMessage.length - 1 ? visibilityChanged : () => {},
          intersection: {
            threshold: 0.1,
          },
        }"
      >
        <div
          v-if="item.message"
          class="w-fit max-w-[80%] px-[16px] py-[6px] rounded-[18px]"
          :class="checkPositionRight(item) ? 'bg-[#E5F6FF] rounded-br-0' : 'bg-[#F6F6F7] rounded-bl-0'"
        >
          <!-- {{ index }} -->
          <VMarkdownView :content="item.message"></VMarkdownView>
        </div>
      </div>
    </div>
    <ChatTyping v-if="isTyping" class="mt-2" />
  </div>
</template>
