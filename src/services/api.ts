// Base API configuration
const API_BASE_URL = 'https://service-wordle.beecele.com.au/wordoll/api'
// Common headers
const getHeaders = (requireAuth = true) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }
    // Add authorization token if available and required
    if (requireAuth) {
        const token = localStorage.getItem('authToken')
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }
    }
    return headers
}
// Helper function for making API requests
export const apiRequest = async (
    endpoint: string,
    method: string,
    data?: any,
    requireAuth = true,
) => {
    try {
        const url = `${API_BASE_URL}${endpoint}`
        const options: RequestInit = {
            method,
            headers: getHeaders(requireAuth),
            body: data ? JSON.stringify(data) : undefined,
        }
        const response = await fetch(url, options)
        // Handle different response status codes
        if (response.status === 204) {
            // No content response
            return { success: true }
        }
        // For responses with content, parse the JSON
        let result
        try {
            result = await response.json()
        } catch (e) {
            // If response is not JSON, create a simple result object
            result = {
                success: response.ok,
                statusCode: response.status,
            }
        }
        // if (!response.ok) {
        //     throw new Error(result.message || `Error: ${response.status}`)
        // }
        return result
    } catch (error) {
        console.error('API request error:', error)
        throw error
    }
}
// Check if user can play game (not on cooldown)
export const checkLastWinTime = async (userId: string, gameType: string) => {
    try {
        const data = {
            userId,
            wordOrNumber: '', // Not needed for the check, but required by API
            gameType,
        }
        const result = await apiRequest('/solo/last-win-check', 'POST', data)
        return result
    } catch (error) {
        console.error('Error checking last win time:', error)
        throw error
    }
}
