import React from 'react'
import  { useState } from 'react'
export function RewardsTab() {
  const [referralLink] = useState('cookycream.co/dinal')
  const [copySuccess, setCopySuccess] = useState(false)
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }
  const progressData = [
    {
      label: 'Invite & sign up 10 friends',
      reward: 10,
      current: 10,
      total: 10,
      collected: true,
    },
    {
      label: 'Invite & sign up 35 friends',
      reward: 45,
      current: 10,
      total: 35,
      collected: false,
    },
    {
      label: 'Invite & sign up 100 friends',
      reward: 120,
      current: 10,
      total: 100,
      collected: false,
    },
  ]
  const isMobile = window.innerWidth <= 768
  return (
      <div className="space-y-6">
        {/* Lucky Score */}
        <div className="mb-8">
          <h3 className={`${isMobile ? 'text-sm' : 'text-base'} mb-3`}>
            Lucky Score
          </h3>
          <div className="flex items-center gap-3">
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/uwNqJAKVjMEoXyCFdqfR7v/Lucky_Meter.png"
                alt="Lucky Clover"
                className="w-10 h-10"
            />
            <div className="flex-1">
              <div className="relative w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                <div
                    className="absolute h-full bg-green-500 rounded-full"
                    style={{
                      width: '1.4%',
                    }}
                ></div>
              </div>
            </div>
            <span className="text-green-500 font-medium">1.4%</span>
          </div>
        </div>
        {/* Referral Tiers */}
        <div className="space-y-6">
          {progressData.map((item, index) => (
              <div key={index} className={isMobile ? 'flex flex-col' : ''}>
                {isMobile && (
                    <div className="flex justify-between mb-1">
                <span className="text-gray-300 text-xs">
                  {item.current} / {item.total}
                </span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{item.label}</span>
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/oAU96XFXcVYkXtWtpooLxY/Vouchers.png"
                            alt="Voucher"
                            className="w-4 h-4"
                        />
                        <span className="text-blue-400 text-xs">× {item.reward}</span>
                      </div>
                    </div>
                )}
                {!isMobile && (
                    <div className="flex justify-between mb-2">
                      <span className="text-base">{item.label}</span>
                      <div className="flex items-center gap-1">
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/oAU96XFXcVYkXtWtpooLxY/Vouchers.png"
                            alt="Voucher"
                            className="w-5 h-5"
                        />
                        <span className="text-blue-400">× {item.reward}</span>
                      </div>
                    </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="relative flex-grow">
                    <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                      <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${(item.current / item.total) * 100}%`,
                          }}
                      ></div>
                    </div>
                  </div>
                  <button
                      className={`px-4 py-1 rounded-full ${isMobile ? 'text-xs' : 'text-sm'} ${item.collected ? 'bg-gray-600 text-gray-300' : item.current === item.total ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`}
                      disabled={item.collected}
                  >
                    {item.collected ? 'Collected' : 'Collect'}
                  </button>
                  {!isMobile && (
                      <span className="text-gray-300 min-w-[60px] text-right">
                  {item.current} / {item.total}
                </span>
                  )}
                </div>
              </div>
          ))}
        </div>
        {/* Referral Link */}
        <div className="mt-8">
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-full overflow-hidden">
              <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="w-full px-4 py-3 bg-white text-black rounded-full"
              />
            </div>
            <button
                onClick={handleCopyLink}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full"
            >
              {copySuccess ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-400 mt-4`}>
            Invite & sign up friends from your personal link to increase Lucky
            Score and get free{' '}
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/oAU96XFXcVYkXtWtpooLxY/Vouchers.png"
                alt="Voucher"
                className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} inline mx-1`}
            />{' '}
            vouchers.
          </p>
        </div>
      </div>
  )
}
