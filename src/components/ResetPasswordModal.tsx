import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
type ResetPasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onPasswordReset: () => void;
};
export function ResetPasswordModal({
  isOpen,
  onClose,
  email,
  onPasswordReset
}: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    // In a real app, you would send the new password to your backend
    console.log('Resetting password for:', email, 'New password:', newPassword);
    onPasswordReset();
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90">
      <div className="bg-gray-800 rounded-lg p-8 shadow-xl w-full max-w-md">
        <h2 className="text-white text-xl font-bold text-center mb-4">
          Password Reset
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Enter a new password below to reset your password.
        </p>
        {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-md mb-4">
            {error}
          </div>}
        <form onSubmit={handleResetPassword}>
          <div className="relative mb-4">
            <input type={showNewPassword ? 'text' : 'password'} placeholder="New Password" className="w-full px-4 py-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" onClick={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
          <div className="relative mb-6">
            <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" className="w-full px-4 py-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition-colors mb-3">
            Reset
          </button>
          <button type="button" className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-md transition-colors" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>;
}