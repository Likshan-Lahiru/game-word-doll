import { apiRequest } from './api'
export interface SignupRequest {
    email: string
    password: string
    role: string
    goldCoins?: number
    userName?: string
    country?: string
}
export interface AuthResponse {
    token: string
    message: string | null
    role: string | null
    userId: string
}
export const signup = async (
    userData: SignupRequest,
): Promise<AuthResponse> => {
    console.log("Signup request payload:", userData)
    return apiRequest('/auth', 'POST', userData)
}

export const login = async (
    email: string,
    password: string,
): Promise<AuthResponse> => {
    return apiRequest('/auth/signIn', 'POST', { email, password })
}
// Store token in localStorage
export const storeAuthToken = (token: string): void => {
    localStorage.setItem('authToken', token)
}
// Get token from localStorage
export const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken')
}
// Remove token from localStorage
export const removeAuthToken = (): void => {
    localStorage.removeItem('authToken')
}
// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return !!getAuthToken()
}
