import Messages from './Messages'
import MessageInput from './MessageInput'

const ChatWindow = ({ messages, onSend }) => {
    return (
        <section className='w-2/3 p-3 flex flex-col flex-1'>
            <h2 className='text-md font-bold'>Nguyễn Văn An (Tài Xế)</h2>
            
            <div className='flex-1 overflow-y-auto space-y-2'>
                {messages.map(msg => (
                    <Messages key={msg.id} message={msg} />
                ))}
            </div>
            <MessageInput onSend={onSend} />
        </section>
    )
}

export default ChatWindow