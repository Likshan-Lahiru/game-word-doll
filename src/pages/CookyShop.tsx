import {useState} from "react";

const CookyShop = ({logo}) => {
    const [showButton, setShowButton] = useState(false);

    const handleShowButton = () => {
        setShowButton(!showButton)
    }

    return(
        <>
            <div
                key={logo.id}
                className={`bg-[#1F2937] relative cursor-pointer lg:w-[300px] lg:h-[300px] rounded-xl shadow-md p-4 flex flex-col items-center justify-center min-h-[160px] min-w-[160px]`}
                onMouseEnter={handleShowButton}
                onMouseLeave={handleShowButton}
            >
                <div className={"h-2/3 flex items-center justify-center"}>
                    <div className={`
                                 ${logo.id === 1 && "h-52 w-56"}
                                 ${logo.id === 2 && "h-48 w-44"}
                                 ${logo.id === 3 && "h-28 w-48"}
                                 ${logo.id === 4 && "h-24 w-48"}
                                 ${logo.id === 5 && "h-24 w-48"}
                                 ${logo.id === 6 && "h-24 w-44"}
                                 ${logo.id === 7 && "h-28 w-44"}
                                 ${logo.id === 8 ? "h-28" : "w-44"}
                                 ${logo.id === 9 ? "h-28" : "w-40"}
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
                        <button className={"w-1/2 h-10 font-inter bg-blue-500 rounded-full font-bold"}>Set as logo</button>
                    </div>
                }
            </div>
        </>
    )
}

export default CookyShop;
