import React from 'react'
type TicketOption = {
    value: number
    label?: string
}
type TicketSelectorProps = {
    options: TicketOption[]
    selectedValue: number
    onChange: (value: number) => void
}
export function TicketSelector({
                                   options,
                                   selectedValue,
                                   onChange,
                               }: TicketSelectorProps) {
    return (
        <div className="w-full max-w-md flex justify-between mb-5">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`flex-1 py-1 px-2 h-12 bg-[#374151] rounded-2xl flex items-center justify-center mx-1 relative ${selectedValue === option.value ? 'font-bold' : ''}`}
                >
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/65WCbcmf6dyyeqvjSAJHyp/fire.png"
                        alt="Ticket"
                        className="w-6 h-6 mr-2"
                    />
                    <span className="text-lg font-[Inter]">
                            {option.label || option.value}
                     </span>
                    {selectedValue === option.value && (
                        <div className="absolute -bottom-3 left-0 right-0 h-1 mr-5 ml-5 bg-white rounded-full"></div>
                    )}
                </button>
            ))}
        </div>
    )
}
