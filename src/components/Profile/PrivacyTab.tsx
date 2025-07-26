import React from 'react'
export function PrivacyTab() {
    return (
        <div className="space-y-6 w-11/12">
            <h2 className="text-xl font-bold mb-4">Privacy</h2>
            <div>
                <p className="text-sm  mb-2">
                    We protect your privacy and personal information.
                    <a href="#" className="text-[#006CB9] ml-1 hover:underline">
                        Click here
                    </a>{' '}
                    to learn more.
                </p>
            </div>
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Terms & Conditions</h3>
                <p className="text-sm ">
                    Read terms and conditions.
                    <a href="#" className="text-[#006CB9] ml-1 hover:underline">
                        Click here
                    </a>{' '}
                    to learn more.
                </p>
            </div>
        </div>
    )
}
