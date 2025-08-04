import React, from "react";

export const FlipCard = ({ logo, items, isSelected, onSelect }) => {

    const handleClickFlipCard = () => {
        onSelect();
    };

    return (
        <div
            className={`${
                isSelected ? "border-2 border-[#2CE0B8]" : "border-0"
            } flex items-center justify-center bg-[#374151] opacity-100 rounded-2xl min-w-[230px] h-[70vh] cursor-pointer`}
            onClick={handleClickFlipCard}
        >
            <div className="flex items-center justify-center">
                <img src={logo} alt="Cooky Cream Logo" className="w-40" />
            </div>
        </div>
    );
};
