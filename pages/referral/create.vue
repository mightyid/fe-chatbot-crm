<script setup lang="ts">
import FormInvite from '~/components/referral/FormInvite.vue'
definePageMeta({
  //   permission: 'create_leadCRM',
})
const router = useRouter()
const toast = useToast()
const { $api } = useNuxtApp()
const links = ref([
  {
    title: 'Referral Invitation',
    to: '/referral/invitation',
  },
  {
    title: 'Create',
    to: `/referral/create`,
  },
])

const inviteReferral = async (form: any) => {
  const { statusCode }: any = await $api('referral-invitation/invite', {
    method: 'POST',
    body: {
      listData: form,
    },
  })

  if (statusCode === 200) {
    router.push('/referral/invitation')
    toast.add({ severity: 'success', summary: 'Successfully', detail: 'Created', life: 3000 })
  }
}
</script>

<template>
  <div class="page">
    <div class="page-content">
      <BreadCrumbLinks :links="links" />

      <div class="box">
        <div class="mb-4 flex items-center justify-between gap-[16px]">
          <h1 class="flex-1 m-0 page-heading"> Referral Invitation </h1>
        </div>

        <FormInvite @onSubmit="inviteReferral" @onCancel="router.push('/referral/invitation')" />
      </div>
    </div>
  </div>
</template>
