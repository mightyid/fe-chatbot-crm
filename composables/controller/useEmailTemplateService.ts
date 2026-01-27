import type { EmailTemplateType, EmailTemplateCreateBody, EmailTemplateUpdateBody } from '~/types/email-campaign'
import type { ResponseType, listResponseTypeAll, ParamsGetListType } from '~/types'

export default function useEmailTemplateService() {
  const { $api } = useNuxtApp()
  const URL = 'email-campaign-template'

  async function getTemplates(params: ParamsGetListType) {
    return $api<listResponseTypeAll>(URL, {
      method: 'GET',
      params,
    })
  }

  async function getTemplateDetail(template_id: string) {
    return $api<ResponseType<EmailTemplateType>>(`${URL}/detail`, {
      method: 'GET',
      params: { template_id },
    })
  }

  async function createTemplate(body: EmailTemplateCreateBody) {
    return $api<ResponseType<EmailTemplateType>>(`${URL}/create`, {
      method: 'POST',
      body,
    })
  }

  async function updateTemplate(body: EmailTemplateUpdateBody) {
    return $api<ResponseType>(`${URL}/update`, {
      method: 'PUT',
      body,
    })
  }

  async function deleteTemplate(template_id: string) {
    return $api<ResponseType>(`${URL}/delete`, {
      method: 'DELETE',
      params: { template_id },
    })
  }

  return {
    getTemplates,
    getTemplateDetail,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  }
}
