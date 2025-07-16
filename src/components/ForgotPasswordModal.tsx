import React, { useState } from 'react';
type ForgotPasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onVerificationSuccess: (email: string) => void;
};
export function ForgotPasswordModal({
  isOpen,
  onClose,
  onVerificationSuccess
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send a verification code to the email
    console.log('Sending verification code to:', email);
    setShowVerificationCode(true);
  };
  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      // Auto-focus next input
      if (value !== '' && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };
  const handleVerifyCode = () => {
    // In a real app, you would verify the code with your backend
    console.log('Verifying code:', verificationCode.join(''));
    onVerificationSuccess(email);
  };
  const handleResendCode = () => {
    console.log('Resending verification code to:', email);
    // In a real app, you would resend the code
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90">
      <div className="bg-gray-800 rounded-lg p-8 shadow-xl w-full max-w-md">
        {!showVerificationCode ? <>
            <h2 className="text-white text-xl font-bold text-center mb-6">
              Password Reset
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Enter your email address and we'll send you a verification code to
              reset your password.
            </p>
            <form onSubmit={handleSendCode}>
              <input type="email" placeholder="Email" className="w-full px-4 py-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6" value={email} onChange={e => setEmail(e.target.value)} required />
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition-colors mb-3">
                Send Code
              </button>
              <button type="button" className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-md transition-colors" onClick={onClose}>
                Cancel
              </button>
            </form>
          </> : <>
            <h2 className="text-white text-xl font-bold text-center mb-4">
              Password Reset
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Please enter the 6 digits code that was sent to
              <br />
              <span className="text-white">{email}</span>
            </p>
            <div className="flex justify-center space-x-2 mb-6">
              {verificationCode.map((digit, index) => <input key={index} id={`code-${index}`} type="text" maxLength={1} className="w-12 h-12 text-center text-xl font-bold bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={digit} onChange={e => handleCodeChange(index, e.target.value)} />)}
            </div>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition-colors mb-3" onClick={handleVerifyCode}>
              Verify
            </button>
            <button type="button" className="w-full text-center text-blue-400 hover:underline py-2" onClick={handleResendCode}>
              Resend code
            </button>
          </>}
      </div>
    </div>;
}