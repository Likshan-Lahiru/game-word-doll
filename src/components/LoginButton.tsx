import { useNavigate } from 'react-router-dom'
export function LoginButton() {
    const navigate = useNavigate()
    const isMobile = window.innerWidth <= 768
    return (
        <div className={`w-full flex justify-center ${isMobile ? 'py-2' : 'py-6'}`}>
            <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl py-3 px-16 rounded-full mx-auto transition-colors"
                onClick={() => navigate('/login')}
            >
                {isMobile ? 'LOG IN' : 'Log in'}
            </button>
        </div>
    )
}
