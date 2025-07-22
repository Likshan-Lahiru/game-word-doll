import React from 'react'
import { BalanceSelector } from './BalanceSelector'
export function StatusBar({
                              isMobile,
                              hideOnlineCount,
                          }: {
    isMobile?: boolean
    hideOnlineCount?: boolean
}) {
    return (
        <div className="p-2  sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
            {isMobile ? (
                <>
                    <div className="w-full mb-2 ">
                        <BalanceSelector
                            onSelect={(type) => console.log(`Selected: ${type}`)}
                        />
                    </div>
                    <div className="flex justify-center space-x-3 mb-2">
                        <div className="w-28 h-10 bg-[#111827] rounded-full flex items-center px-4  ">
                            {/*outline outline-1 outline-[#374151]*/}
                            <div className="w-7 h-18 flex items-center justify-center">
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/uwPYNNRiavmZZ285SkzD5Z/diaomnd.png"
                                    alt="Diamond"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="ml-1">0</span>
                        </div>
                        <div className="w-28 h-10 bg-[#111827] rounded-full flex items-center px-4  ">
                            {/*outline outline-1 outline-[#374151]*/}
                            <div className="w-8 h-4 flex items-center justify-center">
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                                    alt="Heart"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="ml-1">0</span>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {!hideOnlineCount && (
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-[#42E242]"></div>
                            <span className="text-lg font-Inter font-semibold">
                1,568 Online
              </span>
                        </div>
                    )}
                    <div className="flex-1 max-w-md mx-auto px-4">
                        <BalanceSelector
                            onSelect={(type) => console.log(`Selected: ${type}`)}
                        />
                    </div>
                    <div className="flex flex-col space-y-1 mt-5">
                        <div className="w-50 h-12 bg-[#0A0E1A] rounded-full flex items-center px-3 space-x-6 outline outline-2 outline-[#374151] mt-2">
                            <div className="w-5 h-7 flex items-center justify-center">
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                                    alt="Heart"
                                    className="w-14 h-28 object-contain"
                                />
                            </div>
                            <span className="ml-1 text-lg font-Inter font-semibold">0</span>
                        </div>
                        <div className="w-48 h-12 bg-[#0A0E1A] rounded-full flex items-center px-3 space-x-3 outline outline-2 outline-[#374151]">
                            <div className="w-8 h-8 flex items-center justify-center">
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/uwPYNNRiavmZZ285SkzD5Z/diaomnd.png"
                                    alt="Diamond"
                                    className="w-14 h-28 object-contain"
                                />
                            </div>
                            <span className="ml-1 text-lg font-Inter font-semibold">0</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
