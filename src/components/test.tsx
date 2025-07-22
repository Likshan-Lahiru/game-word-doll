import React, { useState } from "react";
import { FaCoins } from "react-icons/fa"; // Example icon
import { FaTicketAlt } from "react-icons/fa"; // Example icon

export default function DualSelector() {
    const [selected, setSelected] = useState("gold");

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#232B36]">
            <div className="flex w-[90vw] max-w-4xl h-28 rounded-full border-4"
                 style={{
                     borderColor:
                         selected === "gold"
                             ? "#FDF222"
                             : selected === "entries"
                                 ? "#42E242"
                                 : "#3A4352",
                 }}
            >
                {/* Gold Side */}
                <div
                    className={`flex-1 flex items-center justify-end rounded-l-full transition-colors duration-200 cursor-pointer ${
                        selected === "gold" ? "bg-[#FFC000]" : "bg-[#0B0E17]"
                    }`}
                    onClick={() => setSelected("gold")}
                >
          <span
              className={`text-4xl font-bold mr-4 transition-colors duration-200 ${
                  selected === "gold" ? "text-[#FDF222]" : "text-white"
              }`}
          >
            124,205,000
          </span>
                    <span
                        className={`flex items-center justify-center w-24 h-24 rounded-full -mr-12 z-10 border-4 transition-colors duration-200 ${
                            selected === "gold"
                                ? "bg-[#FDF222] border-[#FDF222]"
                                : "bg-[#42E242] border-[#232B36]"
                        }`}
                    >
            <FaCoins
                className={`text-5xl ${
                    selected === "gold" ? "text-[#FFC000]" : "text-[#FFC000]"
                }`}
            />
          </span>
                </div>

                {/* Entries Side */}
                <div
                    className={`flex-1 flex items-center justify-start rounded-r-full transition-colors duration-200 cursor-pointer ${
                        selected === "entries" ? "bg-[#FFC000]" : "bg-[#0B0E17]"
                    }`}
                    onClick={() => setSelected("entries")}
                >
          <span
              className={`flex items-center justify-center w-24 h-24 rounded-full -ml-12 z-10 border-4 transition-colors duration-200 ${
                  selected === "entries"
                      ? "bg-[#42E242] border-[#42E242]"
                      : "bg-[#FDF222] border-[#232B36]"
              }`}
          >
            <FaTicketAlt
                className={`text-5xl ${
                    selected === "entries" ? "text-[#FFC000]" : "text-[#FFC000]"
                }`}
            />
          </span>
                    <span
                        className={`text-4xl font-bold ml-4 transition-colors duration-200 ${
                            selected === "entries" ? "text-[#42E242]" : "text-white"
                        }`}
                    >
            15.20
          </span>
                </div>
            </div>
        </div>
    );
}