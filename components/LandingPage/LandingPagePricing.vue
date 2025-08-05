<script setup lang="ts">
const { t } = useI18n()

const pricingPlans = [
  {
    name: 'Basic',
    subtitle: 'Khởi đầu vững chắc',
    price: '95 Tr',
    currency: 'VNĐ/năm',
    period: 'Bao gồm mọi tính năng cơ bản',
    color: 'green',
    features: {
      chatbot: [
        { text: 'Tích hợp với các website, fanpage và các kênh tuyển sinh khác', available: true },
        { text: 'Có thể tùy chỉnh theo yêu cầu riêng của từng trung tâm, trường học', available: true },
        { text: 'Nhận được đến hàng trăm câu hỏi và trả lời ngay tức thì', available: true },
        {
          text: 'Hỗ trợ đăng ký thông tin của học sinh, học viên đăng ký học tại trung tâm, trường học',
          available: true,
        },
      ],
      crm: [
        { text: 'Tạo lead - quản lý workflow', available: true },
        { text: 'Phân quyền theo vai trò nhân viên', available: true },
        { text: 'Quản lý quy trình tuyển sinh chuyên nghiệp', available: true },
        { text: 'Cung cấp báo cáo chi tiết về tình hình tuyển sinh theo thời gian', available: true },
        { text: 'Tự động đồng bộ thông tin học viên chatbot', available: true },
        { text: 'Đăng ký nhận thông báo thông qua các kênh', available: true },
      ],
      smartapply: [{ text: 'Tạo, cập nhật hồ sơ của học sinh theo dõi tiến độ hồ sơ trực tuyến', available: false }],
      advanced: [
        { text: 'Đối tác, API của bên thứ 3 - Tích hợp hệ thống học vụ', available: false },
        { text: 'Kết nối với các hệ thống học vụ của trường học, giúp đồng bộ dữ liệu học sinh', available: false },
        { text: 'Webhook - Kết nối API với hệ thống', available: false },
        { text: 'Tạo webhook của các API trong quá trình chatbot hoạt động', available: false },
        { text: 'Cài đặt webhook', available: false },
      ],
    },
    limitations: {
      applications: '-',
      setupFee: '-',
      supportFee: '35 Triệu',
    },
  },
  {
    name: 'Eco',
    subtitle: 'Giải pháp toàn diện',
    price: '120 Tr',
    currency: 'VNĐ/năm',
    period: 'Bao gồm mọi tính năng nâng cao',
    color: 'blue',
    popular: true,
    features: {
      chatbot: [
        { text: 'Tích hợp với các website, fanpage và các kênh tuyển sinh khác', available: true },
        { text: 'Có thể tùy chỉnh theo yêu cầu riêng của từng trung tâm, trường học', available: true },
        { text: 'Nhận được đến hàng trăm câu hỏi và trả lời ngay tức thì', available: true },
        {
          text: 'Hỗ trợ đăng ký thông tin của học sinh, học viên đăng ký học tại trung tâm, trường học',
          available: true,
        },
      ],
      crm: [
        { text: 'Tạo lead - quản lý workflow', available: true },
        { text: 'Phân quyền theo vai trò nhân viên', available: true },
        { text: 'Quản lý quy trình tuyển sinh chuyên nghiệp', available: true },
        { text: 'Cung cấp báo cáo chi tiết về tình hình tuyển sinh theo thời gian', available: true },
        { text: 'Tự động đồng bộ thông tin học viên chatbot', available: true },
        { text: 'Đăng ký nhận thông báo thông qua các kênh', available: true },
      ],
      smartapply: [{ text: 'Tạo, cập nhật hồ sơ của học sinh theo dõi tiến độ hồ sơ trực tuyến', available: true }],
      advanced: [
        { text: 'Đối tác, API của bên thứ 3 - Tích hợp hệ thống học vụ', available: true },
        { text: 'Kết nối với các hệ thống học vụ của trường học, giúp đồng bộ dữ liệu học sinh', available: true },
        { text: 'Webhook - Kết nối API với hệ thống', available: true },
        { text: 'Tạo webhook của các API trong quá trình chatbot hoạt động', available: true },
        { text: 'Cài đặt webhook', available: true },
      ],
    },
    limitations: {
      applications: '300',
      setupFee: '325.000 VNĐ',
      supportFee: '50 Triệu',
    },
  },
  {
    name: 'Pro',
    subtitle: 'Tối ưu toàn phần',
    price: '150 Tr',
    currency: 'VNĐ/năm',
    period: 'Bao gồm mọi tính năng cao cấp',
    color: 'purple',
    features: {
      chatbot: [
        { text: 'Tích hợp với các website, fanpage và các kênh tuyển sinh khác', available: true },
        { text: 'Có thể tùy chỉnh theo yêu cầu riêng của từng trung tâm, trường học', available: true },
        { text: 'Nhận được đến hàng trăm câu hỏi và trả lời ngay tức thì', available: true },
        {
          text: 'Hỗ trợ đăng ký thông tin của học sinh, học viên đăng ký học tại trung tâm, trường học',
          available: true,
        },
      ],
      crm: [
        { text: 'Tạo lead - quản lý workflow', available: true },
        { text: 'Phân quyền theo vai trò nhân viên', available: true },
        { text: 'Quản lý quy trình tuyển sinh chuyên nghiệp', available: true },
        { text: 'Cung cấp báo cáo chi tiết về tình hình tuyển sinh theo thời gian', available: true },
        { text: 'Tự động đồng bộ thông tin học viên chatbot', available: true },
        { text: 'Đăng ký nhận thông báo thông qua các kênh', available: true },
      ],
      smartapply: [{ text: 'Tạo, cập nhật hồ sơ của học sinh theo dõi tiến độ hồ sơ trực tuyến', available: true }],
      advanced: [
        { text: 'Đối tác, API của bên thứ 3 - Tích hợp hệ thống học vụ', available: true },
        { text: 'Kết nối với các hệ thống học vụ của trường học, giúp đồng bộ dữ liệu học sinh', available: true },
        { text: 'Webhook - Kết nối API với hệ thống', available: true },
        { text: 'Tạo webhook của các API trong quá trình chatbot hoạt động', available: true },
        { text: 'Cài đặt webhook', available: true },
      ],
    },
    limitations: {
      applications: '1,000',
      setupFee: '313.000 VNĐ',
      supportFee: '75 Triệu',
    },
  },
]
</script>

