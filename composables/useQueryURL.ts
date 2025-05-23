export default function useQueryURL(query: object) {
  const router = useRouter()

  const cloneQuery = { ...query } as any
  const newQuery = {} as any

  for (let key in cloneQuery) {
    if (cloneQuery[key]) {
      newQuery[key] = cloneQuery[key]

      if (key === 'page' && Number(cloneQuery[key]) < 2) {
        delete newQuery[key]
      }
    }
  }

  router.push({ query: { ...newQuery } })
}
