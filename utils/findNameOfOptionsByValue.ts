export default function findNameOfOptionsByValue(value: string | number, options: any[], isTranslate = false): string {
  const { $i18n } = useNuxtApp()
  const t = $i18n.t
  const te = $i18n.te

  if (value !== undefined && value !== null) {
    const name = options?.find((item: any) => item?.value === value)?.name
    if (name) {
      return isTranslate ? (te(name) ? t(name) : name) : name
    }
  }

  return ''
}
