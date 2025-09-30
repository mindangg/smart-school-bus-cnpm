import { Search } from 'lucide-react'
import ChatItem from './ChatItem'

const ChatList = ({ chats, selectedChat, onSelect }) => {
  return (
    <section className='w-1/3 p-3 flex flex-col gap-5 border-r border-gray-200'>
        <h2 className='text-md font-bold'>Trò Chuyện</h2>
        <div className='relative border border-gray-200 rounded-lg flex items-center gap-2 px-2 py-1 h-fit'>
            <Search className='w-4 h-4'/>
            <input 
                placeholder='Tìm kiếm cuộc trò chuyện...'
                className='outline-none'
                // value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <div className='flex flex-col gap-2'>
          {chats.map(chat => (
            <ChatItem
              key={chat.id}
              chat={chat}
              selected={selectedChat?.id === chat.id}
              onClick={() => onSelect(chat)}
            />
          ))}
        </div>
    </section>
  )
}

export default ChatList