<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const connectFacebook = async () => {
  await $api(`noti-config/facebook/code`, {
    method: 'POST',
    body: {
      code: route.query?.code,
    },
  })

  router.push('/setting/facebook')
}
connectFacebook()
</script>

<template>
  <div class="loading-container">
    <div class="loading-content">
      <div class="spinner">
        <div class="spinner-circle spinner-circle-outer"></div>
        <div class="spinner-circle spinner-circle-middle"></div>
        <div class="spinner-circle spinner-circle-inner"></div>
      </div>
      <div class="loading-text">Đang xử lý kết nối Facebook...</div>
      <div class="loading-subtext">Vui lòng đợi trong giây lát</div>
    </div>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 67px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 24px;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.spinner {
  position: relative;
  width: 120px;
  height: 120px;
}

.spinner-circle {
  position: absolute;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #3abff8;
  animation: spin 1.5s linear infinite;
}

.spinner-circle-outer {
  width: 120px;
  height: 120px;
  border-width: 4px;
  animation-duration: 2s;
}

.spinner-circle-middle {
  width: 90px;
  height: 90px;
  top: 15px;
  left: 15px;
  border-width: 3px;
  border-top-color: #5fcfff;
  animation-duration: 1.5s;
  animation-direction: reverse;
}

.spinner-circle-inner {
  width: 60px;
  height: 60px;
  top: 30px;
  left: 30px;
  border-width: 3px;
  border-top-color: #8edfff;
  animation-duration: 1s;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 24px;
  font-weight: 700;
  color: #313131;
  text-align: center;
  animation: pulse 2s ease-in-out infinite;
}

.loading-subtext {
  font-size: 16px;
  font-weight: 400;
  color: #8a8a8a;
  text-align: center;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
