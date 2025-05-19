export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive('can', {
    mounted(el, binding) {
      const { user } = useAuth()

      const userPermissions = user.value?.role?.permissions ?? []

      if (user.value?.is_admin) return

      if (binding.value === false) {
        el.remove()
        return
      }

      if (
        (typeof binding.value === 'string' && binding.value) ||
        (typeof binding.value === 'number' && !isNaN(binding.value))
      ) {
        if (!userPermissions?.includes(binding.value)) {
          el.remove()
        }
      }
    },
  })
})
