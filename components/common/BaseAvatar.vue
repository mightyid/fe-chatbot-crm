<script setup lang="ts">
import { avatarDefault } from '~/assets/images'

type TypeAvatar = 'circle' | 'square' | null

defineProps({
  size: {
    type: [String, Number],
    default: 32,
  },
  url: {
    type: String as PropType<string | null | undefined | unknown>,
  },
  type: {
    type: String as PropType<TypeAvatar>,
    default: '',
  },
  aspect: {
    type: String,
    default: '1/1',
  },
})
</script>

<template>
  <img
    class="object-cover rounded-full bg-[#eeeef0]"
    :style="{
      width: size + 'px',
      borderRadius: type === 'square' ? '4px' : '50%',
      aspectRatio: aspect,
    }"
    :src="typeof url === 'string' && url ? url : avatarDefault"
    alt=""
  />
</template>
