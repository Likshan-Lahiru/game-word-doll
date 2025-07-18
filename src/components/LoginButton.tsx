import { useNavigate } from 'react-router-dom'

export function LoginButton() {
    const navigate = useNavigate()
    const isMobile = window.innerWidth <= 768

    return (
        <div className={`w-full flex justify-center ${isMobile ? 'pt-2 pb-4' : 'mb-12 pb-20 pt-4'}`}>
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
                    fontWeight: 600, // ← Valid: 100 to 900
                }}
            >
                LOG IN
            </button>
        </div>
    )
}
