<script setup lang="ts">
definePageMeta({
  layout: 'landing-page',
  auth: false,
})
</script>

<template>
  <div class="privacy-page bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
      <div class="bg-gradient-to-r from-teal-600 to-teal-800 py-12 px-8 text-white">
        <h1 class="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
      </div>

      <div class="p-8 sm:p-12 text-gray-700 leading-relaxed">
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">About This Privacy Policy</h2>
          <p>
            This Privacy Policy applies to the Chatbot CRM application and services provided by
            <strong>MapleSTC</strong>. MapleSTC is the owner and operator of this application. We are committed to
            protecting your privacy and ensuring the security of your personal information.
          </p>
          <p class="mt-4">
            <strong>Company Name:</strong> MapleSTC<br />
            <strong>Application:</strong> Chatbot CRM<br />
            <strong>Last Updated:</strong> January 2026
          </p>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">1. Information Collection</h2>
          <p
            >We collect information when you register an account, use our services, or contact support. Information
            collected may include:</p
          >
          <ul class="list-disc pl-6 mt-2 space-y-2">
            <li>Identification information: Full name, email, phone number.</li>
            <li>Account information: Username, password (encrypted).</li>
            <li>Customer data: Information you provide for processing via Chatbot or CRM.</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">2. Use of Information</h2>
          <p>The collected information is used for the following purposes:</p>
          <ul class="list-disc pl-6 mt-2 space-y-2">
            <li>Providing, operating, and maintaining service features.</li>
            <li>Personalizing user experience and improving products.</li>
            <li>Sending updates, system notifications, and promotional content (if you agree).</li>
            <li>Detecting and preventing fraudulent acts or cyber attacks.</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">3. Information Security</h2>
          <p
            >We apply technical and organizational security measures to protect your personal data from unauthorized
            access, use, or disclosure. Your data is stored on secure servers and encrypted when necessary.</p
          >
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing</h2>
          <p
            >We commit not to sell, trade, or rent your personal information to third parties. We only share information
            when:</p
          >
          <ul class="list-disc pl-6 mt-2 space-y-2">
            <li>With your explicit consent.</li>
            <li>Required by law or competent state authorities.</li>
            <li>To protect our legal rights, safety, and our users.</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
          <p
            >You have the right to access, edit, or request deletion of your personal information at any time through
            account settings or by contacting us directly. You also have the right to object to or restrict certain data
            processing activities.</p
          >
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">6. Cookies</h2>
          <p
            >Our website uses cookies to maintain sessions and remember user preferences. You can choose to disable
            cookies in your browser settings, but this may affect some features of the service.</p
          >
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">7. Contact</h2>
          <p> If you have any questions about this Privacy Policy, please contact <strong>MapleSTC</strong>: </p>
          <p class="mt-2">
            <strong>Email:</strong> privacy@maplestc.com<br />
            <strong>Company:</strong> MapleSTC<br />
            <strong>Application:</strong> Chatbot CRM
          </p>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">8. Facebook Data</h2>
          <p
            >When you connect a Facebook Fanpage, we collect user names, user IDs, and message content to provide
            chatbot services. We do not collect or store your Facebook password.</p
          >
        </section>
      </div>

      <div class="bg-gray-50 px-8 py-6 border-t border-gray-100 text-center">
        <NuxtLink to="/" class="text-teal-600 hover:text-teal-700 font-semibold transition-colors duration-200">
          ← Back to home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.privacy-page {
  min-height: 100vh;
}

.bg-gradient-to-r {
  background: linear-gradient(135deg, #059669 0%, #064e3b 100%);
}

.text-teal-600 {
  color: #059669;
}

.hover\:text-teal-700:hover {
  color: #047857;
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
