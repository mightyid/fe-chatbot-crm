<script lang="ts" setup>
import NavChatItem from '~/components/NavChatItem.vue'

const { t } = useI18n()
const route = useRoute()
const { $api } = useNuxtApp()
const listGroup = ref<any>([])
const isLoadMore = ref(true)

const query = ref({
  page: Number(route.query?.page) || 1,
  search: (route.query?.search as string) || '',
})
const getData = async () => {
  const { result }: any = await $api(`lead`, {
    method: 'GET',
    params: {
      ...query.value,
    },
  })
  const newGroup = result.filter((item: any) => item.bot?._id)
  if (query.value.page === 1) {
    listGroup.value = newGroup
  } else {
    listGroup.value = [...listGroup.value, ...newGroup]
  }
  if (result.length < 20) {
    isLoadMore.value = false
  }
}
getData()
const getDebounce = useDebounceFn(() => {
  query.value.page = query.value.page + 1
  getData()
}, 100)

const visibilityChanged = (isVisible: any, entry: any) => {
  if (isVisible && isLoadMore.value) {
    getDebounce()
  }
}
</script>

<template>
  <div class="flex-1 w-full h-full grid grid-cols-5 overflow-hidden">
    <div
      class="col-span-1 flex-1 overflow-auto bg-white border-l-[1px] border-l-solid border-l-[#E1E1E1] hide-scrollbar"
    >
      <NavChatItem
        :groups="listGroup"
        v-for="(item, index) in listGroup"
        :key="item._id"
        :info="item"
        v-observe-visibility="{
          callback: index === listGroup.length - 1 ? visibilityChanged : () => {},
          intersection: {
            threshold: 0.1,
          },
        }"
      />
    </div>
    <div class="col-span-4 bg-white flex-1 bg-red overflow-hidden"> <NuxtPage /> </div>
  </div>
</template>
