import { create } from 'zustand'

interface User {
  id: number
  firstName?: string
  lastName?: string
  email: string
  permissions: string[]
}

interface AuthStore {
  user: User | null
  accessToken: string | null

  setAuth: (user: User, token: string) => void

  logout: () => void

  can: (permission: string) => boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  accessToken: null,

  setAuth: (user, token) => {
    localStorage.setItem('accessToken', token)

    set({
      user,
      accessToken: token,
    })
  },

  logout: () => {
    localStorage.removeItem('accessToken')

    set({
      user: null,
      accessToken: null,
    })
  },

  can: (permission) => {
    const user = get().user

    if (!user) return false

    return user.permissions.includes(permission)
  },
}))