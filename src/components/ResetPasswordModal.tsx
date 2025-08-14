import React, { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'
type ResetPasswordModalProps = {
  isOpen: boolean
  onClose: () => void
  email: string
  onPasswordReset: () => void
}
export function ResetPasswordModal({
                                     isOpen,
                                     onClose,
                                     email,
                                     onPasswordReset,
                                   }: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      // Call the reset password API
      const response = await apiRequest(
          '/auth/reset/reset-password',
          'POST',
          {
            email,
            newPassword,
          },
          false,
      )
      if (response.success === false) {
        setError(
            response.message || 'Failed to reset password. Please try again.',
        )
        return
      }
      // If successful, call the onPasswordReset callback
      onPasswordReset()
    } catch (error) {
      console.error('Error resetting password:', error)
      setError('An error occurred. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }
  if (!isOpen) return null
  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937E5]/90">
        <div
            className={`${isMobile ? 'p-16 max-w-lg' : 'p-5 sm:pt-10 sm:pb-24 sm:pr-20 sm:pl-20 max-w-lg'} bg-[#374151] rounded-lg shadow-xl w-full mx-4`}
        >
          <h2 className="text-white text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4">
            Password Reset
          </h2>
          <p
              className={`${isMobile ? '' : 'text-xl'} text-[#FFFFFF80]/50 font-['Inter'] text-center mb-4 sm:mb-6`}
          >
            Enter a new password below to reset your password.
          </p>
          {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-md mb-4 text-xs">
                {error}
              </div>
          )}
          <form onSubmit={handleResetPassword}>
            <div className="relative mb-2 sm:mb-2">
              <div className="relative">
                <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    className="w-full px-4 py-2 sm:py-3 bg-white rounded-2xl focus:outline-none text-gray-800"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                    required
                />
                <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                      <img
                          src={'/Eye.png'}
                          alt={'Eye Icon'}
                          className={'w-5 h-5'}
                      />
                  ) : (
                      <img
                          src={'/eye-off.png'}
                          alt={'Eye Icon'}
                          className={'w-5 h-5'}
                      />
                  )}
                </button>
              </div>
            </div>
            <div className={`${isMobile ? 'mb-8' : 'mb-4'} relative sm:mb-6`}>
              <div className="relative">
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 sm:py-3 bg-white rounded-2xl focus:outline-none text-gray-800"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    required
                />
                <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                      <img
                          src={'/Eye.png'}
                          alt={'Eye Icon'}
                          className={'w-5 h-5'}
                      />
                  ) : (
                      <img
                          src={'/eye-off.png'}
                          alt={'Eye Icon'}
                          className={'w-5 h-5'}
                      />
                  )}
                </button>
              </div>
            </div>
            <button
                type="submit"
                className="w-full bg-[#2D7FF0] hover:bg-blue-600 text-white font-bold py-2 sm:py-3 px-4 rounded-2xl transition-colors mb-2 sm:mb-3"
                disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset'}
            </button>
            <button
                type="button"
                className="w-full bg-white text-gray-800 font-bold py-2 sm:py-3 px-4 rounded-2xl transition-colors"
                onClick={onClose}
                disabled={isLoading}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
  )
}
