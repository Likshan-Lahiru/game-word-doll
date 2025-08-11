import React from 'react'
import { BalanceSelector } from './BalanceSelector'
import { useGlobalContext } from '../context/GlobalContext'
import { useLocation } from 'react-router-dom'
export function StatusBar({
                              isMobile,
                              hideOnlineCount,
                              switchableBalanceSelector = false,
                          }: {
    isMobile?: boolean
    hideOnlineCount?: boolean
    switchableBalanceSelector?: boolean
}) {
    const { isAuthenticated, gemBalance, voucherBalance } = useGlobalContext()
    const location = useLocation()
    const isHomePage = location.pathname === '/'
    return (
        <div className="p-0 sm:pr-4 flex flex-col sm:flex-row sm:justify-between">
            {isMobile ? (
                <>
                    <div className="w-full mb-2 ">
                        <BalanceSelector
                            onSelect={(type) => console.log(`Selected: ${type}`)}
                            switchable={switchableBalanceSelector}
                        />
                    </div>
                    <div className="flex justify-center space-x-3 mb-0">
                        <div className="w-28 h-10 bg-[#111827] rounded-full flex items-center px-4 mb-0 ">
                            <div className="w-7 h-18 flex items-center justify-center">
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/uwPYNNRiavmZZ285SkzD5Z/diaomnd.png"
                                    alt="Diamond"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="ml-1 font-bold">{Number.isInteger(gemBalance)
                                ? gemBalance
                                : gemBalance.toFixed(2)}</span>
                        </div>
                        <div className="w-28 h-10 bg-[#111827] rounded-full flex items-center px-4  ">
                            <div className="w-8 h-4 flex items-center justify-center">
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                                    alt="Heart"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="ml-1 font-bold">{Number.isInteger(voucherBalance)
                                ? voucherBalance
                                : voucherBalance.toFixed(2)}</span>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center mr-52 space-x-3">
                        {isHomePage && !isAuthenticated && (
                            <div className="absolute top-5 left-5 z-10">
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/uYsqLmRkx6f1zBGRqMZA6G/cookycreanlogo3.png"
                                    alt="Cooky Cream Logo"
                                    className="h-12 sm:h-16"
                                />
                            </div>
                        )}
                    </div>
                    <div
                        className={`flex-1 max-w-xl mx-auto mt-5 ${hideOnlineCount ? 'pl-0' : 'px-4'}`}
                    >
                        <BalanceSelector
                            onSelect={(type) => console.log(`Selected: ${type}`)}
                            switchable={switchableBalanceSelector}
                        />
                    </div>
                    <div className="flex flex-col space-y-1 mt-5">
                        <div className="w-50 h-10 bg-[#0A0E1A] rounded-full flex items-center px-3 space-x-4 outline outline-2 outline-[#374151] mt-1 mb-2">
                            <div className="w-5 h-7 flex items-center justify-center">
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                                    alt="Heart"
                                    className="w-14 h-28 object-contain"
                                />
                            </div>
                            <span className="ml-1 text-lg font-Inter font-bold">{Number.isInteger(gemBalance)
                                ? gemBalance
                                : gemBalance.toFixed(2)}</span>
                        </div>
                        <div className="w-48 h-10 bg-[#0A0E1A] rounded-full flex items-center px-1 space-x-2 outline outline-2 outline-[#374151]">
                            <div className="w-9 h-10 flex items-center justify-center">
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/uwPYNNRiavmZZ285SkzD5Z/diaomnd.png"
                                    alt="Diamond"
                                    className="w-[98px] h-[98px] object-contain"
                                />
                            </div>
                            <span className="ml-1 text-lg font-Inter font-bold">
                                {Number.isInteger(voucherBalance)
                                    ? voucherBalance
                                    : voucherBalance.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
