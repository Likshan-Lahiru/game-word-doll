import React, {useEffect, useState} from "react";
import {IMAGES} from "../../constance/imagesLink.ts";

export const Loader = ({isLoading}) => {
    const [showLogo, setShowLogo] = useState(false);

    if (isLoading) {

        useEffect(() => {
            setShowLogo(true);

            const timer = setTimeout(() => {
                setShowLogo(false);
            }, 2000);

            return () => clearTimeout(timer);
        }, []);
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white items-center justify-center">
            { showLogo ?
                <img
                    src={IMAGES.logo}
                    alt="Cooky Cream Logo"
                    className="h-12 sm:h-16"
                />
                :
                <p className="text-xl">Loading...</p>
            }
        </div>
    );
}
