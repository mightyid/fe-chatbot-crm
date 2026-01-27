<script setup lang="ts">
definePageMeta({
  layout: 'landing-page',
  auth: false,
})
</script>

<template>
  <div class="terms-page bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 py-12 px-8 text-white">
        <h1 class="text-4xl font-extrabold tracking-tight">Terms of Service</h1>
      </div>

      <div class="p-8 sm:p-12 text-gray-700 leading-relaxed">
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p
            >By accessing and using our services, you agree to comply with and be bound by these Terms of Service. If
            you do not agree with any part of these terms, please do not use our services.</p
          >
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
          <p
            >We provide smart CRM and Chatbot solutions to help businesses optimize customer management processes and
            automate interactions. Services include but are not limited to: campaign management, chatbot integration,
            and customer data analysis.</p
          >
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
          <ul class="list-disc pl-6 space-y-2">
            <li>You must provide accurate and updated information when registering an account.</li>
            <li
              >You are responsible for maintaining the confidentiality of your password and all activities under your
              account.</li
            >
            <li>You must not use the service for any illegal purposes or copyright infringement.</li>
            <li>You commit not to perform any harmful acts or attacks on our system.</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property Rights</h2>
          <p
            >All content, icons, source code, and technology related to the service are our exclusive property or our
            licensors. You may not copy, modify, or redistribute without written consent.</p
          >
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
          <p
            >We strive to provide the most stable service possible, but do not guarantee that the service will be
            uninterrupted or error-free. We are not liable for any direct or indirect damages arising from the use or
            inability to use the service.</p
          >
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">6. Changes to Terms</h2>
          <p
            >We reserve the right to update these Terms of Service at any time. Changes will take effect immediately
            upon posting on the website. Your continued use of the service constitutes acceptance of the new terms.</p
          >
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">7. Contact</h2>
          <p>If you have any questions about the Terms of Service, please contact us via email: support@mightyid.ca</p>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">8. Facebook Page Integration</h2>
          <p
            >When using the Facebook Chatbot feature, you agree to grant the system permission to access and manage
            designated Fanpages through Facebook APIs. We commit to using these permissions solely for responding to
            customer messages and synchronizing CRM data according to your settings. You have the right to disconnect
            your Fanpage at any time through the system configuration or Facebook application settings.</p
          >
        </section>
      </div>

      <div class="bg-gray-50 px-8 py-6 border-t border-gray-100 text-center">
        <NuxtLink to="/" class="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200">
          ← Back to home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.terms-page {
  min-height: 100vh;
}

.bg-gradient-to-r {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
}

.text-primary-600 {
  color: #2563eb;
}

.hover\:text-primary-700:hover {
  color: #1d4ed8;
}

h2 {
  margin-top: 2rem;
  color: #111827;
}

p {
  margin-bottom: 1rem;
}

ul {
  margin-bottom: 1rem;
}
</style>
