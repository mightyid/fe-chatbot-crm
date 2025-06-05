<script setup lang="ts">
import QRCodeVue3 from 'qrcode-vue3'
const props = defineProps({
  value: {
    type: String,
    default: 'https://smartapply.ca',
  },
  width: {
    type: Number,
    default: 200,
  },
  height: {
    type: Number,
    default: 200,
  },
})
</script>
<template>
  <div class="flex jc-c-ai">
    <QRCodeVue3
      :width="width"
      :height="height"
      :value="value"
      :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'L' }"
      :imageOptions="{ hideBackgroundDots: true, imageSize: 0.4, margin: 0 }"
      :dotsOptions="{
        type: 'dots',
        color: '#000000',
        gradient: {
          type: 'linear',
          rotation: 0,
          colorStops: [
            { offset: 0, color: '#000000' },
            { offset: 1, color: '#000000' },
          ],
        },
      }"
      :backgroundOptions="{ color: '#ffffff' }"
      :cornersDotOptions="{ type: undefined, color: '#000000' }"
      fileExt="png"
      myclass="my-qur"
      imgclass="img-qr" />
  </div>
</template>
