import React, { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'
type ForgotPasswordModalProps = {
  isOpen: boolean
  onClose: () => void
  onVerificationSuccess: (email: string) => void
  email: string
}
export function ForgotPasswordModal({
                                      isOpen,
                                      onClose,
                                      onVerificationSuccess,
                                      email,
                                    }: ForgotPasswordModalProps) {
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
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  // Hide success message after timeout
  useEffect(() => {
    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessAlert])
  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)
      // Auto-focus next input
      if (value !== '' && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`)
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
      // Call the verify code API
      const response = await apiRequest(
          '/auth/reset/verify-code',
          'POST',
          {
            email,
            code,
          },
          false,
      )
      // If successful, proceed to reset password step
      if (response.success !== false) {
        onVerificationSuccess(email)
      } else {
        setError(response.message || 'Invalid verification code')
      }
    } catch (error: any) {
      console.error('Error verifying code:', error)
      // Handle specific error for invalid code
      if (error.statusCode === 400) {
        setError('Invalid verification code')
      } else {
        setError('An error occurred. Please try again later.')
      }
    } finally {
      setIsLoading(false)
    }
  }
  const handleResendCode = async () => {
    setIsLoading(true)
    setError('')
    try {
      // Call the reset-again API to resend code
      await apiRequest(
          '/auth/reset/reset-again',
          'POST',
          {
            email,
          },
          false,
      )
      // Clear the verification code inputs
      setVerificationCode(['', '', '', '', '', ''])
      // Show success message
      setSuccessMessage('Verification code sent successfully')
      setShowSuccessAlert(true)
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
      const nextInput = document.getElementById(`code-${digits.length - 1}`)
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
            `code-${index - 1}`,
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937E5]/90">
        <div className="bg-[#374151] font-['Inter'] rounded-lg p-10 shadow-xl w-full max-w-lg mx-4 relative">
          <h2 className="text-white text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4">
            Password Reset
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
          <div className="flex justify-center space-x-1 sm:space-x-2 mb-4 sm:mb-6">
            {verificationCode.map((digit, index) => (
                <input
                    key={index}
                    id={`code-${index}`}
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
          {/* Success Alert Popup */}
          {showSuccessAlert && (
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50 transition-opacity duration-300 flex items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                  <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                  />
                </svg>
                {successMessage}
              </div>
          )}
        </div>
      </div>
  )
}
