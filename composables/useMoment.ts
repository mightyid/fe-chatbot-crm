// import moment from 'moment'

export default function useMoment(date: string | Date, format: string | undefined = 'YYYY-MM-DD HH:mm') {
  const { $dayjs } = useNuxtApp()
  if (date) return $dayjs(date).format(format)
  return ''
}
