<script setup lang="ts">
type COLORS =
  | 'initial'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'blue-sky'
  | 'yellow'
  | 'green'
  | 'red'
  | 'blue'
  | 'purple'
  | 'light-blue'
  | 'grey'
  | 'pink'
  | ''

const props = defineProps({
  tagColor: {
    type: String as PropType<COLORS>,
    required: true,
  },
  text: {
    type: [String, Number],
    required: true,
  },
  tooltipText: {
    type: [String, Number],
  },
  tooltipPosition: {
    type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
    default: 'bottom',
  },
})

const classByTagColor = computed(() => {
  switch (props.tagColor) {
    case 'blue-sky':
    case 'initial':
      return 'c-[#3AB2F8] bg-primary-10'

    case 'yellow':
    case 'pending':
      return 'color-[#FFAA00] bg-[#FFF2D8]'

    case 'green':
    case 'approved':
      return 'color-[#66B975] bg-[#E7FEE9]'

    case 'red':
    case 'rejected':
      return 'color-[#FF4A4A] bg-[#FFF0F0]'

    case 'blue':
      return 'color-[#017FFF] bg-[#E3F0FF]'

    case 'purple':
      return 'color-[#9448D5] bg-[#F2E8FA]'

    case 'light-blue':
      return 'color-[#40C3C3] bg-[#E8FAFA]'

    case 'grey':
      return 'color-[#8A8A8A] bg-[#F4F4F4]'

    case 'pink':
      return 'color-[#E866C3] bg-[#FAE8F5]'

    default:
      return ''
  }
})

const position = computed(() => {
  return {
    position: props.tooltipPosition,
  }
})

const tooltipOptions = computed(() => {
  const borderColorByPosition = {} as any

  switch (props.tooltipPosition) {
    case 'top':
      borderColorByPosition.borderTopColor = '#8A8A8A'
      break

    case 'right':
      borderColorByPosition.borderRightColor = '#8A8A8A'
      break

    case 'bottom':
      borderColorByPosition.borderBottomColor = '#8A8A8A'
      break

    case 'left':
      borderColorByPosition.borderLeftColor = '#8A8A8A'
      break
  }

  return {
    value: props.tooltipText,
    pt: {
      arrow: {
        style: {
          ...borderColorByPosition,
        },
      },
      text: 'text-s font-normal bg-[#8A8A8A]',
    },
    autoHide: false,
  }
})
</script>

<template>
  <p
    class="m-0 py-1 px-3 flex justify-center items-center gap-1 text-base font-normal text-center rounded whitespace-nowrap"
    :class="classByTagColor"
  >
    <span class="first-letter:uppercase"> {{ text }} </span>

    <template v-if="tooltipText">
      <div v-tooltip:[position]="tooltipOptions" v-if="$slots.iconTooltip">
        <slot class="icon" name="iconTooltip"></slot>
      </div>

      <img class="icon" src="~/assets/icons/i-tooltip.svg" alt="" v-tooltip:[position]="tooltipOptions" v-else />
    </template>
  </p>
</template>
