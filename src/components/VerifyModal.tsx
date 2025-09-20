import React, { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'
import { useNavigate } from 'react-router-dom'
type VerifyModalProps = {
    isOpen: boolean
    onClose: () => void
    userId: string
    email: string
}
export function VerifyModal({
                                isOpen,
                                onClose,
                                userId,
                                email,
                            }: VerifyModalProps) {
    const navigate = useNavigate()
    const [verificationCode, setVerificationCode] = useState([
        '',
        '',
        '',
        '',
        '',
        '',
    ])
    const [isMobile, setIsMobile] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])
    const handleCodeChange = (index: number, value: string) => {
        if (value.length <= 1) {
            const newCode = [...verificationCode]
            newCode[index] = value
            setVerificationCode(newCode)
            // Auto-focus next input
            if (value !== '' && index < 5) {
                const nextInput = document.getElementById(`verify-code-${index + 1}`)
                nextInput?.focus()
            }
        }
    }
    const handleVerifyCode = async () => {
        const code = verificationCode.join('')
        // Basic validation
        if (code.length !== 6) {
            setError('Please enter all 6 digits of the verification code')
            return
        }
        setIsLoading(true)
        setError('')
        try {
            // Call the verify API
            const response = await apiRequest(
                '/auth/verify',
                'POST',
                {
                    userId,
                    verifyNumber: code,
                },
                false,
            )
            if (response.verified) {
                setSuccessMessage(response.message || 'Verification successful!')
                // Full reload with URL
                setTimeout(() => {
                    window.location.href = '/' // or replace with your desired URL
                    // window.location.replace('/') // alternative: replaces history instead of adding new entry
                }, 1500)
            } else {
                setError(response.message || 'Invalid verification code')
            }
        } catch (error: any) {
            console.error('Error verifying code:', error)
            setError('An error occurred. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }
    const handleResendCode = async () => {
        setIsLoading(true)
        setError('')
        try {
            // Call API to resend verification code with email
            await apiRequest(
                '/auth/resend-verification',
                'POST',
                {
                    email,
                },
                false,
            )
            // Clear the verification code inputs
            setVerificationCode(['', '', '', '', '', ''])
            setSuccessMessage('Verification code resent successfully')
            setTimeout(() => {
                setSuccessMessage('')
            }, 3000)
        } catch (error) {
            console.error('Error resending verification code:', error)
            setError('Failed to resend code. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pasteData = e.clipboardData.getData('text').trim()
        if (/^\d+$/.test(pasteData)) {
            const digits = pasteData.slice(0, 6).split('') // max 6 digits
            const newCode = [...verificationCode]
            digits.forEach((digit, i) => {
                if (i < 6) {
                    newCode[i] = digit
                }
            })
            setVerificationCode(newCode)
            // Focus last filled input
            const nextInput = document.getElementById(
                `verify-code-${digits.length - 1}`,
            )
            nextInput?.focus()
        }
    }
    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number,
    ) => {
        if (e.key === 'Backspace' && verificationCode[index] === '') {
            if (index > 0) {
                const prevInput = document.getElementById(
                    `verify-code-${index - 1}`,
                ) as HTMLInputElement
                const newCode = [...verificationCode]
                newCode[index - 1] = ''
                setVerificationCode(newCode)
                prevInput?.focus()
            }
        }
    }
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]">
            <div className="bg-[#374151] font-['Inter'] rounded-lg p-10 shadow-xl w-full max-w-lg mx-4">
                <h2 className="text-white text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4">
                    Verify Email
                </h2>
                <p className="text-gray-400 font-['Inter'] text-center text-xs sm:text-sm mb-4 sm:mb-6">
                    Please enter the 6 digits code that was sent to
                    <br />
                    <span className="font-['Inter'] text-gray-50">{email}</span>
                </p>
                {error && (
                    <div className="bg-red-500 text-white p-3 rounded-md mb-4 text-center text-sm">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-500 text-white p-3 rounded-md mb-4 text-center text-sm">
                        {successMessage}
                    </div>
                )}
                <div className="flex justify-center space-x-1 sm:space-x-2 mb-4 sm:mb-6">
                    {verificationCode.map((digit, index) => (
                        <input
                            key={index}
                            id={`verify-code-${index}`}
                            type="text"
                            maxLength={1}
                            className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold bg-white rounded-md focus:outline-none text-gray-800"
                            value={digit}
                            onChange={(e) => handleCodeChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            disabled={isLoading}
                            onPaste={handlePaste}
                        />
                    ))}
                </div>
                <div className={'flex flex-col items-center'}>
                    <button
                        className={`${isMobile && 'w-[210px]'} w-72 bg-[#2D7FF0] hover:bg-blue-600 text-white font-bold py-2 sm:py-3 px-4 rounded-2xl transition-colors mb-2 sm:mb-3 text-sm sm:text-base`}
                        onClick={handleVerifyCode}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Verifying...' : 'Verify'}
                    </button>
                    <button
                        type="button"
                        className="w-full text-center hover:underline py-2 text-xs sm:text-sm font-['Inter']"
                        onClick={handleResendCode}
                        disabled={isLoading}
                    >
                        Resend code
                    </button>
                </div>
            </div>
        </div>
    )
}
