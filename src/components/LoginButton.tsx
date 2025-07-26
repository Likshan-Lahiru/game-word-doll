import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext'
export function LoginButton() {
    const navigate = useNavigate()
    const { isAuthenticated } = useGlobalContext()
    const isMobile = window.innerWidth <= 768
    // Don't render the button if user is authenticated
    if (isAuthenticated) {
        return null
    }
    return (
        <div
            className={`w-full flex justify-center ${isMobile ? 'pt-2 pb-4' : 'mb-12 pb-16 pt-4'}`}
        >
            <button
                onClick={() => navigate('/login')}
                style={{
                    backgroundColor: '#2D7FF0',
                    color: 'white',
                    fontSize: isMobile ? '14px' : '18px',
                    padding: isMobile ? '16px 40px' : '16px 40px',
                    borderRadius: '9999px',
                    width: isMobile ? '240px' : '240px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                }}
            >
                LOG IN
            </button>
        </div>
    )
}
