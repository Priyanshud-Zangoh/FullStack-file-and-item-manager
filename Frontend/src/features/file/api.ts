import apiClient from '../../services/apiClient'
import type { FileRecord } from '../../types'

export async function getFiles(): Promise<FileRecord[]> {
  const { data } = await apiClient.get<FileRecord[]>('/api/v1/files/')
  return data
}

export async function uploadFile(file: File): Promise<FileRecord> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await apiClient.post<FileRecord>('/api/v1/files/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteFile(id: number): Promise<void> {
  await apiClient.delete(`/api/v1/files/${id}`)
}
