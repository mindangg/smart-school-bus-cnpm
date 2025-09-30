'use client'

import React, { useState } from 'react'

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (!text) return
    onSend(text)
    setText('')
  }

  return (
    <div className='flex gap-2 mt-2'>
      <input
        type='text'
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder='Nhập tin nhắn của bạn ở đây...'
        className='flex-1 border p-2 rounded'
      />
      <button onClick={handleSend} className='bg-blue-600 text-white px-4 rounded'>
        Gửi
      </button>
    </div>
  )
}

export default MessageInput