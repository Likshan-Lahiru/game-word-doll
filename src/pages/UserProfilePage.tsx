import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProfileTabs } from '../components/Profile/ProfileTabs'
import { AccountTab } from '../components/Profile/AccountTab'
import { RewardsTab } from '../components/Profile/RewardsTab'
import { PrivacyTab } from '../components/Profile/PrivacyTab'
import { HelpTab } from '../components/Profile/HelpTab'
import { BottomNavigation } from '../components/BottomNavigation'
import { ChangePasswordModal } from '../components/Profile/ChangePasswordModal'
import { useGlobalContext } from '../context/GlobalContext'
export function UserProfilePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useGlobalContext()
  const [activeTab, setActiveTab] = useState('account')
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
            <AccountTab
                onChangePassword={() => setShowChangePasswordModal(true)}
            />
        )
      case 'rewards':
        return <RewardsTab />
      case 'privacy':
        return <PrivacyTab />
      case 'help':
        return <HelpTab />
      default:
        return (
            <AccountTab
                onChangePassword={() => setShowChangePasswordModal(true)}
            />
        )
    }
  }
  return (
      <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white pt-10">
        <div className="flex-1 flex flex-col items-center justify-start p-4">
          <div
              className={`w-full max-w-3xl ${isMobile ? 'bg-transparent' : 'bg-[#374151]'} rounded-2xl overflow-hidden`}
          >
            <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isMobile={isMobile}
            />
            <div
                className={`${isMobile ? 'bg-[#374151] mt-4 rounded-xl' : ''} px-6 sm:px-10 py-8`}
            >
              {renderTabContent()}
            </div>
          </div>
        </div>
        <BottomNavigation />
        <ChangePasswordModal
            isOpen={showChangePasswordModal}
            onClose={() => setShowChangePasswordModal(false)}
        />
      </div>
  )
}
