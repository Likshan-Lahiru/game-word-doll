import React, { useEffect, useState } from 'react'
import { LogOutIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { fetchUserBasicInfo, updateUserProfile } from '../../services/api'
type AccountTabProps = {
  onChangePassword: () => void
}
export function AccountTab({ onChangePassword }: AccountTabProps) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  // Fetch user basic info when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const userId = localStorage.getItem('userId')
        if (userId) {
          const userInfo = await fetchUserBasicInfo(userId)
          if (userInfo) {
            setUsername(userInfo.userName || '')
            setEmail(userInfo.email || '')
            setCountry(userInfo.country || 'Australia')
          }
        }
      } catch (error) {
        console.error('Failed to fetch user information:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserData()
  }, [])
  const handleSave = async () => {
    try {
      setIsSaving(true)
      setSaveError('')
      setSaveSuccess(false)
      const userId = localStorage.getItem('userId')
      if (!userId) {
        setSaveError('User ID not found. Please log in again.')
        return
      }
      const userData = {
        userName: username,
        email: email,
        country: country,
      }
      const result = await updateUserProfile(userId, userData)
      if (result && result.id) {
        setSaveSuccess(true)
        // Reset success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        setSaveError('Failed to update profile. Please try again.')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      setSaveError('An error occurred while saving your profile.')
    } finally {
      setIsSaving(false)
    }
  }
  const handleLogout = () => {
    // Remove auth token and userId from localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('userId')
    // Navigate to login page
    navigate('/login')
  }
  return (
      <div className="space-y-8 px-10">
        <h2 className="text-xl font-bold mb-6 mt-14">Account</h2>
        {saveError && (
            <div className="bg-red-500 text-white p-2 rounded-md mb-4">
              {saveError}
            </div>
        )}
        {saveSuccess && (
            <div className="bg-green-500 text-white p-2 rounded-md mb-4">
              Profile updated successfully!
            </div>
        )}
        <div className={`${isMobile ? 'space-y-4' : 'space-y-6'}`}>
          {/* User Name and Email Address on the same line */}
          <div className="flex flex-wrap gap-4">
            <div className={`flex-1 min-w-[200px] ${isMobile ? 'mb-4' : 'mb-4'}`}>
              <label className="block text-sm mb-1">User Name</label>
              <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1F2937] rounded-md text-white"
                  disabled={isLoading}
              />
            </div>
            <div className={`flex-1 min-w-[200px] ${isMobile ? 'mb-4' : ''}`}>
              <label className="block text-sm mb-1">Email Address</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1F2937] rounded-md text-white"
                  disabled={isLoading}
              />

            </div>
          </div>
          {/* Country on its own line with smaller width */}
          {/* Country with responsive width */}
          <div
              className={`w-full sm:w-[40%] min-w-[180px] ${isMobile ? 'mb-4' : ''}`}
          >
            <label className="block text-sm mb-1">Country</label>
            <div className="relative">
              <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1F2937] rounded-md text-white appearance-none pr-8"
                  disabled={isLoading}
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
                <option value="United Arab Emirates">United Arab Emirates</option>
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
          </div>
          {/* Change Password button */}
          <div>
            <button
                onClick={onChangePassword}
                className={`text-white hover:text-blue-400 font-medium ${isMobile ? 'mb-5' : 'mb-28'}`}
            >
              Change Password
            </button>
          </div>
        </div>
        {/* Logout and Save buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
              onClick={handleLogout}
              className="flex items-center text-[#FF3838] hover:text-red-400"
          >
            <LogOutIcon className="w-5 h-5 mr-2" />
            Log out
          </button>
          <button
              className="bg-[#2D7FF0] hover:bg-blue-600 text-white px-6 py-2 rounded-full"
              onClick={handleSave}
              disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
  )
}
