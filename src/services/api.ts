// Base API configuration
//const API_BASE_URL = 'https://service-wordle.beecele.com.au/wordoll/api'
const API_BASE_URL = 'http://localhost:8080/wordoll/api'
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
// Fetch user balance data
export const fetchUserBalance = async (userId: string) => {
    try {
        const endpoint = `/users/${userId}/balance`
        const result = await apiRequest(endpoint, 'GET')
        return result
    } catch (error) {
        console.error('Error fetching user balance:', error)
        throw error
    }
}
// Fetch user basic information
export const fetchUserBasicInfo = async (userId: string) => {
    try {
        const endpoint = `/users/${userId}/basic-info`
        const result = await apiRequest(endpoint, 'GET')
        return result
    } catch (error) {
        console.error('Error fetching user basic info:', error)
        throw error
    }
}
// Update user profile information
export const updateUserProfile = async (
    userId: string,
    userData: { userName: string; email: string; country: string },
) => {
    try {
        const endpoint = `/users/${userId}`
        const result = await apiRequest(endpoint, 'PUT', userData)
        return result
    } catch (error) {
        console.error('Error updating user profile:', error)
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
// Fetch package offers
export const fetchPackageOffers = async () => {
    try {
        const endpoint = '/package-offers/latest'
        const result = await apiRequest(endpoint, 'GET')
        return result
    } catch (error) {
        console.error('Error fetching package offers:', error)
        throw error
    }
}
// Create Stripe checkout session for package purchase
export const createStripeCheckout = async (
    userId: string,
    packageOfferId: string,
) => {
    try {
        const data = {
            userId,
            packageOfferId,
        }
        const result = await apiRequest('/stripe/checkout', 'POST', data)
        return result
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error)
        throw error
    }
}
// Fetch online user count
export const fetchOnlineUserCount = async () => {
    try {
        const endpoint = '/users/random-number'
        const result = await apiRequest(endpoint, 'GET', undefined, false)
        return result
    } catch (error) {
        console.error('Error fetching online user count:', error)
        throw error
    }
}
// Fetch flip packages
export const fetchFlipPackages = async () => {
    try {
        const endpoint = '/flip-packages/sorted'
        const result = await apiRequest(endpoint, 'GET')
        // Apply specific modifications to Pack 03 and Pack 04
        if (Array.isArray(result)) {
            return result.map((pack) => {
                if (pack.title === 'Pack 03') {
                    return { ...pack, voucher: pack.voucher + 1 }
                } else if (pack.title === 'Pack 04') {
                    return { ...pack, voucher: pack.voucher + 2 } // Changed from +3 to +2
                }
                return pack
            })
        }
        return result
    } catch (error) {
        console.error('Error fetching flip packages:', error)
        throw error
    }
}
// Fetch gold coin packages
export const fetchGoldCoinPackages = async () => {
    try {
        const endpoint = '/flip-gold-coin-packages/sorted'
        const result = await apiRequest(endpoint, 'GET')
        return result
    } catch (error) {
        console.error('Error fetching gold coin packages:', error)
        throw error
    }
}
// Fetch gold coin flip count
export const fetchGoldCoinFlipCount = async (userId: string) => {
    try {
        const endpoint = `/users/${userId}/gold-coin-flip-count`
        const result = await apiRequest(endpoint, 'GET')
        return result
    } catch (error) {
        console.error('Error fetching gold coin flip count:', error)
        throw error
    }
}
