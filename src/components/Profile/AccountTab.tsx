import { useEffect, useState } from 'react'
import { LogOutIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type AccountTabProps = {
  onChangePassword: () => void
}

export function AccountTab({ onChangePassword }: AccountTabProps) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('Gina_Blake')
  const [email, setEmail] = useState('example@example.com')
  const [country, setCountry] = useState('Australia')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/login')
  }

  return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold mb-6">Account</h2>
        <div className={`${isMobile ? 'space-y-4' : 'space-y-6'}`}>
          {/* User Name and Email Address on the same line */}
          <div className="flex flex-wrap gap-4">
            <div className={`flex-1 min-w-[200px] ${isMobile ? 'mb-4' : ''}`}>
              <label className="block text-sm mb-1">User Name</label>
              <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1F2937] rounded-md text-white"
              />
            </div>
            <div className={`flex-1 min-w-[200px] ${isMobile ? 'mb-4' : ''}`}>
              <label className="block text-sm mb-1">Email Address</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1F2937] rounded-md text-gray-100"
              />
            </div>
          </div>

          {/* Country on its own line with smaller width */}
          {/* Country with responsive width */}
          <div className={`w-full sm:w-[40%] min-w-[180px] ${isMobile ? 'mb-4' : ''}`}>
            <label className="block text-sm mb-1">Country</label>
            <div className="relative">
              <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1F2937] rounded-md text-white appearance-none pr-8"
              >
                <option value="Australia">Australia</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
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
                className={`text-white hover:text-blue-400 font-medium ${isMobile ? 'mb-5' : ''}`}
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
          <button className="bg-[#2D7FF0] hover:bg-blue-600 text-white px-6 py-2 rounded-full">
            Save
          </button>
        </div>
      </div>
  )
}
