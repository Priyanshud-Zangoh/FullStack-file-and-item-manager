export interface User {
  id: number
  email: string
  username: string
  is_active: boolean
  is_superuser: boolean
  created_at: string
}

export interface Item {
  id: number
  title: string
  description: string | null
  is_active: boolean
  owner_id: number
  created_at: string
  updated_at: string | null
}

export interface FileRecord {
  id: number
  filename: string
  object_key: string
  content_type: string | null
  file_size: number | null
  bucket: string
  owner_id: number
  created_at: string
  download_url: string | null
}

export interface Token {
  access_token: string
  token_type: string
}

export interface LoginPayload {
  username: string // email used as username
  password: string
}

export interface RegisterPayload {
  email: string
  username: string
  password: string
}

export interface ItemCreate {
  title: string
  description?: string
}

export interface ItemUpdate {
  title?: string
  description?: string
  is_active?: boolean
}
