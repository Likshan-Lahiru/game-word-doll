import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IMAGES } from '../constance/imagesLink'
import { useGlobalContext } from '../context/GlobalContext'
export function SplashScreen() {
    const navigate = useNavigate()
    const { customLogo } = useGlobalContext()
    // Use custom logo if available, otherwise use default
    const logoSrc =
        customLogo ||
        IMAGES.logo ||
        'https://uploadthingy.s3.us-west-1.amazonaws.com/aHvh5ZGXyWTcvnejs7Ut7X/cooky-cream.png'
    useEffect(() => {
        // Automatically navigate to home page after 1.5 seconds
        const timer = setTimeout(() => {
            navigate('/')
        }, 1500)
        // Clean up the timer if the component unmounts
        return () => clearTimeout(timer)
    }, [navigate])
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#1F2937]">
            <div className="flex flex-col items-center justify-center">
                <img src={logoSrc} alt="Cooky Cream Logo" className="w-64 h-auto" />
            </div>
        </div>
    )
}
