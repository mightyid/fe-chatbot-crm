<script setup lang="ts">
const { t } = useI18n()

// Define pricing plans structure with translation keys
const pricingPlansConfig = [
  {
    key: 'basic',
    color: 'green',
    popular: false,
    pricing: {
      vi: {
        price: '95 Tr',
        currency: 'VNĐ/năm',
        period: 'Bao gồm mọi tính năng cơ bản',
      },
      en: {
        price: '$3,800',
        currency: 'USD/year',
        period: 'Includes all basic features',
      },
    },
    features: {
      chatbot: [
        { key: 'integration', available: true },
        { key: 'customization', available: true },
        { key: 'instant_response', available: true },
        { key: 'registration_support', available: true },
      ],
      crm: [
        { key: 'lead_management', available: true },
        { key: 'role_permissions', available: true },
        { key: 'professional_process', available: true },
        { key: 'detailed_reports', available: true },
        { key: 'auto_sync', available: true },
        { key: 'notification_channels', available: true },
      ],
      smartapply: [{ key: 'profile_management', available: false }],
      advanced: [
        { key: 'third_party_api', available: false },
        { key: 'system_integration', available: false },
        { key: 'webhook_connection', available: false },
        { key: 'webhook_creation', available: false },
        { key: 'webhook_setup', available: false },
      ],
    },
    limitations: {
      vi: {
        applications: '-',
        setupFee: '-',
        supportFee: '35 Triệu',
      },
      en: {
        applications: '-',
        setupFee: '-',
        supportFee: '$1,400',
      },
    },
  },
  {
    key: 'eco',
    color: 'blue',
    popular: true,
    pricing: {
      vi: {
        price: '120 Tr',
        currency: 'VNĐ/năm',
        period: 'Bao gồm mọi tính năng nâng cao',
      },
      en: {
        price: '$4,800',
        currency: 'USD/year',
        period: 'Includes all advanced features',
      },
    },
    features: {
      chatbot: [
        { key: 'integration', available: true },
        { key: 'customization', available: true },
        { key: 'instant_response', available: true },
        { key: 'registration_support', available: true },
      ],
      crm: [
        { key: 'lead_management', available: true },
        { key: 'role_permissions', available: true },
        { key: 'professional_process', available: true },
        { key: 'detailed_reports', available: true },
        { key: 'auto_sync', available: true },
        { key: 'notification_channels', available: true },
      ],
      smartapply: [{ key: 'profile_management', available: true }],
      advanced: [
        { key: 'third_party_api', available: true },
        { key: 'system_integration', available: true },
        { key: 'webhook_connection', available: true },
        { key: 'webhook_creation', available: true },
        { key: 'webhook_setup', available: true },
      ],
    },
    limitations: {
      vi: {
        applications: '300',
        setupFee: '325.000 VNĐ',
        supportFee: '50 Triệu',
      },
      en: {
        applications: '300',
        setupFee: '$13 USD',
        supportFee: '$2,000',
      },
    },
  },
  {
    key: 'pro',
    color: 'purple',
    popular: false,
    pricing: {
      vi: {
        price: '150 Tr',
        currency: 'VNĐ/năm',
        period: 'Bao gồm mọi tính năng cao cấp',
      },
      en: {
        price: '$6,000',
        currency: 'USD/year',
        period: 'Includes all premium features',
      },
    },
    features: {
      chatbot: [
        { key: 'integration', available: true },
        { key: 'customization', available: true },
        { key: 'instant_response', available: true },
        { key: 'registration_support', available: true },
      ],
      crm: [
        { key: 'lead_management', available: true },
        { key: 'role_permissions', available: true },
        { key: 'professional_process', available: true },
        { key: 'detailed_reports', available: true },
        { key: 'auto_sync', available: true },
        { key: 'notification_channels', available: true },
      ],
      smartapply: [{ key: 'profile_management', available: true }],
      advanced: [
        { key: 'third_party_api', available: true },
        { key: 'system_integration', available: true },
        { key: 'webhook_connection', available: true },
        { key: 'webhook_creation', available: true },
        { key: 'webhook_setup', available: true },
      ],
    },
    limitations: {
      vi: {
        applications: '1,000',
        setupFee: '313.000 VNĐ',
        supportFee: '75 Triệu',
      },
      en: {
        applications: '1,000',
        setupFee: '$12.5 USD',
        supportFee: '$3,000',
      },
    },
  },
]

// Computed property to get translated pricing plans
const { locale } = useI18n()

// Computed property for recommended text
const recommendedText = computed(() => {
  try {
    return t('common.recommended')
  } catch (error) {
    return locale.value === 'vi' ? 'Khuyến nghị' : 'Recommended'
  }
})
const pricingPlans = computed(() => {
  const currentLang = locale.value as 'vi' | 'en'

  return pricingPlansConfig.map((plan) => {
    const pricing = plan.pricing?.[currentLang] || plan.pricing?.vi || {}
    const limitations = plan.limitations?.[currentLang] || plan.limitations?.vi || {}

    return {
      ...plan,
      name: t(`pricing.plans.${plan.key}.name`),
      subtitle: t(`pricing.plans.${plan.key}.subtitle`),
      price: pricing.price || '',
      currency: pricing.currency || '',
      period: pricing.period || '',
      limitations: limitations,
      features: {
        chatbot: plan.features.chatbot.map((feature) => ({
          text: t(`pricing.features.chatbot.${feature.key}`),
          available: feature.available,
        })),
        crm: plan.features.crm.map((feature) => ({
          text: t(`pricing.features.crm.${feature.key}`),
          available: feature.available,
        })),
        smartapply: plan.features.smartapply.map((feature) => ({
          text: t(`pricing.features.smartapply.${feature.key}`),
          available: feature.available,
        })),
        advanced: plan.features.advanced.map((feature) => ({
          text: t(`pricing.features.advanced.${feature.key}`),
          available: feature.available,
        })),
      },
    }
  })
})
</script>

