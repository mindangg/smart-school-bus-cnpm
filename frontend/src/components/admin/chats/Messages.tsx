import React from 'react'

const Messages = ({ message }) => {
  return (
    <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`p-2 rounded-lg max-w-xs ${
          isAdmin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
        }`}
      >
        {message.text}
        <div className='text-xs mt-1 text-gray-400'>{message.time}</div>
      </div>
    </div>
  )
}

export default Messages