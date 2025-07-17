import React from 'react'
import { BalanceSelector } from './BalanceSelector'

export function StatusBar({ isMobile }: { isMobile?: boolean }) {
    return (
        <div className="p-2 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
            {isMobile ? (
                <>
                    {/* Mobile Balance Selector */}
                    <div className="w-full mb-2">
                        <BalanceSelector
                            onSelect={(type) => console.log(`Selected: ${type}`)}
                        />
                    </div>

                    {/* Mobile Heart & Diamond */}
                    <div className="flex justify-center space-x-3 mb-2">
                        <div className="w-36 h-10 bg-[#111827] rounded-full flex items-center px-4">
                            <div className="w-8 h-8 flex items-center justify-center">
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                                    alt="Heart"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="ml-1">0</span>
                        </div>
                        <div className="w-36 h-10 bg-[#111827] rounded-full flex items-center px-4">
                            <div className="w-8 h-8 flex items-center justify-center">
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/uwPYNNRiavmZZ285SkzD5Z/diaomnd.png"
                                    alt="Diamond"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="ml-1">0</span>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Desktop Online Count */}
                    <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">1,568 Online</span>
                    </div>

                    {/* Desktop Balance Selector */}
                    <div className="flex-1 max-w-md mx-auto px-4">
                        <BalanceSelector
                            onSelect={(type) => console.log(`Selected: ${type}`)}
                        />
                    </div>

                    {/* Desktop Heart & Diamond */}
                    <div className="flex flex-col space-y-1">
                        <div className="w-48 h-12 bg-[#111827] rounded-full flex items-center px-6">
                            <div className="w-7 h-7 flex items-center justify-center">
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                                    alt="Heart"
                                    className="w-14 h-28 object-contain"
                                />
                            </div>
                            <span className="ml-1">0</span>
                        </div>
                        <div className="w-48 h-12 bg-[#111827] rounded-full flex items-center px-6">
                            <div className="w-8 h-8 flex items-center justify-center">
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/uwPYNNRiavmZZ285SkzD5Z/diaomnd.png"
                                    alt="Diamond"
                                    className="w-14 h-28 object-contain"
                                />
                            </div>
                            <span className="ml-1">0</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