<template>
  <section class="py-10 px-4 lg:py-20 bg-gray-50">
    <div class="container mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-heading mb-4">{{ t('pricing.title') }}</h2>
        <p class="text-paragraph">{{ t('pricing.subtitle') }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <div
          v-for="(plan, index) in pricingPlans"
          :key="index"
          class="bg-white rounded-lg border-2 p-6 relative"
          :class="plan.popular ? 'border-blue-500 shadow-xl' : 'border-gray-200'"
        >
          <!-- Plan Header -->
          <div class="text-center mb-6">
            <h3
              class="text-2xl font-bold mb-2"
              :class="{
                'text-green-600': plan.color === 'green',
                'text-blue-600': plan.color === 'blue',
                'text-purple-600': plan.color === 'purple',
              }"
            >
              {{ plan.name }}
            </h3>
            <p class="text-sm text-gray-600 mb-4">{{ plan.subtitle }}</p>

            <div class="mb-2">
              <span class="text-4xl font-bold">{{ plan.price }}</span>
              <span class="text-gray-600 ml-1">{{ plan.currency }}</span>
            </div>
            <p class="text-xs text-gray-500">{{ plan.period }}</p>
          </div>

          <!-- Features List -->
          <div class="space-y-4 mb-8">
            <!-- Chatbot Section -->
            <div>
              <h4 class="font-semibold text-sm text-blue-600 mb-3 border-b pb-1">{{
                t('pricing.sections.chatbot')
              }}</h4>
              <div class="space-y-2">
                <div v-for="feature in plan.features.chatbot" :key="feature.text" class="flex items-start text-xs">
                  <svg
                    v-if="feature.available"
                    class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span v-else class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-300">-</span>
                  <span :class="feature.available ? 'text-gray-700' : 'text-gray-400'">{{ feature.text }}</span>
                </div>
              </div>
            </div>

            <!-- CRM Section -->
            <div>
              <h4 class="font-semibold text-sm text-blue-600 mb-3 border-b pb-1">
                {{ t('pricing.sections.crm') }}
              </h4>
              <div class="space-y-2">
                <div v-for="feature in plan.features.crm" :key="feature.text" class="flex items-start text-xs">
                  <svg
                    v-if="feature.available"
                    class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span v-else class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-300">-</span>
                  <span :class="feature.available ? 'text-gray-700' : 'text-gray-400'">{{ feature.text }}</span>
                </div>
              </div>
            </div>

            <!-- SmartApply Section -->
            <div>
              <h4 class="font-semibold text-sm text-green-600 mb-3 border-b pb-1">
                {{ t('pricing.sections.smartapply') }}
              </h4>
              <div class="space-y-2">
                <div v-for="feature in plan.features.smartapply" :key="feature.text" class="flex items-start text-xs">
                  <svg
                    v-if="feature.available"
                    class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span v-else class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-300">-</span>
                  <span :class="feature.available ? 'text-gray-700' : 'text-gray-400'">{{ feature.text }}</span>
                </div>
              </div>
            </div>

            <!-- Advanced Features -->
            <div>
              <div class="space-y-2">
                <div v-for="feature in plan.features.advanced" :key="feature.text" class="flex items-start text-xs">
                  <svg
                    v-if="feature.available"
                    class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span v-else class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-300">-</span>
                  <span :class="feature.available ? 'text-gray-700' : 'text-gray-400'">{{ feature.text }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Limitations -->
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-sm mb-3">{{ t('pricing.limitations.title') }}</h4>
            <div class="space-y-1 text-xs text-gray-600">
              <p
                ><strong>{{ t('pricing.limitations.applications') }}</strong> {{ plan.limitations.applications }}</p
              >
              <p
                ><strong>{{ t('pricing.limitations.setup_fee') }}</strong> {{ plan.limitations.setupFee }}</p
              >
              <p
                ><strong>{{ t('pricing.limitations.support_fee') }}</strong> {{ plan.limitations.supportFee }}</p
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Note Section -->
      <div class="mt-12 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
        <h4 class="font-bold mb-3 text-yellow-800">{{ t('pricing.notes.title') }}</h4>
        <ul class="space-y-2 text-sm text-yellow-700">
          <li>• <strong>Basic:</strong> {{ t('pricing.notes.basic') }}</li>
          <li
            >• <strong>Eco ({{ recommendedText }}):</strong> {{ t('pricing.notes.eco') }}</li
          >
          <li>• <strong>Pro:</strong> {{ t('pricing.notes.pro') }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.text-heading {
  font-size: 32px;
  font-weight: 800;
  color: #313131;
  text-align: center;
}

.text-paragraph {
  font-size: 16px;
  line-height: 24px;
  color: #313131;
  text-align: center;
}

@media screen and (max-width: 1023px) {
  .text-heading {
    font-size: 24px;
    line-height: 36px;
  }
}
</style>
