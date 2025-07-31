import React, {useEffect} from 'react'
import  { useState } from 'react'
type ForgotPasswordModalProps = {
  isOpen: boolean
  onClose: () => void
  onVerificationSuccess: (email: string) => void
  email?: string
}
export function ForgotPasswordModal({
                                      isOpen,
                                      onVerificationSuccess,
                                      email = 'acd@gmail.com',
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
        const nextInput = document.getElementById(`code-${index + 1}`)
        nextInput?.focus()
      }
    }
  }
  const handleVerifyCode = () => {
    // In a real app, you would verify the code with your backend
    console.log('Verifying code:', verificationCode.join(''))
    onVerificationSuccess(email)
  }
  const handleResendCode = () => {
    console.log('Resending verification code to:', email)
    // In a real app, you would resend the code
  }
  if (!isOpen) return null
  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937E5]/90">
        <div className="bg-[#374151] font-['Inter'] rounded-lg p-10 shadow-xl w-full max-w-lg mx-4">
          <h2 className="text-white text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4">
            Password Reset
          </h2>
          <p className="text-gray-400 font-['Inter'] text-center text-xs sm:text-sm mb-4 sm:mb-6">
            Please enter the 6 digits code that was sent to
            <br />
            <span className="font-['Inter'] text-gray-50">{email}</span>
          </p>
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
                />
            ))}
          </div>
          <div className={"flex flex-col items-center"}>
            <button
                className={`${isMobile && 'w-[210px]'} w-72 bg-[#2D7FF0] hover:bg-blue-600 text-white font-bold py-2 sm:py-3 px-4 rounded-2xl transition-colors mb-2 sm:mb-3 text-sm sm:text-base`}
                onClick={handleVerifyCode}
            >
              Verify
            </button>
            <button
                type="button"
                className="w-full text-center hover:underline py-2 text-xs sm:text-sm font-['Inter']"
                onClick={handleResendCode}
            >
              Resend code
            </button>
          </div>
        </div>
      </div>
  )
}
