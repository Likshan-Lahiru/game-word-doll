import React from 'react'
export function WinningStatus() {
    return (

        <div className=" mb-7 text-center">

            <p className="font-['DM_Sans'] text-lg font-medium">You Won</p>
            <p className="flex items-center justify-center pt-0 gap-1">
                <span className="font-medium  mr-1 font-['DM_Sans'] text-lg">FREE</span>
                <img
                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                    alt="Coins"
                    className="w-4 h-4 mr-1"
                />
                <span className="font-['DM_Sans'] text-lg">50,000</span>
            </p>
        </div>
    )
}
