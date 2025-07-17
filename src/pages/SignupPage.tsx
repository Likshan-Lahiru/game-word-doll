import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
export function SignupPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log('Signup with:', username, email, password, country)
  }
  return (
      <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
        <div className="p-4">
          <button
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center"
              onClick={() => navigate(-1)}
          >
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/5dZY2vpVSVwYT3dUEHNYN5/back-icons.png"
                alt="Back"
                className="w-5 h-5"
            />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <form onSubmit={handleSignup} className="space-y-4">
              <input
                  type="text"
                  placeholder="User Name"
                  className="w-full px-4 py-3 bg-[#374151] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
              />
              <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-[#374151] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
              <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-[#374151] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                  ) : (
                      <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              <input
                  type="text"
                  placeholder="Country"
                  className="w-full px-4 py-3 bg-[#374151] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
              />
              <div className="bg-[#374151] rounded-md p-4 text-center">
                <h3 className="font-bold mb-2">Sign Up Bonus</h3>
                <p className="mb-1">Get</p>
                <div className="flex items-center justify-center mb-1">
                  <span className="bg-yellow-500 rounded-full w-5 h-5 inline-block mr-2"></span>
                  <span className="font-bold">15,000,000</span>
                </div>
                <p className="mb-2">FREE</p>
                <p>Gold Coins to Play!</p>
              </div>
              <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
  )
}
