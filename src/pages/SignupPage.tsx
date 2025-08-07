import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext'
import { signup, storeAuthToken } from '../services/auth.service'
export function SignupPage() {
  const navigate = useNavigate()
  const { login } = useGlobalContext()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      // Call the signup API
      const response = await signup({
        email,
        password,
        role: 'USER',
      })
      // Store the token in localStorage
      if (response.token) {
        storeAuthToken(response.token)
        localStorage.setItem('userId', response.userId)
        // Update global auth state
        login()
        // Redirect to home page after successful signup
        navigate('/')
      } else {
        setError('Signup failed. Please try again.')
      }
    } catch (error) {
      console.error('Signup error:', error)
      setError('An error occurred during signup. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
      <div className="flex flex-col w-full min-h-screen bg-[#1E2937] text-white">
        {/* Back button */}
        <div className="absolute top-6 left-6">
          <button
              className="w-12 h-12 rounded-full flex items-center justify-center"
              onClick={() => navigate('/login')}
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
          <div className="mb-8">
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
            <form onSubmit={handleSignup} className="space-y-4">
              <input
                  type="text"
                  placeholder="User Name"
                  className="placeholder:font-semibold w-full px-4 py-4 bg-[#374151] rounded-xl text-white focus:outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
              />
              <input
                  type="email"
                  placeholder="Email"
                  className="placeholder:font-semibold w-full px-4 py-4 bg-[#374151] rounded-xl text-white focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
              <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="placeholder:font-semibold w-full px-4 py-4 bg-[#374151] rounded-xl text-white focus:outline-none"
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
              <input
                  type="text"
                  placeholder="Country"
                  className="placeholder:font-semibold w-full px-4 py-4 bg-[#374151] rounded-xl text-white focus:outline-none"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
              />
              <div className="bg-[#374151] rounded-xl p-4 text-center">
                <h3 className="font-inter font-bold mb-0">Sign Up Bonus</h3>
                <p className="mb-4 font-bold font-inter">Get</p>
                <div className="flex items-center justify-center mb-0">
                  <img
                      src="https://uploadthingy.s3.us-west-1.amazonaws.com/2XiBYwBWgNJxytH6Z2jPWP/point.png"
                      alt="Gold Coins"
                      className="w-5 h-5 object-contain mr-1"
                  />
                  <span className="font-bold font-inter">5,000,000</span>
                </div>
                <p className="mb-4 font-bold font-inter">FREE</p>
                <p className="mb-1 font-bold font-inter">Gold Coins to Play!</p>
              </div>
              <button
                  type="submit"
                  className="font-inter w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-colors text-2xl"
                  disabled={isLoading}
              >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>
      </div>
  )
}
