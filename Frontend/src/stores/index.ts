import { create } from 'zustand'
import type { User } from '../types'
import { getMe } from '../features/auth/api'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('access_token'),
  isLoading: localStorage.getItem('access_token') ? true : false,

  fetchUser: async () => {
    const token = localStorage.getItem('access_token')
    
    // Only fetch if token exists
    if (!token) {
      set({ user: null, token: null, isLoading: false })
      return
    }

    try {
      const user = await getMe()
      set({ user, isLoading: false })
    } catch {
      localStorage.removeItem('access_token')
      set({ user: null, token: null, isLoading: false })
    }
  },

  login: async (token: string) => {
    localStorage.setItem('access_token', token)
    set({ token })
    const user = await getMe()
    set({ user, isLoading: false })
  },

  logout: () => {
    localStorage.removeItem('access_token')
    set({ token: null, user: null, isLoading: false })
  }
}))
