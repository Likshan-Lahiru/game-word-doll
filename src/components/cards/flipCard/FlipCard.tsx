import React from "react";

export const FlipCard = ({ logo, items, isSelected, onSelect, isFlipped  }) => {

    const handleClickFlipCard = () => {
        onSelect();
    };

    return (
        <>
            <div className="relative w-[230px] h-[70vh] perspective-[1000px]" onClick={handleClickFlipCard}>
                <div
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d rounded-2xl ${isFlipped ? "rotate-y-180" : ""} ${isSelected ? "border-2 border-[#2CE0B8]" : "border-0"}`}
                >
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-[#374151] rounded-2xl">
                        <img src={logo} alt="Cooky Cream Logo" className="w-40" />
                    </div>

                    {/* Back */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center bg-[#374151] rounded-2xl">
                        <div className={"flex flex-col h-full justify-between"}>
                            {/* Header */}
                            <div className={"flex justify-center"}>
                                <p className={`lg:text-[30px] md:text-[28px] text-[23px] font-bold mt-10 mb-5`}>{items.label}</p>
                            </div>

                            {/* Body */}
                            <div className={"flex items-center justify-center"}>
                                <img
                                    src={items.image}
                                    alt="card image"
                                    className="lg:w-36 lg:h-36 md:h-28 md:w-28 w-28 h-28"
                                />
                            </div>

                            {/* Footer */}
                            <div className={"mb-5"}>
                                <p className={"w-[200px] h-auto"}>{items.desc}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
