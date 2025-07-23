<script lang="ts" setup>
const form = defineModel('form', { default: {} }) as any
</script>

<template>
  <div class="fc">
    <div class="font-bold">
      Đánh dấu vào ô vuông trước mỗi câu mà bạn thấy phù hợp với mình. Đừng suy nghĩ quá nhiều khi lựa chọn câu trả lời
      mà phải lựa chọn theo đúng suy nghĩ bản thân.
    </div>
    <div class="fc gap-4 mt-4">
      <div class="fc gap-2 mb-4">
        <div class="font-semibold">Nhóm Kĩ thuật</div>
        <BaseCheckbox
          v-model="form['Nhóm Kĩ thuật']['Tôi tự thấy mình là người khá thể thao']"
          label="Tôi tự thấy mình là người khá thể thao"
          name="Tôi tự thấy mình là người khá thể thao"
        />
        <BaseCheckbox
          v-model="form['Nhóm Kĩ thuật']['Tôi là người yêu thích thiên nhiên']"
          label="Tôi là người yêu thích thiên nhiên"
          name="Tôi là người yêu thích thiên nhiên"
        />
        <BaseCheckbox
          v-model="
            form['Nhóm Kĩ thuật'][
              'Tôi người hay tò mò về thế giới xung quanh mình (thiên nhiên, không gian, những sinh vật sống)'
            ]
          "
          label="Tôi người hay tò mò về thế giới xung quanh mình (thiên nhiên, không gian, những sinh vật sống)"
          name="Tôi người hay tò mò về thế giới xung quanh mình (thiên nhiên, không gian, những sinh vật sống)"
        />
        <BaseCheckbox
          v-model="form['Nhóm Kĩ thuật']['Tôi là người độc lập']"
          label="Tôi là người độc lập"
          name="Tôi là người độc lập"
        />
        <BaseCheckbox
          v-model="form['Nhóm Kĩ thuật']['Tôi thích sửa chữa đồ vật, vật dụng xung quanh tôi']"
          label="Tôi thích sửa chữa đồ vật, vật dụng xung quanh tôi"
          name="Tôi thích sửa chữa đồ vật, vật dụng xung quanh tôi"
        />
        <BaseCheckbox
          v-model="form['Nhóm Kĩ thuật']['Tôi thích làm việc có sử dụng tay chân (làm vườn, sửa chữa nhà cửa)']"
          label="Tôi thích làm việc có sử dụng tay chân (làm vườn, sửa chữa nhà cửa)"
          name="Tôi thích làm việc có sử dụng tay chân (làm vườn, sửa chữa nhà cửa)"
        />
        <BaseCheckbox
          v-model="form['Nhóm Kĩ thuật']['Tôi thích tập thể dục']"
          label="Tôi thích tập thể dục"
          name="Tôi thích tập thể dục"
        />
        <BaseCheckbox
          v-model="form['Nhóm Kĩ thuật']['Tôi thích dành dụm tiền']"
          label="Tôi thích dành dụm tiền"
          name="Tôi thích dành dụm tiền"
        />
        <BaseCheckbox
          v-model="
            form['Nhóm Kĩ thuật']['Tôi thích làm việc cho đến khi công việc hoàn thành (không thích bỏ dở việc)']
          "
          label="Tôi thích làm việc cho đến khi công việc hoàn thành (không thích bỏ dở việc)"
          name="Tôi thích làm việc cho đến khi công việc hoàn thành (không thích bỏ dở việc)"
        />
        <BaseCheckbox
          v-model="form['Nhóm Kĩ thuật']['Tôi thích làm việc một mình']"
          label="Tôi thích làm việc một mình"
          name="Tôi thích làm việc một mình"
        />
      </div>
      <div class="fc gap-2 mb-4">
        <div class="font-semibold">Nhóm nghiên cứu</div>

        <BaseCheckbox
          v-model="form['Nhóm Nghiên cứu']['Tôi là người rất hay để ý tới chi tiết và cẩn thận']"
          label="Tôi là người rất hay để ý tới chi tiết và cẩn thận"
          name="Tôi là người rất hay để ý tới chi tiết và cẩn thận"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghiên cứu']['Tôi tò mò về mọi thứ']"
          label="Tôi tò mò về mọi thứ"
          name="Tôi tò mò về mọi thứ"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghiên cứu']['Tôi có thể tính những bài toán phức tạp']"
          label="Tôi có thể tính những bài toán phức tạp"
          name="Tôi có thể tính những bài toán phức tạp"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghiên cứu']['Tôi thích giải các bài tập toán']"
          label="Tôi thích giải các bài tập toán"
          name="Tôi thích giải các bài tập toán"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghiên cứu']['Tôi thích sử dụng máy tính']"
          label="Tôi thích sử dụng máy tính"
          name="Tôi thích sử dụng máy tính"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghiên cứu']['Tôi rất thích đọc sách']"
          label="Tôi rất thích đọc sách"
          name="Tôi rất thích đọc sách"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghiên cứu']['Tôi thích sưu tập (đá, tem, tiền đồng)']"
          label="Tôi thích sưu tập (đá, tem, tiền đồng)"
          name="Tôi thích sưu tập (đá, tem, tiền đồng)"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghiên cứu']['Tôi thích trò chơi ô chữ']"
          label="Tôi thích trò chơi ô chữ"
          name="Tôi thích trò chơi ô chữ"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghiên cứu']['Tôi thích học các môn khoa học']"
          label="Tôi thích học các môn khoa học"
          name="Tôi thích học các môn khoa học"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghiên cứu']['Tôi thích những thách thức']"
          label="Tôi thích những thách thức"
          name="Tôi thích những thách thức"
        />
      </div>
      <div class="fc gap-2 mb-4">
        <div class="font-semibold">Nhóm Nghệ thuật</div>
        <BaseCheckbox
          v-model="form['Nhóm Nghệ thuật']['Tôi rất sáng tạo']"
          label="Tôi rất sáng tạo"
          name="Tôi rất sáng tạo"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghệ thuật']['Tôi thích vẽ, tô màu và sơn']"
          label="Tôi thích vẽ, tô màu và sơn"
          name="Tôi thích vẽ, tô màu và sơn"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghệ thuật']['Tôi có thể chơi một nhạc cụ']"
          label="Tôi có thể chơi một nhạc cụ"
          name="Tôi có thể chơi một nhạc cụ"
        />
        <BaseCheckbox
          v-model="
            form['Nhóm Nghệ thuật']['Tôi thích tự thiết kế quần áo cho mình hoặc mặc những thời trang lạ và thú vị']
          "
          label="Tôi thích tự thiết kế quần áo cho mình hoặc mặc những thời trang lạ và thú vị"
          name="Tôi thích tự thiết kế quần áo cho mình hoặc mặc những thời trang lạ và thú vị"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghệ thuật']['Tôi thích đọc truyện viễn tưởng, kịch và thơ ca']"
          label="Tôi thích đọc truyện viễn tưởng, kịch và thơ ca"
          name="Tôi thích đọc truyện viễn tưởng, kịch và thơ ca"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghệ thuật']['Tôi thích mĩ thuật và thủ công']"
          label="Tôi thích mĩ thuật và thủ công"
          name="Tôi thích mĩ thuật và thủ công"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghệ thuật']['Tôi xem rất nhiều phim']"
          label="Tôi xem rất nhiều phim"
          name="Tôi xem rất nhiều phim"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghệ thuật']['Tôi thích chụp hình mọi thứ (chim, người, cảnh đẹp)']"
          label="Tôi thích chụp hình mọi thứ (chim, người, cảnh đẹp)"
          name="Tôi thích chụp hình mọi thứ (chim, người, cảnh đẹp)"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghệ thuật']['Tôi thích học một ngoại ngữ']"
          label="Tôi thích học một ngoại ngữ"
          name="Tôi thích học một ngoại ngữ"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghệ thuật']['Tôi thích hát, đóng kịch và khiêu vũ']"
          label="Tôi thích hát, đóng kịch và khiêu vũ"
          name="Tôi thích hát, đóng kịch và khiêu vũ"
        />
      </div>

      <div class="fc gap-2 mb-4">
        <div class="font-semibold">Nhóm Xã hội</div>

        <BaseCheckbox
          v-model="form['Nhóm Xã hội']['Tôi rất thân thiện']"
          label="Tôi rất thân thiện"
          name="Tôi rất thân thiện"
        />
        <BaseCheckbox
          v-model="form['Nhóm Xã hội']['Tôi thích chỉ dẫn hoặc dạy người khác']"
          label="Tôi thích chỉ dẫn hoặc dạy người khác"
          name="Tôi thích chỉ dẫn hoặc dạy người khác"
        />
        <BaseCheckbox
          v-model="form['Nhóm Xã hội']['Tôi thích nói chuyện trước đám đông']"
          label="Tôi thích nói chuyện trước đám đông"
          name="Tôi thích nói chuyện trước đám đông"
        />
        <BaseCheckbox
          v-model="form['Nhóm Xã hội']['Tôi làm việc rất tốt trong nhóm']"
          label="Tôi làm việc rất tốt trong nhóm"
          name="Tôi làm việc rất tốt trong nhóm"
        />
        <BaseCheckbox
          v-model="form['Nhóm Xã hội']['Tôi thích điều hành các cuộc thảo luận']"
          label="Tôi thích điều hành các cuộc thảo luận"
          name="Tôi thích điều hành các cuộc thảo luận"
        />
        <BaseCheckbox
          v-model="form['Nhóm Xã hội']['Tôi thích giúp đỡ những người gặp khó khăn']"
          label="Tôi thích giúp đỡ những người gặp khó khăn"
          name="Tôi thích giúp đỡ những người gặp khó khăn"
        />
        <BaseCheckbox
          v-model="form['Nhóm Xã hội']['Tôi chơi các môn thể thao có tính đồng đội']"
          label="Tôi chơi các môn thể thao có tính đồng đội"
          name="Tôi chơi các môn thể thao có tính đồng đội"
        />
        <BaseCheckbox
          v-model="form['Nhóm Xã hội']['Tôi thích đi dự tiệc']"
          label="Tôi thích đi dự tiệc"
          name="Tôi thích đi dự tiệc"
        />
        <BaseCheckbox
          v-model="form['Nhóm Xã hội']['Tôi thích làm quen với bạn mới']"
          label="Tôi thích làm quen với bạn mới"
          name="Tôi thích làm quen với bạn mới"
        />
        <BaseCheckbox
          v-model="
            form['Nhóm Xã hội'][
              'Tôi thích làm việc với các nhóm hoạt động xã hội tại trường học, nhà thờ, chùa, phường, xóm, hay cộng đồng'
            ]
          "
          label="Tôi thích làm việc với các nhóm hoạt động xã hội tại trường học, nhà thờ, chùa, phường, xóm, hay cộng đồng"
          name="Tôi thích làm việc với các nhóm hoạt động xã hội tại trường học, nhà thờ, chùa, phường, xóm, hay cộng đồng"
        />
      </div>
      <div class="fc gap-2 mb-4">
        <div class="font-semibold">Nhóm Quản lí</div>

        <BaseCheckbox
          v-model="form['Nhóm Quản lí']['Tôi thích học hỏi về tài chính (tiền bạc)']"
          label="Tôi thích học hỏi về tài chính (tiền bạc)"
          name="Tôi thích học hỏi về tài chính (tiền bạc)"
        />
        <BaseCheckbox
          v-model="form['Nhóm Quản lí']['Tôi thích bán các sản phẩm (kẹo, bút viết v.v...)']"
          label="Tôi thích bán các sản phẩm (kẹo, bút viết v.v...)"
          name="Tôi thích bán các sản phẩm (kẹo, bút viết v.v...)"
        />
        <BaseCheckbox
          v-model="form['Nhóm Quản lí']['Tôi nghĩ mình thuộc dạng nổi tiếng ở trường']"
          label="Tôi nghĩ mình thuộc dạng nổi tiếng ở trường"
          name="Tôi nghĩ mình thuộc dạng nổi tiếng ở trường"
        />
        <BaseCheckbox
          v-model="form['Nhóm Quản lí']['Tôi thích lãnh đạo nhóm và các cuộc thảo luận']"
          label="Tôi thích lãnh đạo nhóm và các cuộc thảo luận"
          name="Tôi thích lãnh đạo nhóm và các cuộc thảo luận"
        />
        <BaseCheckbox
          v-model="
            form['Nhóm Quản lí'][
              'Tôi thích được bầu vào các vị trí quan trọng trong nhóm hoặc câu lạc bộ trong và ngoài nhà trường'
            ]
          "
          label="Tôi thích được bầu vào các vị trí quan trọng trong nhóm hoặc câu lạc bộ trong và ngoài nhà trường"
          name="Tôi thích được bầu vào các vị trí quan trọng trong nhóm hoặc câu lạc bộ trong và ngoài nhà trường"
        />
        <BaseCheckbox
          v-model="form['Nhóm Quản lí']['Tôi thích có quyền và thích ở vị trí lãnh đạo']"
          label="Tôi thích có quyền và thích ở vị trí lãnh đạo"
          name="Tôi thích có quyền và thích ở vị trí lãnh đạo"
        />
        <BaseCheckbox
          v-model="form['Nhóm Quản lí']['Tôi muốn sở hữu một doanh nghiệp nhỏ']"
          label="Tôi muốn sở hữu một doanh nghiệp nhỏ"
          name="Tôi muốn sở hữu một doanh nghiệp nhỏ"
        />
        <BaseCheckbox
          v-model="form['Nhóm Quản lí']['Tôi thích tiết kiệm tiền']"
          label="Tôi thích tiết kiệm tiền"
          name="Tôi thích tiết kiệm tiền"
        />
        <BaseCheckbox
          v-model="form['Nhóm Quản lí']['Tôi thích làm việc cho tới khi công việc hoàn tất']"
          label="Tôi thích làm việc cho tới khi công việc hoàn tất"
          name="Tôi thích làm việc cho tới khi công việc hoàn tất"
        />
        <BaseCheckbox
          v-model="form['Nhóm Quản lí']['Tôi thích mạo hiểm và tham gia các cuộc phiêu lưu mới']"
          label="Tôi thích mạo hiểm và tham gia các cuộc phiêu lưu mới"
          name="Tôi thích mạo hiểm và tham gia các cuộc phiêu lưu mới"
        />
      </div>
      <div class="fc gap-2 mb-4">
        <div class="font-semibold">Nhóm Nghiệp vụ</div>

        <BaseCheckbox
          v-model="form['Nhóm Nghiệp vụ']['Tôi thích gọn gàng và ngăn nắp']"
          label="Tôi thích gọn gàng và ngăn nắp"
          name="Tôi thích gọn gàng và ngăn nắp"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghiệp vụ']['Tôi thích phòng của tôi thường xuyên gọn gàng và ngăn nắp ']"
          label="Tôi thích phòng của tôi thường xuyên gọn gàng và ngăn nắp "
          name="Tôi thích phòng của tôi thường xuyên gọn gàng và ngăn nắp "
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghiệp vụ']['Tôi thích sưu tầm các bài báo về các sự kiện nổi tiếng']"
          label="Tôi thích sưu tầm các bài báo về các sự kiện nổi tiếng"
          name="Tôi thích sưu tầm các bài báo về các sự kiện nổi tiếng"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghiệp vụ']['Tôi thích lập những danh sách các việc cần làm']"
          label="Tôi thích lập những danh sách các việc cần làm"
          name="Tôi thích lập những danh sách các việc cần làm"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghiệp vụ']['Tôi thích sử dụng máy tính']"
          label="Tôi thích sử dụng máy tính"
          name="Tôi thích sử dụng máy tính 1"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghiệp vụ']['Tôi rất thực tế và cân nhắc mọi chi phí trước khi mua một thứ gì đó']"
          label="Tôi rất thực tế và cân nhắc mọi chi phí trước khi mua một thứ gì đó"
          name="Tôi rất thực tế và cân nhắc mọi chi phí trước khi mua một thứ gì đó"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghiệp vụ']['Tôi thích đánh máy bài tập của trường, lớp hơn là viết tay']"
          label="Tôi thích đánh máy bài tập của trường, lớp hơn là viết tay"
          name="Tôi thích đánh máy bài tập của trường, lớp hơn là viết tay"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghiệp vụ']['Tôi thích đảm nhận công việc thư ký trong một câu lạc bộ hay nhóm']"
          label="Tôi thích đảm nhận công việc thư ký trong một câu lạc bộ hay nhóm"
          name="Tôi thích đảm nhận công việc thư ký trong một câu lạc bộ hay nhóm"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghiệp vụ']['Khi làm toán, tôi hay kiểm tra lại bài làm nhiều lần']"
          label="Khi làm toán, tôi hay kiểm tra lại bài làm nhiều lần"
          name="Khi làm toán, tôi hay kiểm tra lại bài làm nhiều lần"
        />
        <BaseCheckbox
          v-model="form['Nhóm Nghiệp vụ']['Tôi thích viết thư']"
          label="Tôi thích viết thư"
          name="Tôi thích viết thư"
        />
      </div>
    </div>
  </div>
</template>
