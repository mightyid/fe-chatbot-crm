<script setup lang="ts">
definePageMeta({
  layout: 'blank',
  auth: false,
})

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="unsubscribe-page">
    <div class="content-card">
      <div class="icon-header">
        <div class="check-circle">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 6L9 17L4 12"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>

      <h1 class="title">Unsubscribed</h1>

      <p class="description">
        You have been successfully removed from our mailing list. We're sorry to see you go, but we've updated your
        preferences immediately.
      </p>

      <div class="action-section">
        <button @click="goHome" class="btn-home"> Return to Website </button>
      </div>

      <div class="footer-note"> If this was a mistake, you can always re-subscribe on our homepage. </div>
    </div>
  </div>
</template>

<style scoped>
.unsubscribe-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  padding: 24px;
  font-family:
    'Inter',
    -apple-system,
    system-ui,
    sans-serif;
}

.content-card {
  width: 100%;
  max-width: 400px;
  text-align: center;
  padding: 20px;
}

.icon-header {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.check-circle {
  width: 64px;
  height: 64px;
  background-color: #f0fdf4;
  color: #16a34a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.check-circle svg {
  width: 32px;
  height: 32px;
}

.title {
  color: #0f172a;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.description {
  color: #475569;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 40px;
}

.btn-home {
  background-color: #0f172a;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.btn-home:hover {
  background-color: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
}

.footer-note {
  margin-top: 32px;
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.5;
}

@media (max-width: 480px) {
  .title {
    font-size: 28px;
  }
}
</style>
