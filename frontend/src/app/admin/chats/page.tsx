'use client'

import ChatList from '@/components/admin/chats/ChatList'
import ChatWindow from '@/components/admin/chats/ChatWindow'
import { Input } from '@/components/ui/input'

import React, { useState } from 'react'

const Chats = () => {
    const [selectedChat, setSelectedChat] = useState(null)
    const [messages, setMessages] = useState([])

    const chats = [
        {
        id: 1,
        name: 'Nguyễn Văn An (Tài Xế)',
        avatar: '/avatar1.jpg',
        lastMessage: 'Vâng, đã nhận được...',
        time: '10:30 SA',
        },
        {
        id: 2,
        name: 'Phạm Thị Duyên (Phụ Huynh)',
        avatar: '/avatar2.jpg',
        lastMessage: 'Xe buýt của con tôi...',
        time: 'Hôm qua',
        },
    ]


    return (
        <section>
            <h1 className='text-xl font-bold mb-5'>Trung Tâm Tin Nhắn</h1>
            <div className='flex items-center w-full bg-white'>
                <ChatList chats={chats} selectedChat={selectedChat} onSelect={setSelectedChat} />
                <ChatWindow messages={messages}/>
            </div>
        </section>
    )
}

export default Chats