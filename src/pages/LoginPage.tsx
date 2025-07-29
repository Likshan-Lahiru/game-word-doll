/*import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { ForgotPasswordModal } from '../components/ForgotPasswordModal'
import { ResetPasswordModal } from '../components/ResetPasswordModal'
import { useGlobalContext } from '../context/GlobalContext'
export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useGlobalContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login with:', email, password)
    // Simulate successful login
    login()
    // Redirect to home page after login
    navigate('/')
  }
  const handleForgotPassword = () => {
    setVerificationEmail(email || 'acd@gmail.com') // Use entered email or default
    setShowForgotPasswordModal(true)
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
      <div className="flex flex-col w-full min-h-screen bg-[#1E2432] text-white font-['Inter']">
        <div className="flex-1 flex items-center justify-center p-4 font-['Inter']">
          <div className="w-full max-w-md px-4 sm:px-0">
            <h1 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">
              Log In
            </h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 font-['Inter']  py-3 bg-[#353A47] rounded-xl focus:outline-none text-sm sm:text-base"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>
              <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="w-full px-4 font-['Inter'] py-3 bg-[#353A47] rounded-xl focus:outline-none text-sm sm:text-base"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="absolute font-['Inter']  right-3 top-1/2 transform -translate-y-1/2 text-[#414759]"
                    onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                      <EyeOffIcon className="w-5 h-5 bg-transparent" />
                  ) : (
                      <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="flex font-['Inter'] justify-end">
                <button
                    type="button"
                    className="text-[#006CB9] text-xs sm:text-sm hover:underline"
                    onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>
              <button
                  type="submit"
                  className="w-full font-['Inter'] bg-[#2D7FF0] hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-colors text-2xl "
              >
                Log in
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-white text-lg sm:text-sm">
                Don't have an account?{' '}
                <button
                    className="text-[#006CB9] font-['Inter'] font-bold hover:underline"
                    onClick={() => navigate('/signup')}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
        {/!* Forgot Password Modal - now skips email input *!/}
        <ForgotPasswordModal
            isOpen={showForgotPasswordModal}
            onClose={() => setShowForgotPasswordModal(false)}
            onVerificationSuccess={handleVerificationSuccess}
            email={verificationEmail}
        />
        {/!* Reset Password Modal *!/}
        <ResetPasswordModal
            isOpen={showResetPasswordModal}
            onClose={() => setShowResetPasswordModal(false)}
            email={verificationEmail}
            onPasswordReset={handlePasswordReset}
        />
      </div>
  )
}*/
/*
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { ForgotPasswordModal } from '../components/ForgotPasswordModal'
import { ResetPasswordModal } from '../components/ResetPasswordModal'
export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login with:', email, password)
  }
  const handleForgotPassword = () => {
    setVerificationEmail(email || 'acd@gmail.com') // Use entered email or default
    setShowForgotPasswordModal(true)
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
      <div className="flex flex-col w-full min-h-screen bg-[#1E2432] text-white font-['Inter']">
        <div className="flex-1 flex items-center justify-center p-4 font-['Inter']">
          <div className="w-full max-w-md px-4 sm:px-0">

            {/!* Logo *!/}
            <div className={"pb-10 flex justify-center"}>
              <img src={"/cookycreanlogo3.png"}
                   alt="cooky cream logo"
                   className={"w-[217px] h-[120px]"}
              />
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 font-['Inter']  py-4 bg-[#353A47] rounded-xl focus:outline-none text-sm sm:text-base"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>
              <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="w-full px-4 font-['Inter'] py-4 bg-[#353A47] rounded-xl focus:outline-none text-sm sm:text-base"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="absolute font-['Inter']  right-3 top-1/2 transform -translate-y-1/2 text-[#414759]"
                    onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                      <EyeOffIcon className="w-5 h-5 bg-transparent" />
                  ) : (
                      <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="flex font-['Inter'] justify-end">
                <button
                    type="button"
                    className="text-[#006CB9] text-xs sm:text-sm hover:underline"
                    onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>
              <button
                  type="submit"
                  className="w-full font-['Inter'] bg-[#2D7FF0] hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-colors text-2xl "
              >
                Log in
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-white text-lg sm:text-sm">
                Don't have an account?{' '}
                <button
                    className="text-[#006CB9] font-['Inter'] font-bold hover:underline"
                    onClick={() => navigate('/signup')}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
        {/!* Forgot Password Modal - now skips email input *!/}
        <ForgotPasswordModal
            isOpen={showForgotPasswordModal}
            onClose={() => setShowForgotPasswordModal(false)}
            onVerificationSuccess={handleVerificationSuccess}
            email={verificationEmail}
        />
        {/!* Reset Password Modal *!/}
        <ResetPasswordModal
            isOpen={showResetPasswordModal}
            onClose={() => setShowResetPasswordModal(false)}
            email={verificationEmail}
            onPasswordReset={handlePasswordReset}
        />
      </div>
  )
}*/
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { ForgotPasswordModal } from '../components/ForgotPasswordModal'
import { ResetPasswordModal } from '../components/ResetPasswordModal'
import { useGlobalContext } from '../context/GlobalContext'
export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useGlobalContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login with:', email, password)
    // Simulate successful login
    login()
    // Redirect to home page after login
    navigate('/')
  }
  const handleForgotPassword = () => {
    setVerificationEmail(email || 'acd@gmail.com') // Use entered email or default
    setShowForgotPasswordModal(true)
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
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full font-semibold px-4 py-4 bg-[#374151] rounded-2xl focus:outline-none text-sm sm:text-base"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>
              <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="w-full font-semibold px-4 py-4 bg-[#374151] rounded-2xl focus:outline-none text-sm sm:text-base"
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
                      <EyeOffIcon className="w-5 h-5 bg-transparent" />
                  ) : (
                      <EyeIcon className="w-5 h-5" />
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
              >
                Log in
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
        {/* Forgot Password Modal - now skips email input */}
        <ForgotPasswordModal
            isOpen={showForgotPasswordModal}
            onClose={() => setShowForgotPasswordModal(false)}
            onVerificationSuccess={handleVerificationSuccess}
            email={verificationEmail}
        />
        {/* Reset Password Modal */}
        <ResetPasswordModal
            isOpen={showResetPasswordModal}
            onClose={() => setShowResetPasswordModal(false)}
            email={verificationEmail}
            onPasswordReset={handlePasswordReset}
        />
      </div>
  )
}
