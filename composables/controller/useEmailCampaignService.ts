import type {
  EmailCampaignType,
  EmailCampaignDetailType,
  EmailCampaignParamsGetList,
  EmailCampaignCreateBody,
  EmailCampaignUpdateBody,
  EmailCampaignEmailType,
  EmailCampaignEmailParamsGetList,
} from '~/types/email-campaign'
import type { ResponseType, listResponseTypeAll } from '~/types'

export default function useEmailCampaignService() {
  const { $api } = useNuxtApp()
  const URL = 'email-campaign'

  async function getCampaigns(params: EmailCampaignParamsGetList) {
    return $api<listResponseTypeAll>(URL, {
      method: 'GET',
      params,
    })
  }

  async function getCampaignDetail(campaign_id: string) {
    return $api<ResponseType<EmailCampaignDetailType>>(`${URL}/detail`, {
      method: 'GET',
      params: { campaign_id },
    })
  }

  async function createCampaign(body: EmailCampaignCreateBody) {
    return $api<ResponseType<EmailCampaignType>>(`${URL}/create`, {
      method: 'POST',
      body,
    })
  }

  async function startCampaign(campaign_id: string) {
    return $api<ResponseType>(`${URL}/start`, {
      method: 'POST',
      body: { campaign_id },
    })
  }

  async function updateCampaign(body: EmailCampaignUpdateBody) {
    return $api<ResponseType>(`${URL}/update`, {
      method: 'PUT',
      body,
    })
  }

  async function deleteCampaign(campaign_id: string) {
    return $api<ResponseType>(`${URL}/delete`, {
      method: 'DELETE',
      params: { campaign_id },
    })
  }

  // Email management within campaign
  async function getCampaignEmails(params: EmailCampaignEmailParamsGetList) {
    return $api<listResponseTypeAll>(`${URL}/email`, {
      method: 'GET',
      params,
    })
  }

  async function addEmailToCampaign(body: { campaign_id: string; email: string }) {
    return $api<ResponseType>(`${URL}/email`, {
      method: 'POST',
      body,
    })
  }

  async function deleteEmailFromCampaign(campaign_id: string, email_id: string) {
    return $api<ResponseType>(`${URL}/email`, {
      method: 'DELETE',
      params: { campaign_id, email_id },
    })
  }

  return {
    getCampaigns,
    getCampaignDetail,
    createCampaign,
    startCampaign,
    updateCampaign,
    deleteCampaign,
    getCampaignEmails,
    addEmailToCampaign,
    deleteEmailFromCampaign,
  }
}
