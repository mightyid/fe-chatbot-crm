<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const breadCrumb = computed(() => {
  const fullPath = route.path
  const params = fullPath.substring(1).split('/')
  const data = [] as any

  let path = ''

  params.forEach((param: string) => {
    path = `${path}/${param}`
    const match = router.resolve(path)

    if (match.name) {
      const currentRoute = match.matched.find((item: any) => item?.name === match.name)

      if (currentRoute && currentRoute?.children?.length <= 0 && currentRoute?.meta?.titleBreadCrumb) {
        data.push({
          title: currentRoute?.meta?.titleBreadCrumb,
          path: match?.path,
        })
      }
    }
  })

  return data
})
</script>

<template>
  <div class="mb-4 flex gap-[8px]">
    <template v-for="(item, index) in breadCrumb" :key="item?.path">
      <span class="text-sm font-normal c-black-60" v-if="index > 0"> / </span>
      <nuxt-link
        class="text-sm font-normal no-underline"
        :class="route.path === item?.path ? ['c-primary'] : ['c-black-60']"
        :to="item?.path"
      >
        {{ t(item?.title) }}
      </nuxt-link>
    </template>
  </div>
</template>
