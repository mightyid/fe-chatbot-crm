export default function useRedirectBack() {
  const redirectBack = (url: string) => {
    const router = useRouter()

    const previousPage = (router.options.history.state.back as string) || null

    if (previousPage) {
      router.push(previousPage)
    } else {
      router.push(url)
    }
  }

  return redirectBack
}
