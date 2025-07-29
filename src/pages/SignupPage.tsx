/*import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useGlobalContext } from '../context/GlobalContext'
export function SignupPage() {
  const navigate = useNavigate()
  const { login } = useGlobalContext()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log('Signup with:', username, email, password, country)
    // Simulate successful signup and login
    login()
    // Redirect to home page after signup
    navigate('/')
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
                className="w-8 h-8"
            />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <form onSubmit={handleSignup} className="space-y-4">
              <input
                  type="text"
                  placeholder="User Name"
                  className="w-full px-4 py-3 bg-[#374151] rounded-xl text-white  text-xl font-semibold  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
              />

              <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-[#374151] rounded-xl text-white  text-xl font-semibold  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
              <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-[#374151] rounded-xl text-white  text-xl font-semibold  focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-3 bg-[#374151] rounded-xl text-white  text-xl font-semibold  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
              />
              <div className="bg-[#374151] rounded-xl  p-4 text-center">
                <h3 className="font-bold text-xl mb-2">Sign Up Bonus</h3>
                <p className="mb-1 text-xl font-bold">Get</p>
                <div className="flex items-center justify-center mb-1">
                  <img
                      src="https://uploadthingy.s3.us-west-1.amazonaws.com/2XiBYwBWgNJxytH6Z2jPWP/point.png"
                      alt="Gold Coins"
                      className="w-5 h-5 object-contain"
                  />
                  <span className="font-bold text-xl">15,000,000</span>
                </div>
                <p className="mb-2 font-bold">FREE</p>
                <p className="mb-2 text-xl font-bold">Gold Coins to Play!</p>
              </div>
              <button
                  type="submit"
                  className="w-full bg-[#2D7FF0] hover:bg-blue-600 text-3xl text-white font-bold py-3 px-4 rounded-xl  transition-colors"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
  )
}*/
/*
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
                className="w-8 h-8"
            />
          </button>
        </div>

        {/!* Logo *!/}
        <div className={"pb-10 flex justify-center"}>
          <img src={"/cookycreanlogo3.png"}
               alt="cooky cream logo"
               className={"w-[217px] h-[120px]"}
          />
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <form onSubmit={handleSignup} className="space-y-4">
              <input
                  type="text"
                  placeholder="User Name"
                  className="w-full px-4 py-3 bg-[#374151] rounded-xl text-white  text-xl font-semibold  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
              />

              <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-[#374151] rounded-xl text-white  text-xl font-semibold  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
              <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-[#374151] rounded-xl text-white  text-xl font-semibold  focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-3 bg-[#374151] rounded-xl text-white  text-xl font-semibold  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
              />
              <div className="bg-[#374151] rounded-xl  p-4 text-center">
                <h3 className="font-bold text-xl mb-2">Sign Up Bonus</h3>
                <p className="mb-1 text-xl font-bold">Get</p>
                <div className="flex items-center justify-center mb-1">
                  <img
                      src="https://uploadthingy.s3.us-west-1.amazonaws.com/2XiBYwBWgNJxytH6Z2jPWP/point.png"
                      alt="Gold Coins"
                      className="w-5 h-5 object-contain"
                  />
                  <span className="font-bold text-xl">15,000,000</span>
                </div>
                <p className="mb-2 font-bold">FREE</p>
                <p className="mb-2 text-xl font-bold">Gold Coins to Play!</p>
              </div>
              <button
                  type="submit"
                  className="w-full bg-[#2D7FF0] hover:bg-blue-600 text-2xl text-white font-bold py-3 px-4 rounded-xl  transition-colors"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
  )
}*/
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useGlobalContext } from '../context/GlobalContext'
export function SignupPage() {
  const navigate = useNavigate()
  const { login } = useGlobalContext()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log('Signup with:', username, email, password, country)
    // Simulate successful signup and login
    login()
    // Redirect to home page after signup
    navigate('/')
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
            <form onSubmit={handleSignup} className="space-y-4">
              <input
                  type="text"
                  placeholder="User Name"
                  className="w-full px-4 py-3 bg-[#353A47] rounded-xl text-white focus:outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
              />
              <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-[#353A47] rounded-xl text-white focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
              <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-[#353A47] rounded-xl text-white focus:outline-none"
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
                  className="w-full px-4 py-3 bg-[#353A47] rounded-xl text-white focus:outline-none"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
              />
              <div className="bg-[#353A47] rounded-xl p-4 text-center">
                <h3 className="font-bold mb-1">Sign Up Bonus</h3>
                <p className="mb-1">Get</p>
                <div className="flex items-center justify-center mb-1">
                  <img
                      src="https://uploadthingy.s3.us-west-1.amazonaws.com/2XiBYwBWgNJxytH6Z2jPWP/point.png"
                      alt="Gold Coins"
                      className="w-5 h-5 object-contain mr-1"
                  />
                  <span className="font-bold">15,000,000</span>
                </div>
                <p className="mb-1 font-bold">FREE</p>
                <p className="mb-1">Gold Coins to Play!</p>
              </div>
              <button
                  type="submit"
                  className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-colors text-lg"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
  )
}

