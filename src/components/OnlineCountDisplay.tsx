import React from 'react'
export function OnlineCountDisplay() {
    return (
        <div className="fixed bottom-20 left-6 z-10 hidden sm:flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-[#42E242]"></div>
            <span className="text-lg font-Inter font-semibold">1,568 Online</span>
        </div>
    )
}
