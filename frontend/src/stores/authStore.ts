import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState { isAuthenticated: boolean; user: { name: string; role: string } | null; login: (email: string, password: string) => void; logout: () => void }
export const useAuthStore = create<AuthState>()(persist((set) => ({
  isAuthenticated: false, user: null,
  login: (email) => { localStorage.setItem('cold-chain-token', 'mock-jwt-token'); set({ isAuthenticated: true, user: { name: email.split('@')[0] || 'Operations lead', role: 'Operations lead' } }) },
  logout: () => { localStorage.removeItem('cold-chain-token'); set({ isAuthenticated: false, user: null }) },
}), { name: 'cold-chain-auth' }))
