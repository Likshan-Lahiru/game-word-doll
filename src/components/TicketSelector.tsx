import React from 'react'
type TicketOption = {
    value: number
    label?: string
    id: string
}
type TicketSelectorProps = {
    options: TicketOption[]
    selectedValue: number
    onChange: (value: number) => void
    disabled?: boolean
}
export function TicketSelector({
                                   options,
                                   selectedValue,
                                   onChange,
                                   disabled = false,
                               }: TicketSelectorProps) {
    return (
        <div className="flex justify-center space-x-4 mb-2">
            {options.map((option) => (
                <>
                    <div key={option.id} className="flex flex-col items-center">
                        <button
                            className={`bg-[#374151] cursor-pointer p-4 rounded-2xl w-28 h-12 flex items-center justify-center mt-1 relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => !disabled && onChange(option.value)}
                            disabled={disabled}
                        >
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/65WCbcmf6dyyeqvjSAJHyp/fire.png"
                                alt="Ticket"
                                className="w-4 h-4 mr-2"
                            />
                            <span className="text-white text-lg font-semibold">
                                {option.label || option.value}
                            </span>
                        </button>

                        {/* Selected line */}
                        { selectedValue === option.value &&
                            <div className={"h-1 rounded-2xl w-16 bg-white mt-2"}></div>
                        }
                    </div>
                </>
            ))}
        </div>
    )
}