<template>
  <section class="py-10 px-4 lg:py-20 bg-gray-50">
    <div class="container mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-heading mb-4">GIẢI PHÁP TUYỂN SINH ĐA KÊNH</h2>
        <p class="text-paragraph">Lựa chọn gói phù hợp - Tăng hiệu quả tuyển sinh - Tối ưu hóa quy trình</p>
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
              <h4 class="font-semibold text-sm text-blue-600 mb-3 border-b pb-1"> Chatbot thông minh - Tư vấn 24/7 </h4>
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
                CRM - Quản lý tuyển sinh chuyên nghiệp
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
                SmartApply - Tối ưu hồ sơ & quy trình nhập học
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
            <h4 class="font-semibold text-sm mb-3">Giới hạn gói:</h4>
            <div class="space-y-1 text-xs text-gray-600">
              <p><strong>Số lượng hồ sơ miễn phí:</strong> {{ plan.limitations.applications }}</p>
              <p><strong>Phí mỗi hồ sơ nếu vượt quá số lượng:</strong> {{ plan.limitations.setupFee }}</p>
              <p><strong>Phí duy trì hằng năm:</strong> {{ plan.limitations.supportFee }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Note Section -->
      <div class="mt-12 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
        <h4 class="font-bold mb-3 text-yellow-800">Ghi chú quan trọng:</h4>
        <ul class="space-y-2 text-sm text-yellow-700">
          <li
            >• <strong>Basic Pro:</strong> Phù hợp với các trung tâm học tập và trường học có quy mô nhỏ, cần giải pháp
            cơ bản để tự động hóa quy trình tuyển sinh.</li
          >
          <li
            >• <strong>Eco (Khuyến nghị):</strong> Dành cho các trung tâm có quy mô vừa, cần quản lý tuyển sinh hiệu
            quả. Tích hợp với hệ thống học vụ hiện có. Tự động hóa quy trình từ tư vấn đến nhập học.</li
          >
          <li
            >• <strong>Pro (Gói cao cấp):</strong> Dành cho các trường học lớn và các tập đoàn giáo dục. Tích hợp toàn
            diện với hệ thống hiện có. Hỗ trợ đa kênh và tự động hóa hoàn toàn quy trình tuyển sinh từ A-Z với báo cáo
            chi tiết.</li
          >
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
