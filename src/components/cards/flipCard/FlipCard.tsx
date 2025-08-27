import React from "react";
import {IMAGES} from "../../../constance/imagesLink.ts";

// interface FlipCardData {
//     logo: string;
//     items: {};
//     isSelected: boolean;
//     onSelect: () => void;
//     isFlipped: boolean;
// }

export const FlipCard = ({ logo, items, isSelected, onSelect, isFlipped, isMobile }) => {

    const handleClickFlipCard = () => {
        onSelect();
    };

    return (
        <>
            <div className={`${isMobile ? 'h-[35vh] w-[170px]' : 'h-[60vh] w-[230px]'} relative perspective-[1000px]`} onClick={handleClickFlipCard}>
                <div
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d rounded-2xl 
                    ${isFlipped ? "rotate-y-180" : ""} 
                    ${isSelected ? "border-2 border-[#2CE0B8]" : "border-0"}`}
                >
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-[#374151] rounded-2xl">
                        <img src={logo} alt="Cooky Cream Logo" className={`${isMobile ? 'w-32' : 'w-40'}`} />
                    </div>

                    {/* Back */}
                    <div className="absolute w-full font-inter h-full backface-hidden rotate-y-180 flex items-center justify-center bg-[#374151] rounded-2xl">
                        <div className={"flex flex-col h-full justify-between"}>
                            {/* Header */}
                            <div className={"flex justify-center"}>
                                <p className={`${isMobile ? '' : ''} lg:text-[24px] md:text-[28px] text-[20px] font-inter font-bold mt-10 mb-0`}>{items.name}</p>
                            </div>

                            {/* Body */}
                            <div className={"flex items-center justify-center"}>
                                <img
                                    src={items.image}
                                    alt="card image"
                                    className={`
                                    ${items.image === '/outofstock.png' && 'lg:h-36 md:h-36 lg:w-32'} 
                                    ${items.image === '/ant.png' && 'lg:h-44 md:h-44 lg:w-32'} 
                                    ${items.image === '/freeFlip.png' && 'lg:w-44 lg:h-40 md:w-36 md:h-36'}
                                    ${items.image === '/fortuneCooky.png' && 'lg:w-36 lg:h-36 md:w-36 md:h-36'}
                                    ${items.image === '/badCooky.png' && 'lg:w-40 lg:h-36 md:w-40 md:h-40'}
                                    lg:w-36 md:w-28 h-32`}
                                />
                            </div>

                            <div className={"mb-10"}>
                                { items.type === 'winImg' ?
                                    <>
                                        <p className={"text-center font-inter font-bold"}>You Win</p>
                                        <div className={"flex gap-x-3 items-center justify-center"}>
                                            <img
                                                src={IMAGES.diamond}
                                                alt="Question Block"
                                                className="w-5 h-5"
                                            />
                                            <p className={"text-[20px] lg:text-[22px] md:text-[22px] font-inter font-bold"}>
                                                6.37
                                            </p>
                                        </div>
                                    </>
                                    :
                                    <>
                                        {items.desc.split('\n').map((line, index) => (
                                            <p key={index} className={"text-center font-inter"}>{line}</p>
                                        ))}
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};