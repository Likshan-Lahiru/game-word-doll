import {useState} from "react";

const ConvertToEntries = () => {

    const [entriesAmount, setEntriesAmount] = useState(120);

    const handleConvertNow = () => {

    }

    // Desktop view
    return (
        <>
            {/* Right content area - Updated to match the image exactly */}
            <div className="mt-14 flex-1 bg-[#374151] rounded-xl p-5 font-['Inter'] pr-24 pl-10">
                <h2 className="text-2xl font-medium mb-6 font-['Inter']">Convert Gems</h2>

                <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-x-2">
                        <p className="text-white mr-[83px]">Entries</p>
                        <p>:</p>
                        <p className="font-medium">5.60</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <p className="text-white">Convertible Gems</p>
                        <p className="">:</p>
                        <p className="font-medium">120</p>
                    </div>
                </div>

                <div className="flex max-[958px]:flex-col max-[958px]:space-y-2 max-[958px]:items-start items-center mb-0.5 space-x-4">
                    <p className="text-white text-lg font-['Inter']">Convert</p>

                    <div className="bg-white rounded-md px-4 py-2 flex items-center">
                        <input
                            type="number"
                            value={entriesAmount}
                            onChange={(e) => setEntriesAmount(Number(e.target.value))}
                            className="bg-transparent w-16 outline-none text-black text-md"
                        />
                        <span className="ml-1 font-['Inter'] text-black text-md">(${entriesAmount})</span>
                    </div>

                    <p className="text-white">gems to entries (1 Gem = 1 Entry)</p>
                </div>

                <div className="flex-1 flex justify-end mb-16">
                    <button
                        onClick={handleConvertNow}
                        className="md:mt-5 bg-[#2D7FF0] border-green-500 hover:bg-blue-600 w-52 text-white py-2 px-10 rounded-full font-medium"
                    >
                        Convert Now
                    </button>
                </div>

                <ul className="list-disc pl-5 space-y-4 mt-36 mb-5 font-['Inter']">
                    <li className="text-white font-inter font-thin">
                        Note : Once you convert gems into entries, they cannot be converted back.
                    </li>
                    <li className="text-white font-['Inter']">
                        Note : A minimum balance of 5 gems must remain in your account when converting.
                    </li>
                </ul>
            </div>
        </>
    )
}

export default ConvertToEntries;
