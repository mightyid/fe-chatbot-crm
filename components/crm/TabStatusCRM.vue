<script setup lang="ts">
const props = defineProps({
  labels: {
    type: Array as any,
    default: () => [],
  },
  numberApplicationStatus: {
    type: Object,
    default: () => {},
  },
  isExternal: {
    type: Boolean,
    default: false,
  },
})
const route = useRoute()
const emit = defineEmits(['onChangeStatus'])
const total = computed(() => {
  if (props.numberApplicationStatus) {
    const numbers = Object.values(props.numberApplicationStatus)
    return numbers.reduce((a: any, b: any) => a + b, 0)
  }
  return 0
})
const changeStatus = (val: any) => {
  emit('onChangeStatus', val)
}
</script>

<template>
  <div class="fr jc-sb ai-c rounded-tl-lg rounded-tr-lg bg-white border-b-[1px] border-b-solid border-b-#E1E1E1">
    <div class="flex items-center gap-0 overflow-x-auto flex-1">
      <div
        class="fr ai-c gap-2 px-[24px] py-[12px] text-base capitalize relative rounded-tl-lg rounded-tr-lg cursor-pointer"
        @click="changeStatus('')"
        :class="{ 'border-b-2px border-b-solid font-bold': route.query?.label_id == '' || !route.query?.label_id }"
        :style="{
          color: route.query?.label_id == '' || !route.query?.label_id ? '#3ABFF8' : '#8A8A8A',
          borderBottomColor: '#3ABFF8',
        }">
        All
        <div
          v-if="total > 0"
          severity="danger"
          class="z1 rounded-[16px] px-1 py-[2px] text-xs"
          :style="{
            color: route.query?.label_id == '' || !route.query?.label_id ? '#ffffff' : '#8A8A8A',
            backgroundColor: route.query?.label_id == '' || !route.query?.label_id ? '#3ABFF8' : '#EFEFEF',
            border: route.query?.label_id == '' || !route.query?.label_id ? 'none' : '',
          }">
          {{ total }}
        </div>
      </div>

      <div
        class="fr ai-c gap-2 px-[24px] py-[12px] text-base capitalize relative rounded-tl-lg rounded-tr-lg cursor-pointer"
        @click="changeStatus(item._id)"
        v-for="(item, index) in labels"
        :class="{ 'border-b-2px border-b-solid font-bold': route.query?.label_id == item._id }"
        :style="{
          color: route.query?.label_id == item._id ? item.color : '#8A8A8A',
          borderBottomColor: route.query?.label_id == item._id ? item.color : '#000000',
        }"
        :key="item.key">
        {{ item.name }}
        <div
          severity="danger"
          class="z1 rounded-[16px] px-1 py-[2px] text-xs"
          :style="{
            color: route.query?.label_id == item._id ? '#ffffff' : '#8A8A8A',
            backgroundColor: route.query?.label_id == item._id ? item.color : '#EFEFEF',
            border: route.query?.label_id == item._id ? 'none' : '',
          }"
          v-if="numberApplicationStatus[item._id] > 0">
          {{ numberApplicationStatus[item._id] }}
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<style scoped></style>
