import React, { useState } from 'react'
import { apiRequest } from '../services/api'
import { useGlobalContext } from '../context/GlobalContext'
const CookyShop = ({ logo, isMobile, refreshItems }) => {
    const [showButton, setShowButton] = useState(false)
    const { setCustomLogo } = useGlobalContext()
    const handleShowButton = () => {
        setShowButton(!showButton)
    }
    const handleSetAsLogo = async () => {
        try {
            const userId = localStorage.getItem('userId')
            if (userId) {
                // Make API call to set this logo as active
                const response = await apiRequest('/cookyshop/switch', 'POST', {
                    userId,
                    cookyShopId: logo.id,
                })
                if (response && response.imageLink) {
                    // Update the global context with the new logo
                    setCustomLogo(response.imageLink)
                    // Immediately refresh the Cooky Shop items to update UI
                    if (refreshItems) {
                        refreshItems()
                    }
                    // Show success alert
                    alert('Logo updated successfully!')
                }
            }
        } catch (error) {
            console.error('Error setting active logo:', error)
            alert('Failed to update logo. Please try again.')
        }
    }
    if (isMobile) {
        return (
            <>
                <div
                    key={logo.id}
                    className={`bg-[#374151] relative cursor-pointer w-28 h-28 rounded-xl shadow-md p-3 flex flex-col items-center justify-center min-h-[160px] min-w-[160px] ${logo.activeStatus ? 'border-2 border-[#2CE0B8]' : ''}`}
                    onMouseEnter={handleShowButton}
                    onMouseLeave={handleShowButton}
                >
                    <div className={'h-2/3 flex items-center justify-center'}>
                        <div className={''}>
                            <img
                                src={logo.imageLink}
                                alt={logo.name}
                                className={'w-full h-full'}
                            />
                        </div>
                    </div>
                    <div className={'h-1/5 flex flex-col justify-end'}>
                        <p className={'text-white font-semibold font-sm'}>{logo.name}</p>
                    </div>
                    {showButton && (
                        <div
                            className={
                                'w-full h-full flex rounded-xl justify-center items-center bg-[#0A0E1AC4]'
                            }
                            style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                            }}
                        >
                            <button
                                className={
                                    'lg:w-1/2 md:w-3/4 h-10 font-inter bg-blue-500 px-4 rounded-xl font-bold'
                                }
                                onClick={handleSetAsLogo}
                            >
                                Set as logo
                            </button>
                        </div>
                    )}
                </div>
            </>
        )
    }
    return (
        <>
            <div
                key={logo.id}
                className={`bg-[#1F2937] relative cursor-pointer lg:w-[20vw] lg:h-[42vh] md:w-[10vw] md:h-[30vh] rounded-xl shadow-md p-4 flex flex-col items-center justify-center min-h-[160px] min-w-[160px] ${logo.activeStatus ? 'border-2 border-[#2CE0B8]' : ''}`}
                onMouseEnter={handleShowButton}
                onMouseLeave={handleShowButton}
            >
                <div className={'h-2/3 flex items-center justify-center'}>
                    <div className={'w-auto h-auto max-w-full max-h-[26vh]'}>
                        <img
                            src={logo.imageLink}
                            alt={logo.name}
                            className={'w-full h-full object-contain'}
                        />
                    </div>
                </div>
                <div className={'h-1/5 flex flex-col justify-end'}>
                    <p className={'text-white font-semibold font-sm'}>{logo.name}</p>
                </div>
                {showButton && (
                    <div
                        className={
                            'w-full h-full flex rounded-xl justify-center items-center bg-[#0A0E1AC4]'
                        }
                        style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }}
                    >
                        <button
                            className={
                                'lg:w-1/2 md:w-3/4 h-10 font-inter bg-blue-500 lg:rounded-full md:rounded-xl font-bold'
                            }
                            onClick={handleSetAsLogo}
                        >
                            Set as logo
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}
export default CookyShop
