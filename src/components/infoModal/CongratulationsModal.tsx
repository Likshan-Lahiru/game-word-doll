import React, {useEffect, useState} from "react";
import {IMAGES} from "../../constance/imagesLink.ts";

interface ModalProps {
    isOpen: boolean,
    modalType: string
}

export const CongratulationsModal = ({isOpen,modalType}: ModalProps) => {

    const [type, setModalType] = useState('');

    useEffect(() => {
        setModalType(modalType);
    },[])

    if (!isOpen) return null;

    return(
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center font-inter bg-[#1F2937E5]/80 font-['DM_Sans']">
                <div className="flex-col flex justify-between relative bg-[#374151] rounded-2xl shadow-xl lg:h-[85vh] md:h-[85vh] h-[72vh] lg:w-1/4 md:w-1/3 w-2/3 text-center">
                    <div>
                        <p className={`lg:text-[30px] md:text-[28px] text-[23px] font-bold mt-10 mb-5`}>Congratulations !</p>
                        { type === 'questionBlock' &&
                            <div className={"flex items-center justify-center"}>
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/ihjCiF28Ck9C1VuWkrRhxL/block.png"
                                    alt="Question Block"
                                    className="lg:w-36 lg:h-36 md:h-28 md:w-28 w-28 h-28"
                                />
                            </div>
                        }
                    </div>

                    <div className={`${type !== 'questionBlock' && 'gap-y-5'} flex flex-col justify-center text-white font-bold`}>
                        <p className="text-white text-[20px] font-bold text-center font-['DM_Sans']">You Win</p>
                        <div className={"flex gap-x-3 items-center justify-center"}>
                            <img
                                src={type === 'gemWin' || type === 'questionBlock' ? IMAGES.diamond : IMAGES.coin}
                                alt="Question Block"
                                className="w-7 h-7"
                            />
                            <p className={"text-[24px] lg:text-[28px] md:text-[28px] font-bold"}>
                                {type === 'questionBlock' ? '0.15' : type ===  'gemWin' ? '2' : '10,000,000'}
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
