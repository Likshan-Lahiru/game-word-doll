import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext'
import { signup, storeAuthToken } from '../services/auth.service'
import { IMAGES } from '../constance/imagesLink'
import { VerifyModal } from '../components/VerifyModal'
export function SignupPage() {
  const navigate = useNavigate()
  const { login, coinBalance, customLogo } = useGlobalContext()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('Select Country') // Set default country
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [userId, setUserId] = useState('')
  // Use custom logo if available, otherwise use default
  const logoSrc = customLogo || IMAGES.logo
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    // Validate country selection
    if (!country) {
      setError('Please select a country')
      setIsLoading(false)
      return
    }
    try {
      // Call the signup API with the updated request object
      const response = await signup({
        email,
        password,
        role: 'USER',
        goldCoins: coinBalance,
        userName: username,
        country: country,
      })
      // Store the token in localStorage
      if (response.token) {
        storeAuthToken(response.token)
        localStorage.setItem('userId', response.userId)
        // Set userId for verification modal
        setUserId(response.userId)
        // Show verification modal instead of navigating directly
        setShowVerifyModal(true)
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
            <img src={logoSrc} alt="Cooky Cream Logo" className="h-24 w-auto" />
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
                  className="placeholder:font-semibold w-full px-4 py-3 bg-[#374151] rounded-xl text-white focus:outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
              />
              <input
                  type="email"
                  placeholder="Email"
                  className="placeholder:font-semibold w-full px-4 py-3 bg-[#374151] rounded-xl text-white focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
              <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="placeholder:font-semibold w-full px-4 py-3 bg-[#374151] rounded-xl text-white focus:outline-none"
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
              <div className="relative">
                <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 bg-[#374151] rounded-md text-white appearance-none pr-8"
                    required
                >
                  <option value="">Select Country</option>
                  <option value="Austria">Austria</option>
                  <option value="Australia">Australia</option>
                  <option value="Belgium">Belgium</option>
                  <option value="Bulgaria">Bulgaria</option>
                  <option value="Canada">Canada</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Cyprus">Cyprus</option>
                  <option value="Czech Republic">Czech Republic</option>
                  <option value="Germany">Germany</option>
                  <option value="Denmark">Denmark</option>
                  <option value="Estonia">Estonia</option>
                  <option value="Spain">Spain</option>
                  <option value="Finland">Finland</option>
                  <option value="France">France</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Gibraltar">Gibraltar</option>
                  <option value="Greece">Greece</option>
                  <option value="Hong Kong">Hong Kong</option>
                  <option value="Croatia">Croatia</option>
                  <option value="Hungary">Hungary</option>
                  <option value="Ireland">Ireland</option>
                  <option value="Italy">Italy</option>
                  <option value="Japan">Japan</option>
                  <option value="Liechtenstein">Liechtenstein</option>
                  <option value="Lithuania">Lithuania</option>
                  <option value="Luxembourg">Luxembourg</option>
                  <option value="Latvia">Latvia</option>
                  <option value="Malta">Malta</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Norway">Norway</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Poland">Poland</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Romania">Romania</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Slovenia">Slovenia</option>
                  <option value="Slovakia">Slovakia</option>
                  <option value="Thailand">Thailand</option>
                  <option value="United Arab Emirates">
                    United Arab Emirates
                  </option>
                  <option value="United States">United States</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
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
        {/* Verification Modal */}
        <VerifyModal
            isOpen={showVerifyModal}
            onClose={() => setShowVerifyModal(false)}
            userId={userId}
            email={email}
        />
      </div>
  )
}
