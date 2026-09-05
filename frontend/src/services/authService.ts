import { api } from './api'

export interface LoginResponse {
  accessToken: string
  user?: { name: string; role: string }
}

export async function loginWithApi(email: string, password: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', { email, password })
  return response.data
}
