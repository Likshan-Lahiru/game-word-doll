import React from "react";
import {IMAGES} from "../../constance/imagesLink.ts";

interface ModalProps {
    isOpen: boolean,
}

export const FortuneCookyModal = ({isOpen}: ModalProps) => {

    if (!isOpen) return null;

    return(
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center font-inter bg-[#1F2937E5]/80">
                <div className="flex-col flex justify-between relative bg-[#374151] rounded-2xl shadow-xl lg:h-[85vh] md:h-[85vh] h-[72vh] lg:w-1/4 md:w-1/3 w-2/3 text-center font-['DM_Sans']">
                    <div>
                        <p className={`lg:text-[30px] md:text-[28px] text-[23px] font-bold mt-10 mb-5`}>Fortune Cooky !</p>
                            <div className={"flex items-center justify-center"}>
                                <img
                                    src={IMAGES.fortuneCooky}
                                    alt="fortune Cooky"
                                    className="lg:w-[180px] lg:h-[180px] md:w-[150px] md:h-[150px] w-36 h-36"
                                />
                            </div>
                    </div>

                    <div className={`flex flex-col justify-center text-white font-bold font-['DM_Sans']`}>
                        <p className="text-white text-[20px] font-bold text-center font-['DM_Sans']">You Win</p>
                        <div className={"flex gap-x-3 items-center justify-center"}>
                            <img
                                src={IMAGES.diamond}
                                alt="Question Block"
                                className="w-7 h-7"
                            />
                            <p className={"text-[24px] lg:text-[28px] md:text-[28px] font-bold"}>
                                6.37
                            </p>
                        </div>
                    </div>

                    <div className={"flex h-28 justify-center p-6 pb-8 mb-5"}>
                        <button className={"bg-[#3B82F6] w-3/4 h-full rounded-xl text-2xl"}>Collect</button>
                    </div>
                </div>
            </div>
        </>
    )
}
