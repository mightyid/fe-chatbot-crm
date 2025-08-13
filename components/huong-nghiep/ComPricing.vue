<script lang="ts" setup>
const { t } = useI18n()

// Định nghĩa các tính năng và gói dịch vụ
const features = [
  { key: 'holland_test', name: 'Trắc nghiệm theo lý thuyết Holland' },
  { key: 'personality_analysis', name: 'Phân tích tính cách hành vi' },
  { key: 'skill_analysis', name: 'Phân tích kỹ năng hiện có' },
  { key: 'interest_analysis', name: 'Phân tích sở thích và đam mê' },
  { key: 'talent_analysis', name: 'Phân tích tố chất và năng lực' },
  { key: 'academic_analysis', name: 'Phân tích học lực và điểm số' },
  { key: 'family_factor', name: 'Phân tích yếu tố gia đình' },
  { key: 'social_factor', name: 'Phân tích yếu tố xã hội' },
  { key: 'school_program', name: 'Phân tích chương trình nhà trường' },
  { key: 'development_plan', name: 'Xây dựng lộ trình phát triển' },
  { key: 'skill_improvement', name: 'Nâng cao kỹ năng' },
  { key: 'courses_learning', name: 'Khóa học và học bổng' },
]

const packages = [
  {
    name: 'Cơ bản',
    color: 'green',
    features: {
      holland_test: true,
      personality_analysis: true,
      skill_analysis: true,
      interest_analysis: true,
      talent_analysis: true,
      academic_analysis: false,
      family_factor: false,
      social_factor: false,
      school_program: false,
      development_plan: false,
      skill_improvement: false,
      courses_learning: false,
    },
  },
  {
    name: 'Nâng cao',
    color: 'green',
    features: {
      holland_test: true,
      personality_analysis: true,
      skill_analysis: true,
      interest_analysis: true,
      talent_analysis: true,
      academic_analysis: true,
      family_factor: true,
      social_factor: true,
      school_program: true,
      development_plan: true,
      skill_improvement: true,
      courses_learning: true,
    },
  },
]
</script>

<template>
  <div class="container mx-auto max-w-6xl">
    <!-- Header -->
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold text-gray-800 mb-4">Các gói sản phẩm</h2>
    </div>

    <!-- Pricing Table -->
    <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
      <!-- Table Header -->
      <div class="grid grid-cols-3 bg-#F2FFF9">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-600">Tính năng</h3>
        </div>
        <div class="text-center border-l border-gray-200">
          <h3 class="text-xl font-bold text-green-600">Cơ bản</h3>
        </div>
        <div class="text-center border-l border-gray-200">
          <h3 class="text-xl font-bold text-green-600">Nâng cao</h3>
        </div>
      </div>

      <!-- Table Body -->
      <div class="divide-y divide-gray-200">
        <div
          v-for="(feature, index) in features"
          :key="feature.key"
          class="grid grid-cols-3 hover:bg-gray-50 transition-colors duration-200"
          :class="{ 'bg-gray-25': index % 2 === 0 }"
        >
          <!-- Feature Name -->
          <div class="p-4 flex items-center">
            <span class="text-gray-700 font-medium">{{ feature.name }}</span>
          </div>

          <!-- Basic Package -->
          <div class="p-4 flex items-center justify-center border-l border-gray-200">
            <div class="flex items-center justify-center w-8 h-8">
              <svg
                v-if="packages[0].features[feature.key]"
                class="w-6 h-6 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg v-else class="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- Advanced Package -->
          <div class="p-4 flex items-center justify-center border-l border-gray-200">
            <div class="flex items-center justify-center w-8 h-8">
              <svg
                v-if="packages[1].features[feature.key]"
                class="w-6 h-6 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg v-else class="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-gray-25 {
  background-color: #fafafa;
}
</style>
