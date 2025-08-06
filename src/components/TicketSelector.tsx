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
        <div className="flex justify-center space-x-4 mb-6">
            {options.map((option) => (
                <div key={option.id} className="flex flex-col items-center">
                    <button
                        className={`cursor-pointer p-4 rounded-2xl ${selectedValue === option.value ? 'bg-[#3B82F6]' : 'bg-[#374151]'} w-24 h-12 flex items-center justify-center mt-6 relative ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#3B82F6]'}`}
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
                </div>
            ))}
        </div>
    )
}
