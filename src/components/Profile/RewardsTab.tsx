import React from 'react'
import  { useState } from 'react'

export function RewardsTab() {
  const [referralLink] = useState('cookycream.co/dinal')
  const [copySuccess, setCopySuccess] = useState(false)

  const fontInter = "font-inter";

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
      collected: false,
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
      <>
        <div className={"flex-col"}>
          <h3 className={`${isMobile ? 'text-sm pl-[51px] mb-1' : 'text-base pl-[68px] mb-3'} ${fontInter}`}>
            Lucky Score
          </h3>

          <div className={"flex w-full gap-0"}>
            {/* 1st Column */}
              <div className={`flex-shrink-0 ${isMobile ? 'w-[45px] py-[4px]' : 'px-2 py-[1px]'}`}>

                <div className={`${isMobile ? 'flex justify-end' : ''}`}>
                  <img
                      src="https://uploadthingy.s3.us-west-1.amazonaws.com/uwNqJAKVjMEoXyCFdqfR7v/Lucky_Meter.png"
                      alt="Lucky Clover"
                      className={`${isMobile ? 'w-8 h-8' : 'w-9 h-9'} mb-9`}
                  />
                </div>

                {/* 10 / 10 , 10 / 35 , 10 / 100 */}
                {progressData.map((item, index) => (
                    <>
                      { isMobile &&
                          <>
                            <div className={"px-0 h-7 mt-2"}>
                                  <span className={`${fontInter} text-[10px] text-gray-300 min-w-[100px] text-left`}>
                                    {item.current} / {item.total}
                                  </span>
                            </div>
                            <div className={"h-10"}></div>
                          </>
                      }
                    </>
                ))}
              </div>

            {/* 2nd Column */}
            <div className={"flex-grow-[2] px-2"}>

              {/* Lucky Score Bar*/}
              <div className={"flex items-center h-10 mb-10"}>
                <div className={"w-full h-7 border-[8px] rounded-full border-[#1F2937] "}>
                  <div className={"bg-[#61D94C] h-full rounded-full"} style={{ width : "3.4%" }}></div>
                </div>
              </div>

              {/* Invite Friend Count Bars*/}
              <div className={`${isMobile ? 'mb-8' : 'mb-10'}`}>
                {progressData.map((item, index) => (
                    <>
                      <div className={"flex-col pb-2"}>
                        <div className={"flex items-center justify-between h-7"}>
                          <p className={`${isMobile ? 'px-1 text-[10px]' : 'px-3'} ${fontInter}`}>{item.label}</p>
                          <div className={`flex items-center ${isMobile ? 'pr-2' : 'pr-5'}`}>
                            <img src={"https://uploadthingy.s3.us-west-1.amazonaws.com/oAU96XFXcVYkXtWtpooLxY/Vouchers.png"}
                                 alt={"ticket"}
                                 className={`w-8 h-8`}
                            />
                            <p className={`${fontInter} ${isMobile ? 'text-[10px]' : ''}`}>x {item.reward}</p>
                          </div>
                        </div>
                        <div className={"h-10"}>
                          <div className={"w-full h-7 border-[8px] rounded-full border-[#1F2937] "}>
                            <div className={`${fontInter} bg-[#21B9F0] h-full rounded-full`}
                                 style={{
                                   width: `${(item.current / item.total) * 100}%`,
                                 }}></div>
                          </div>
                        </div>
                      </div>
                    </>
                ))}
              </div>

              {/* Copy Referral */}
              <div className={`flex gap-3 ${isMobile ? 'mb-8' : 'mb-10 pr-12'}`}>
                <div className="flex-1 rounded-full overflow-hidden400">
                  <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className={`${fontInter} w-full px-4 py-3 bg-white text-black text-sm rounded-full flex items-center ${isMobile ? 'h-5' : 'h-[32px]' }`}
                  />
                </div>
                {!isMobile &&
                    <div>
                      <button
                          onClick={handleCopyLink}
                          className={`${fontInter} hover:bg-blue-600 text-white px-5 py-3 text-[14px] bg-blue-500 rounded-full flex items-center ${isMobile ? 'h-5' : 'h-[32px] px-8'}`}
                      >
                        {copySuccess ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                }
              </div>
            </div>

            {/* 3rd Column */}
            <div className={`w-1/3 ${isMobile && 'w-1/4'}`}>

              {/* Lucky Score Percentage  */}
              <div className={"flex items-center h-10 mb-10"}>
                <span className={`${fontInter} text-green-500 font-medium px-4`}>1.4%</span>
              </div>

              {/* Collect Buttons */}
                {progressData.map((item, index) => (
                    <div className={`flex pb-2`}>
                      <div>

                        {/* Empty Space */}
                        <div className={"h-7"}></div>

                        <div className={`${isMobile ? 'flex-col ml-2' : 'flex px-4'} h-10 flex`}>

                          {/* Collect Button */}
                          <button
                              className={`${fontInter} h-6 text-[14px] flex items-center px-4 py-1 rounded-full ${isMobile ? 'text-xs' : 'text-sm'} ${item.collected ? 'bg-gray-600 text-gray-300' : item.current === item.total ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`}
                              disabled={item.collected}
                          >
                            {item.collected ? 'collected' : 'collect'}
                          </button>

                          {/* 10 / 10 , 10 / 35 , 10 / 100 */}
                          { !isMobile &&
                              <div className={"px-7"}>
                                <span className={`${fontInter} text-[14px] text-gray-300 min-w-[60px] text-right`}>
                                  {item.current} / {item.total}
                                </span>
                              </div>
                          }
                        </div>
                      </div>
                    </div>
                ))}

              {/* Copy Referral Button */}
              {isMobile &&
                  <>
                    {/* Empty Space */}
                    <div className={"h-8"}></div>

                    <div>
                      <button
                          onClick={handleCopyLink}
                          className={`${fontInter} hover:bg-blue-600 text-white ml-2 px-4 py-3 text-[14px] bg-blue-500 rounded-full flex items-center ${isMobile ? 'h-5' : 'h-[32px] px-8'}`}
                      >
                        {copySuccess ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </>
              }
            </div>
          </div>

          {/* Invite Description */}
          <div>
            <p className={`leading-6 ${isMobile ? 'text-xs ml-[10px] mr-[10px]' : 'text-sm pr-10 ml-[52px] mr-[72px]'} ${fontInter} px-2 text-gray-400 mt-4`}>
              Invite & sign up friends from your personal link to increase Lucky
              Score and get free{' '}
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/oAU96XFXcVYkXtWtpooLxY/Vouchers.png"
                  alt="Voucher"
                  className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} inline mx-1 p-0 m-0`}
              />{' '}
              vouchers. Invite & sign up friends from your personal link to increase Lucky
            </p>
          </div>
        </div>
      </>
  )
}
