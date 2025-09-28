'use client'

import ChatList from '@/components/chats/ChatList'
import ChatWindow from '@/components/chats/ChatWindow'
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
        <main className='relative top-20 flex flex-col gap-6 bg-gray-50 p-5'>
            <h1 className='text-xl font-bold'>Trung Tâm Tin Nhắn</h1>
            <section className='flex items-center w-full bg-white'>
                <ChatList chats={chats} selectedChat={selectedChat} onSelect={setSelectedChat} />
                <ChatWindow messages={messages}/>
            </section>
        </main>
    )
}

export default Chats