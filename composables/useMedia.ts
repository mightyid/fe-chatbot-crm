import type { MediaType, ResponseType } from '~/types'

export default function useMedia() {
  const { $api } = useNuxtApp()
  const config = useRuntimeConfig()
  //@ts-ignore
  const token = useAppStore().token || undefined

  const PARENT_URL = '/media'

  const getUrlMediaByKey = (key: string) => {
    return config.public.apiBase + `${PARENT_URL}/public-access?key=${key}&token=${token}`
  }

  const getMediaByKey = (key: string) => {
    return $api<Blob>(`${PARENT_URL}/public-access?key=${key}`, {
      method: 'GET',
    })
  }

  const uploadMedia = (formData: FormData) => {
    return $api<MediaType>(`${PARENT_URL}/upload`, {
      method: 'POST',
      body: formData,
    })
  }

  const uploadMutipleMedia = (formData: FormData) => {
    return $api<MediaType>(`${PARENT_URL}/uploads`, {
      method: 'POST',
      body: formData,
    })
  }

  const deleteMediaById = (id: string) => {
    return $api(`${PARENT_URL}/cancel-upload?media_id=${id}`, {
      method: 'DELETE',
    })
  }

  const initiateLargeFileUpload = (body: { originalname: string; size: number; mimetype: string }) => {
    return $api<any>(`${PARENT_URL}/initiate`, {
      method: 'POST',
      body: body,
    })
  }

  const chunkFileUpload = (formData: FormData) => {
    return $api<any>(`${PARENT_URL}/chunk`, {
      method: 'POST',
      body: formData,
    })
  }

  const completeLargeFileUpload = (body: { media_id: string; part_number: number; upload_id: string }) => {
    return $api<any>(`${PARENT_URL}/complete`, {
      method: 'POST',
      body: body,
    })
  }

  return {
    getUrlMediaByKey,
    getMediaByKey,
    uploadMedia,
    uploadMutipleMedia,
    deleteMediaById,
    initiateLargeFileUpload,
    chunkFileUpload,
    completeLargeFileUpload,
  }
}
