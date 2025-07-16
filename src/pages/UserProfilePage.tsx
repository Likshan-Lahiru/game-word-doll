import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { ProfileTabs } from '../components/Profile/ProfileTabs';
import { AccountTab } from '../components/Profile/AccountTab';
import { RewardsTab } from '../components/Profile/RewardsTab';
import { PrivacyTab } from '../components/Profile/PrivacyTab';
import { HelpTab } from '../components/Profile/HelpTab';
import { BottomNavigation } from '../components/BottomNavigation';
import { ChangePasswordModal } from '../components/Profile/ChangePasswordModal';
export function UserProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountTab onChangePassword={() => setShowChangePasswordModal(true)} />;
      case 'rewards':
        return <RewardsTab />;
      case 'privacy':
        return <PrivacyTab />;
      case 'help':
        return <HelpTab />;
      default:
        return <AccountTab onChangePassword={() => setShowChangePasswordModal(true)} />;
    }
  };
  return <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
      <div className="p-4">
        <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center" onClick={() => navigate('/')}>
          <img src="/back-icons.png" alt="Back" className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start p-4">
        <div className="w-full max-w-3xl bg-[#374151] rounded-2xl overflow-hidden">
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="px-10 py-8">{renderTabContent()}</div>
        </div>
      </div>

      <BottomNavigation />

      <ChangePasswordModal isOpen={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)} />
    </div>;
}