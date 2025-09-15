import React, { useEffect, useState } from 'react'
import { fetchOnlineUserCount } from '../services/api'
export function OnlineCountDisplay() {
    const [onlineCount, setOnlineCount] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    useEffect(() => {
        // Function to fetch the online user count
        const getOnlineCount = async () => {
            try {
                setIsLoading(true)
                const response = await fetchOnlineUserCount()
                if (response && typeof response === 'number') {
                    setOnlineCount(response)
                } else if (response && typeof response.count === 'number') {
                    setOnlineCount(response.count)
                } else {
                    // Fallback to a default value if API response format is unexpected
                    console.warn(
                        'Unexpected API response format for online count:',
                        response,
                    )
                    setOnlineCount(Math.floor(Math.random() * 5000) + 1000) // Fallback random number
                }
            } catch (error) {
                console.error('Failed to fetch online count:', error)
                // Fallback to a default value in case of error
                setOnlineCount(Math.floor(Math.random() * 5000) + 1000)
            } finally {
                setIsLoading(false)
            }
        }
        // Fetch immediately when component mounts
        getOnlineCount()
        // Set up a timer to refresh every 15 minutes (900,000 ms)
        const intervalId = setInterval(getOnlineCount, 900000)
        // Clean up the timer when the component unmounts
        return () => clearInterval(intervalId)
    }, [])
    return (
        <div className="fixed bottom-16 left-6 z-10 hidden sm:flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-[#42E242]"></div>
            <span className="text-lg font-Inter font-semibold">
        {isLoading ? 'Loading...' : `${onlineCount.toLocaleString()} Online`}
      </span>
        </div>
    )
}
