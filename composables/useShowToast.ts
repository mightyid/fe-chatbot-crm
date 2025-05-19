const ERROR_KEYS = {
  EMAIL_EXIST: 'Email đã tồn tại',
  EMAIL_NOT_FOUND: 'Email không tồn tại',
  PASSWORD_INCORRECT: 'Sai email hoặc mật khẩu',
  OLD_PASSWORD_NOT_MATCH: 'Mật khẩu hiện tại không đúng',
  OTP_NOT_MATCH: 'Mã OTP không hợp lệ',
  ACCOUNT_DEACTIVATED: 'Tài khoản đã dừng hoạt động',
  NOT_PERMISSION_ACCESS: 'Bạn không có quyền truy cập',
} as const

function formatErrorMessage(error: any): { summary: string; detail: string } {
  const status = error?.data?.statusCode || ''
  const key = error?.data?.key as keyof typeof ERROR_KEYS | undefined
  const message = error?.data?.message

  const messageByKey = key && ERROR_KEYS[key] ? ERROR_KEYS[key] : message || 'Đã có lỗi xảy ra'

  return {
    summary: `Error ${status}`,
    detail: messageByKey,
  }
}

export default function useShowToast() {
  const toast = useToast()

  const showToastSuccess = (message: string, duration: number = 3000) => {
    toast.add({ severity: 'success', summary: 'Thành công', detail: message, life: duration })
  }

  const showToastError = (error: any, duration: number = 3000) => {
    const { summary, detail } = formatErrorMessage(error)

    toast.add({
      severity: 'error',
      summary,
      detail,
      life: duration,
    })

    console.error(error)
  }

  return {
    showToastSuccess,
    showToastError,
  }
}
