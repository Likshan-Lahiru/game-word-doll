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
                <div className="flex-col flex justify-between relative bg-[#374151] rounded-2xl shadow-xl h-[85vh] w-1/4 text-center font-['DM_Sans']">
                    <div>
                        <p className={`text-[32px] font-bold mt-10 mb-5`}>Congratulations !</p>
                        { type === 'questionBlock' &&
                            <div className={"flex items-center justify-center"}>
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/ihjCiF28Ck9C1VuWkrRhxL/block.png"
                                    alt="Question Block"
                                    className="w-36 h-36"
                                />
                            </div>
                        }
                    </div>

                    <div className={`${type !== 'questionBlock' && 'gap-y-5'} flex flex-col justify-center text-white font-bold font-['DM_Sans']`}>
                        <p className="text-white text-[20px] font-bold text-center font-['DM_Sans']">You Win</p>
                        <div className={"flex gap-x-3 items-center justify-center"}>
                            <img
                                src={type === 'gemWin' || type === 'questionBlock' ? IMAGES.diamond : IMAGES.coin}
                                alt="Question Block"
                                className="w-6 h-6"
                            />
                            <p className={"text-[28px] font-bold"}>
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
