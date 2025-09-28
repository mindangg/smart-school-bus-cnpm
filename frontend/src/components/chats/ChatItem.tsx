import React from 'react'

const ChatItem = ({ chat, selected, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                selected ? 'bg-[#F0F9FFFF]' : 'hover:bg-gray-100'
            }`}
            >
            <img src={chat.avatar} alt='' className='w-10 h-10 rounded-full' />
            <div className='flex-1'>
                <div className='font-medium'>{chat.name}</div>
                <div className='text-sm text-gray-500 truncate'>{chat.lastMessage}</div>
            </div>
            <div className='text-xs text-gray-400'>{chat.time}</div>
        </div>
    )
}

export default ChatItem