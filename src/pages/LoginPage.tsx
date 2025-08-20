import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ForgotPasswordModal } from '../components/ForgotPasswordModal'
import { ResetPasswordModal } from '../components/ResetPasswordModal'
import { EmailInputModal } from '../components/EmailInputModal'
import { useGlobalContext } from '../context/GlobalContext'
import { login, storeAuthToken } from '../services/auth.service'
export function LoginPage() {
  const navigate = useNavigate()
  const { login: loginContext } = useGlobalContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showEmailInputModal, setShowEmailInputModal] = useState(false)
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      // Call the login API
      const response = await login(email, password)
      // Store the token in localStorage
      if (response.token) {
        storeAuthToken(response.token)
        localStorage.setItem('userId', response.userId)
        // Update global auth state
        loginContext()
        // Redirect to home page after successful login
        navigate('/')
      } else {
        setError('Login failed. Please check your credentials and try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred during login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  const handleForgotPassword = () => {
    setShowEmailInputModal(true)
  }
  const handleEmailSubmit = (submittedEmail: string) => {
    setVerificationEmail(submittedEmail)
    setShowEmailInputModal(false)
    setShowForgotPasswordModal(true)
    // In a real app, you would send the verification code to the email here
    console.log('Sending verification code to:', submittedEmail)
  }
  const handleVerificationSuccess = (email: string) => {
    setVerificationEmail(email)
    setShowForgotPasswordModal(false)
    setShowResetPasswordModal(true)
  }
  const handlePasswordReset = () => {
    setShowResetPasswordModal(false)
    // Show success message or redirect
  }
  return (
      <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white font-['Inter']">
        {/* Back button */}
        <div className="absolute top-12 left-2 z-10 lg:top-4 md:top-4 md:left-4 sm:top-4">
          <button
              className="w-12 h-12 rounded-full flex items-center justify-center"
              onClick={() => navigate('/')}
          >
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/5dZY2vpVSVwYT3dUEHNYN5/back-icons.png"
                alt="Back"
                className="w-8 h-8"
            />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          {/* Logo */}
          <div className="mb-12">
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/mMkBSTmjm9ZJj7f2LPjgMg/cookycreanlogo3.png"
                alt="Cooky Cream Logo"
                className="h-24 w-auto"
            />
          </div>
          <div className="w-full max-w-md">
            {error && (
                <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center">
                  {error}
                </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full font-semibold px-4 py-4 bg-[#374151] rounded-2xl focus:outline-none text-base"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>
              <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="w-full font-semibold px-4 py-4 bg-[#374151] rounded-2xl focus:outline-none text-base"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#414759]"
                    onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                      <img
                          src={'/eye-off.png'}
                          alt={'Eye Icon'}
                          className={'w-5 h-5'}
                      />
                  ) : (
                      <img
                          src={'/Eye.png'}
                          alt={'Eye Icon'}
                          className={'w-5 h-5'}
                      />
                  )}
                </button>
              </div>
              <div className="flex justify-end">
                <button
                    type="button"
                    className="text-[#3B82F6] text-xs sm:text-sm hover:underline"
                    onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>
              <button
                  type="submit"
                  className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-2xl transition-colors text-2xl"
                  disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-white text-lg">
                Don't have an account?{' '}
                <button
                    className="text-[#3B82F6] font-bold hover:underline"
                    onClick={() => navigate('/signup')}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
        {/* Email Input Modal - new first step */}
        <EmailInputModal
            isOpen={showEmailInputModal}
            onClose={() => setShowEmailInputModal(false)}
            onSubmit={handleEmailSubmit}
            initialEmail={email} // Pre-fill with login email if available
        />
        {/* Verification Code Modal - second step */}
        <ForgotPasswordModal
            isOpen={showForgotPasswordModal}
            onClose={() => setShowForgotPasswordModal(false)}
            onVerificationSuccess={handleVerificationSuccess}
            email={verificationEmail}
        />
        {/* Reset Password Modal - final step */}
        <ResetPasswordModal
            isOpen={showResetPasswordModal}
            onClose={() => setShowResetPasswordModal(false)}
            email={verificationEmail}
            onPasswordReset={handlePasswordReset}
        />
      </div>
  )
}
