import React, { useState } from 'react';
export function RewardsTab() {
  const [referralLink] = useState('coolsystem.coinlotl');
  const [copySuccess, setCopySuccess] = useState(false);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  const progressData = [{
    label: 'Invite & sign up 10 friends',
    reward: 10,
    current: 10,
    total: 10
  }, {
    label: 'Invite & sign up 35 friends',
    reward: 45,
    current: 10,
    total: 45
  }, {
    label: 'Invite & sign up 100 friends',
    reward: 120,
    current: 10,
    total: 120
  }];
  return <div className="space-y-6">
      {/* Lucky Score */}
      <div className="flex items-center gap-4 mb-6">
        <img src="/Lucky_Meter.png" alt="Lucky Clover" className="w-10 h-10" />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm text-gray-300">Lucky Score</h3>
            <span className="text-xs text-green-500 font-medium">1.4%</span>
          </div>
          <div className="overflow-hidden h-2 rounded-full bg-gray-700">
            <div style={{
            width: '1.4%'
          }} className="h-full bg-green-500"></div>
          </div>
        </div>
      </div>
      {/* Referral Tiers */}
      {progressData.map((item, index) => <div key={index}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">{item.label}</span>
            <div className="flex items-center">
              <img src="/Vouchers.png" alt="Voucher" className="w-12 h-15 mr-1" />
              <span className="text-xs text-blue-400">× {item.reward}</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative flex-grow mr-2">
              <div className="overflow-hidden h-2 rounded-full bg-gray-700">
                <div style={{
              width: `${item.current / item.total * 100}%`
            }} className="h-full bg-blue-500"></div>
              </div>
            </div>
            <button className={`${item.current === item.total ? 'bg-blue-500' : 'bg-gray-600'} text-white text-xs py-1 px-4 rounded-full`}>
              Collect
            </button>
            <span className="ml-2 text-xs text-gray-400">
              {item.current} / {item.total}
            </span>
          </div>
        </div>)}
      {/* Referral Link */}
      <div className="mt-4">
        <div className="flex">
          <input type="text" value={referralLink} readOnly className="flex-grow px-4 py-2 bg-gray-700 rounded-l-md text-white" />
          <button onClick={handleCopyLink} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md">
            {copySuccess ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-3">
          Invite & sign up friends from your personal link to increase Lucky
          Score and get free 💎 vouchers.
        </p>
      </div>
    </div>;
}