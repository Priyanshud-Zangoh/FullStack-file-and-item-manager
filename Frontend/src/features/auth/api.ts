import apiClient from '../../services/apiClient'
import type { Token, User, LoginPayload, RegisterPayload } from '../../types'

export async function login(payload: LoginPayload): Promise<Token> {
  const form = new URLSearchParams()
  form.append('username', payload.username)
  form.append('password', payload.password)
  const { data } = await apiClient.post<Token>('/api/v1/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return data
}

export async function register(payload: RegisterPayload): Promise<User> {
  const { data } = await apiClient.post<User>('/api/v1/auth/register', payload)
  return data
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>('/api/v1/auth/me')
  return data
}
