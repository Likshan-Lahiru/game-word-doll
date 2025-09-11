/*
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
*/
import React from 'react'
export function PrivacyTab() {
    return (
        <div className="space-y-6 ml-12 w-11/12">
            <h2 className="text-xl font-bold mb-4 mt-4">Privacy</h2>
            <div>
                <p className="text-sm  mb-14 mt-8">
                    We protect your privacy and personal information.
                    <a
                        href="/files/privacy-policy- COOKYCREAM.pdf"
                        className="text-[#006CB9] ml-1 underline"
                        target={"_blank"}
                    >
                        Click here
                    </a>{' '}
                    to learn more.
                </p>
            </div>
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Terms & Conditions</h3>
                <p className="text-sm mt-8">
                    Read terms and conditions.
                    <a href="#" className="text-[#006CB9] ml-1 underline">
                        Click here
                    </a>{' '}
                    to learn more.
                </p>
            </div>
        </div>
    )
}
