import {useState} from "react";

const CookyShop = ({logo, isMobile}) => {
    const [showButton, setShowButton] = useState(false);

    const handleShowButton = () => {
        setShowButton(!showButton)
    }

    if (isMobile) {
        return (
            <>
                <div
                    key={logo.id}
                    className={`bg-[#374151] relative cursor-pointer w-28 h-28 rounded-xl shadow-md p-3 flex flex-col items-center justify-center min-h-[160px] min-w-[160px]`}
                    onMouseEnter={handleShowButton}
                    onMouseLeave={handleShowButton}
                >
                    <div className={"h-2/3 flex items-center justify-center"}>
                        <div className={""}
                        >
                            <img src={logo.image} alt={"logo"} className={"w-full h-full"}/>
                        </div>
                    </div>
                    <div className={"h-1/5 flex flex-col justify-end"}>
                        <p className={"text-white font-semibold font-sm"}>
                            {logo.title}
                        </p>
                    </div>
                    {showButton &&
                        <div className={"w-full h-full flex rounded-xl justify-center items-center bg-[#0A0E1AC4]"}
                             style={{
                                 position: "absolute",
                                 top: 0,
                                 bottom: 0,
                                 left: 0,
                                 right: 0,
                             }}
                        >
                            <button className={"lg:w-1/2 md:w-3/4 h-10 font-inter bg-blue-500 px-4 rounded-xl font-bold"}>Set as logo</button>
                        </div>
                    }
                </div>
            </>
        )
    }

    return(
        <>
            <div
                key={logo.id}
                className={`bg-[#1F2937] relative cursor-pointer lg:w-[20vw] lg:h-[42vh] md:w-[10vw] md:h-[30vh] rounded-xl shadow-md p-4 flex flex-col items-center justify-center min-h-[160px] min-w-[160px]`}
                onMouseEnter={handleShowButton}
                onMouseLeave={handleShowButton}
            >
                <div className={"h-2/3 flex items-center justify-center"}>
                    <div className={`
                                 ${logo.id === 1 && "h-[26vh] w-[17vw]"}
                                 ${logo.id === 2 && "h-[26vh] w-[12vw]"}
                                 ${logo.id === 3 && "h-[19vh] w-[12vw]"}
                                 ${logo.id === 4 && "h-[12vh] w-[12vw]"}
                                 ${logo.id === 5 && "h-[12vh] w-[12vw]"}
                                 ${logo.id === 6 && "h-[12vh] w-[12vw]"}
                                 ${logo.id === 7 && "h-[15vh] w-[12vw]"}
                                 ${logo.id === 8 && "h-[12vh] w-[12vw]"}
                                 ${logo.id === 9 && "h-[14vh] w-[12vw]"}
                     `}
                    >
                        <img src={logo.image} alt={"logo"} className={"w-full h-full"}/>
                    </div>
                </div>
                <div className={"h-1/5 flex flex-col justify-end"}>
                    <p className={"text-white font-semibold font-sm"}>
                        {logo.title}
                    </p>
                </div>
                {showButton &&
                    <div className={"w-full h-full flex rounded-xl justify-center items-center bg-[#0A0E1AC4]"}
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }}
                    >
                        <button className={"lg:w-1/2 md:w-3/4 h-10 font-inter bg-blue-500 lg:rounded-full md:rounded-xl font-bold"}>Set as logo</button>
                    </div>
                }
            </div>
        </>
    )
}

export default CookyShop;
