import React from 'react'

interface ControlCardProps {
    title: string
    icon: React.ReactNode
}

const ControlCards = ({ title, icon } : ControlCardProps) => {
    return (
        <div className='w-1/4 border border-gray-200 shadow-md rounded-lg p-5 flex flex-col gap-2 bg-white'>
            <div className='flex items-center justify-between'>
                <p className='text-md'>{title}</p>
                {icon}
            </div>
            <p className='text-4xl font-bold'>25</p>
        </div>
    )
}

export default ControlCards