import React from "react";

export const FlipCard = ({ logo, items, isSelected, onSelect, isFlipped  }) => {

    const handleClickFlipCard = () => {
        onSelect();
    };

    return (
        <>
            <div
                className={`${
                    isSelected ? "border-2 border-[#2CE0B8]" : "border-0"
                } flex items-center justify-center bg-[#374151] opacity-100 rounded-2xl min-w-[230px] h-[70vh] cursor-pointer transition-transform duration-500 ${
                    isFlipped ? "transform transition-transform duration-700 rotate-y-180 transform-style-preserve-3d" : ""
                }`}
                onClick={handleClickFlipCard}
            >
                {/* Front */}
                <div className="flex items-center justify-center">
                    <img src={logo} alt="Cooky Cream Logo" className="w-40" />
                </div>

                {/* Back */}
                <div className={`bg-[#374151] absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center rounded-2xl`}>
                    <p className="text-white text-xl">Back Side</p>
                </div>
            </div>
        </>
    );
};
