import React, { useEffect, useState } from 'react'
import { apiRequest } from '../../services/api'
import { useGlobalContext } from '../../context/GlobalContext'
export function RewardsTab() {
  const [referralLink, setReferralLink] = useState('cookycream.co/dinal')
  const [copySuccess, setCopySuccess] = useState(false)
  const [inputCopied, setInputCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [referralData, setReferralData] = useState({
    referralCount: 0,
    referralLink10: false,
    referralLink25: false,
    referralLink100: false,
  })
  const { setVoucherBalance } = useGlobalContext()
  const fontInter = 'font-inter'
  // Fetch referral data when component mounts
  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        setIsLoading(true)
        const userId = localStorage.getItem('userId')
        if (userId) {
          const data = await apiRequest(
              `/referrals/milestones/${userId}`,
              'GET',
          )
          setReferralData(data)
          // Generate referral link
          generateReferralLink(userId)
        }
      } catch (error) {
        console.error('Error fetching referral data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReferralData()
  }, [])
  // Generate referral link
  const generateReferralLink = async (userId) => {
    try {
      const response = await apiRequest('/referrals/generate-link', 'POST', {
        userId,
      })
      if (response && response.inviteLink) {
        setReferralLink(response.inviteLink)
      }
    } catch (error) {
      console.error('Error generating referral link:', error)
    }
  }
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopySuccess(true)
    setInputCopied(true)
    setTimeout(() => setCopySuccess(false), 2000)
    setTimeout(() => setInputCopied(false), 1500)
  }
  // Handle collecting a reward
  const handleCollectReward = async (milestone) => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        console.error('User ID not found')
        return
      }
      // Call the API to collect the reward
      const response = await apiRequest(
          `/referrals/collect-reward/${userId}/${milestone}`,
          'POST',
      )
      // Update local state with the response data
      if (response) {
        setReferralData((prev) => ({
          ...prev,
          referralCount: response.totalReferred || prev.referralCount,
          referralLink10: response.referralLink10,
          referralLink25: response.referralLink25,
          referralLink100: response.referralLink100,
        }))
        // Update voucher balance in global context
        if (response.rewardVouchers) {
          setVoucherBalance(response.rewardVouchers)
        }
      }
    } catch (error) {
      console.error(`Error collecting ${milestone} reward:`, error)
    }
  }
  const progressData = [
    {
      label: 'Invite & sign up 10 friends',
      reward: 2,
      current: referralData.referralCount,
      total: 10,
      collected: referralData.referralLink10,
      canCollect:
          referralData.referralCount >= 10 && !referralData.referralLink10,
      milestone: 10,
    },
    {
      label: 'Invite & sign up 25 friends',
      reward: 5,
      current: referralData.referralCount,
      total: 25,
      collected: referralData.referralLink25,
      canCollect:
          referralData.referralCount >= 25 && !referralData.referralLink25,
      milestone: 25,
    },
    {
      label: 'Invite & sign up 100 friends',
      reward: 10,
      current: referralData.referralCount,
      total: 100,
      collected: referralData.referralLink100,
      canCollect:
          referralData.referralCount >= 100 && !referralData.referralLink100,
      milestone: 100,
    },
  ]
  const isMobile = window.innerWidth <= 768
  const isSmallMobile = window.innerWidth <= 375
  return (
      <>
        <div className={'flex-col'}>
          <div className={'flex w-full gap-0'}>
            {/* 1st Column */}
            <div
                className={`flex-shrink-0 ${isMobile ? 'w-[45px] py-[4px]' : 'px-2 py-[1px]'}`}
            >
              <div
                  className={`${isMobile ? 'flex justify-end' : ''} pb-14   pr-5`}
              ></div>
              {/* 10 / 10 , 10 / 35 , 10 / 100 */}
              {progressData.map((item, index) => (
                  <>
                    {isMobile && (
                        <>
                          <div
                              className={'px-0 h-7 mt-2'}
                              key={`mobile-count-${index}`}
                          >
                      <span
                          className={`${fontInter} ${isSmallMobile ? 'text-[9px]' : 'text-[10px]'} text-gray-300 min-w-[100px] text-left`}
                      >
                        {item.current} / {item.total}
                      </span>
                          </div>
                          <div className={'h-10'}></div>
                        </>
                    )}
                  </>
              ))}
            </div>
            {/* 2nd Column */}
            <div className={'flex-grow-[2] px-2'}>
              {/* Invite Friend Count Bars*/}
              <div className={`${isMobile ? 'mb-2 mt-16' : 'mb-10'}`}>
                {progressData.map((item, index) => (
                    <div className={'flex-col pb-2'} key={`progress-${index}`}>
                      <div className={'flex items-center justify-between h-7'}>
                        <p
                            className={`${isMobile ? 'px-1' : 'px-3 text-sm'} ${isSmallMobile ? 'text-[9px]' : 'text-[10px]'} ${fontInter}`}
                        >
                          {item.label}
                        </p>
                        <div
                            className={`flex items-center ${isMobile ? 'pr-2' : 'pr-5'} ${isSmallMobile && 'pr-0'}`}
                        >
                          <img
                              src={
                                'https://uploadthingy.s3.us-west-1.amazonaws.com/oAU96XFXcVYkXtWtpooLxY/Vouchers.png'
                              }
                              alt={'ticket'}
                              className={`w-10 h-16`}
                          />
                          <p
                              className={`${fontInter} ${isMobile ? '' : 'text-sm'} ${isSmallMobile ? 'text-[9px]' : 'text-[10px]'}`}
                          >
                            x {item.reward}
                          </p>
                        </div>
                      </div>
                      <div className={'h-10'}>
                        <div
                            className={
                              'w-full h-7 border-[8px] rounded-full border-[#1F2937] '
                            }
                        >
                          <div
                              className={`${fontInter} bg-[#21B9F0] h-full rounded-full`}
                              style={{
                                width: `${Math.min((item.current / item.total) * 100, 100)}%`,
                              }}
                          ></div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
              {/* Copy Referral */}
              <div className={`flex gap-3 ${isMobile ? 'mb-16 mt-8' : 'mb-5 pr-12'}`}>
                <div className="flex-1 rounded-full overflow-hidden400">
                  <input
                      type="text"
                      value={
                        inputCopied ? 'Link copied to clipboard!' : referralLink
                      }
                      readOnly
                      className={`${fontInter} ${isSmallMobile && 'text-[9px]'} w-full px-4 py-3 
                    ${inputCopied ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-white text-black'} 
                    text-sm rounded-full flex items-center ${isMobile ? 'h-5' : 'h-[32px]'} transition-colors duration-300`}
                  />
                </div>
                {!isMobile && (
                    <div>
                      <button
                          onClick={handleCopyLink}
                          className={`${fontInter} ${isSmallMobile && 'text-[9px]'} hover:bg-blue-600 text-white px-5 py-3 text-[14px] bg-blue-500 rounded-full flex items-center ${isMobile ? 'h-5' : 'h-[32px] px-8'}`}
                      >
                        {copySuccess ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                )}
              </div>
            </div>
            {/* 3rd Column */}
            <div className={`w-1/3 ${isMobile && 'w-1/4 mt-16'}`}>
              {/* Collect Buttons */}
              {progressData.map((item, index) => (
                  <div className={`flex pb-2`} key={`button-${index}`}>
                    <div>
                      {/* Empty Space */}
                      <div className={'h-7'}></div>
                      <div
                          className={`${isMobile ? 'flex-col ml-2' : 'flex px-4'} h-10 flex`}
                      >
                        {/* Collect Button */}
                        <button
                            onClick={() =>
                                item.canCollect && handleCollectReward(item.milestone)
                            }
                            className={`${fontInter} h-6 flex items-center px-4 py-1 rounded-full ${isMobile ? 'text-xs' : 'text-sm'} ${item.collected ? 'bg-gray-600 text-gray-300' : item.canCollect ? 'bg-blue-500 text-white cursor-pointer' : 'bg-gray-600 text-white cursor-not-allowed'}`}
                            disabled={item.collected || !item.canCollect}
                        >
                          {item.collected ? 'collected' : 'collect'}
                        </button>
                        {/* 10 / 10 , 10 / 35 , 10 / 100 */}
                        {!isMobile && (
                            <div className={'px-7'}>
                        <span
                            className={`${fontInter} text-[11px] text-gray-300 min-w-[60px] text-right`}
                        >
                          {item.current} / {item.total}
                        </span>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
              ))}
              {/* Copy Referral Button */}
              {isMobile && (
                  <>
                    {/* Empty Space */}
                    <div className={'h-8'}></div>
                    <div>
                      <button
                          onClick={handleCopyLink}
                          className={`${fontInter} hover:bg-blue-600 text-white ml-2 px-4 py-3 text-[14px] bg-blue-500 rounded-full flex items-center ${isMobile ? 'h-5' : 'h-[32px] px-8'}`}
                      >
                        {copySuccess ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </>
              )}
            </div>
          </div>
          {/* Invite Description */}
          <div>
            <p
                className={`leading-6 ${isMobile ? 'text-xs ml-[10px] mr-[10px]' : 'text-sm pr-10 ml-[52px] mr-[72px]'} ${fontInter} px-2  mt-4`}
            >
              Invite & sign up friends from your personal link to get free
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/n1GyLezxBrdL3JBWAwST8s/Vouchers.png"
                  alt="Voucher"
                  className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} inline mx-1 p-0 m-0`}
              />{' '}
              vouchers.
            </p>
          </div>
        </div>
      </>
  )
}
