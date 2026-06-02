import apiClient from '../../services/apiClient'
import type { Item, ItemCreate, ItemUpdate } from '../../types'

export async function getItems(): Promise<Item[]> {
  const { data } = await apiClient.get<Item[]>('/api/v1/items/')
  return data
}

export async function createItem(payload: ItemCreate): Promise<Item> {
  const { data } = await apiClient.post<Item>('/api/v1/items/', payload)
  return data
}

export async function updateItem(id: number, payload: ItemUpdate): Promise<Item> {
  const { data } = await apiClient.put<Item>(`/api/v1/items/${id}`, payload)
  return data
}

export async function deleteItem(id: number): Promise<void> {
  await apiClient.delete(`/api/v1/items/${id}`)
}
