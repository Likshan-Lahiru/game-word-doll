import {IMAGES} from "../../constance/imagesLink.ts";
import React from 'react'
interface InclusionsProps {
    id: number,
    name: string,
    instruction1: string,
    instruction2: string,
    instruction3: string,
    instruction4?: string,
}

const PackageInclusions = ({inclusions} : InclusionsProps) => {
    return(
        <>
            <div
                className={
                    "gap-y-2 font-inter mb-4 pt-5 pb-5 pr-3 pl-3 text-[15px] text-white " +
                    "bg-[#374151] sm:bg-[#1F2937] " + // mobile first, override from sm and up
                    "rounded-xl flex flex-col items-start justify-center"
                }
            >
                <div className={"flex gap-x-2"}>
                    <div className={"w-3 h-3"}></div>
                    <p
                        className={`font-bold
                                    ${inclusions.name === "Silver" ? "text-[#67768F]"
                            : inclusions.name === "Gold" ? "text-[#FFB302]"
                                : inclusions.name === "Diamond" ? "text-[#AB13F7]"
                                    : "text-white"
                        }`
                        }>
                        {inclusions.name}
                    </p>
                </div>

                <div className={"flex gap-x-2 items-center"}>
                    <img
                        src={IMAGES.checkMark}
                        className={"h-3 w-3"}
                        alt={"checkMark.png"}
                    />
                    <p>{inclusions.instruction1}</p>
                </div>

                <div className={"flex gap-x-2 items-center"}>
                    <img
                        src={IMAGES.checkMark}
                        className={"h-3 w-3"}
                        alt={"checkMark.png"}
                    />
                    <p>{inclusions.instruction2}</p>
                </div>

                <div className={"flex gap-x-2 items-center"}>
                    <img
                        src={IMAGES.checkMark}
                        className={"h-3 w-3"}
                        alt={"checkMark.png"}
                    />
                    <p>{inclusions.instruction3}</p>
                </div>

                {inclusions.instruction4 &&
                    <div className={"flex gap-x-2 items-center"}>
                        <img
                            src={IMAGES.checkMark}
                            className={"h-3 w-3"}
                            alt={"checkMark.png"}
                        />
                        <p>{inclusions.instruction4}</p>
                    </div>
                }
            </div>
        </>
    )
}

export default PackageInclusions;
