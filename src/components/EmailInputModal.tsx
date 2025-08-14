import React, { useState } from 'react'
import { apiRequest } from '../services/api'
type EmailInputModalProps = {
    isOpen: boolean
    onClose: () => void
    onSubmit: (email: string) => void
    initialEmail?: string
}
export function EmailInputModal({
                                    isOpen,
                                    onClose,
                                    onSubmit,
                                    initialEmail = '',
                                }: EmailInputModalProps) {
    const [email, setEmail] = useState(initialEmail)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Basic email validation
        if (!email || !email.includes('@') || !email.includes('.')) {
            setError('Please enter a valid email address')
            return
        }
        setIsLoading(true)
        setError('')
        try {
            // Call the forgot password API
            const response = await apiRequest(
                '/auth/reset/forgot-password',
                'POST',
                {
                    email,
                },
                false,
            )
            if (response.success === false) {
                setError(
                    response.message ||
                    'Failed to send verification code. Please try again.',
                )
                return
            }
            // If successful, proceed to verification code step
            onSubmit(email)
        } catch (error) {
            console.error('Error sending verification code:', error)
            setError('An error occurred. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937E5]/90">
            <div className="bg-[#374151] font-['Inter'] rounded-lg p-10 shadow-xl w-full max-w-lg mx-4">
                <h2 className="text-white text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4">
                    Forgot Password
                </h2>
                <p className="text-gray-400 font-['Inter'] text-center text-xs sm:text-sm mb-4 sm:mb-6">
                    Please enter your email address to receive a verification code
                </p>
                {error && (
                    <div className="bg-red-500 text-white p-3 rounded-md mb-4 text-center text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full font-semibold px-4 py-4 bg-[#2D3748] rounded-2xl focus:outline-none text-base"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <div className="flex flex-col items-center pt-2">
                        <button
                            type="submit"
                            className="w-72 bg-[#2D7FF0] hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-2xl transition-colors mb-2 sm:mb-3 text-sm sm:text-base"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Verification Code'}
                        </button>
                        <button
                            type="button"
                            className="w-full text-center hover:underline py-2 text-xs sm:text-sm font-['Inter']"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
