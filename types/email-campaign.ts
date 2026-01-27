import type { ParamsGetListType } from '~/types'

export type CampaignStatus = 'pending' | 'sending' | 'completed' | 'failed'

export interface EmailCampaignType {
  _id: string
  company: string
  name: string
  total: number
  success: number
  failed: number
  open: number
  click: number
  pending: number
  unsubscribe: number
  status: CampaignStatus
  created_at: string
}

export interface EmailCampaignDetailType extends EmailCampaignType {
  subject?: string
  template?: string
}

export interface EmailCampaignParamsGetList extends ParamsGetListType {}

export interface EmailCampaignCreateBody {
  name: string
  emails: string[]
  subject?: string
  template?: string
}

export interface EmailCampaignUpdateBody {
  campaign_id: string
  name?: string
  subject: string
  template: string
}

export type EmailActionType = 'all' | 'sent' | 'delivered' | 'open' | 'click' | 'bounced' | 'unsubscribed'

export interface EmailCampaignEmailType {
  _id: string
  campaign: string
  email: string
  actions: any[]
  open: number
  click: number
  replied: boolean
  spam: boolean
  unsubscribed: boolean
  created_at: string
}

export interface EmailCampaignEmailParamsGetList extends ParamsGetListType {
  campaign_id: string
  type: EmailActionType
}

export interface EmailTemplateType {
  _id: string
  company: string
  name: string
  template: string // HTML
  design: any // JSON/Block design
  created_at: string
}

export interface EmailTemplateCreateBody {
  name: string
  template: string
  design: any
}

export interface EmailTemplateUpdateBody {
  template_id: string
  name?: string
  template?: string
  design?: any
}
