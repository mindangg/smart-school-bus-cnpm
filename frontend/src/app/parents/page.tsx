import { User } from 'lucide-react'
import React from 'react'

const page = () => {
    return (
        <main className='flex justify-center'>
            <section className='m-5 md:m-10 flex flex-col w-[700px] gap-5 bg-white p-8 border border-gray-200 shadow-sm rounded-2xl'>
                <div className='flex items-center gap-10 border-b border-gray-400 pb-3'>
                    <User className="w-15 h-15 shrink-0"/>
                    <div className='flex flex-col'>
                        <p className='text-md font-bold'>Email: mindang@gmail.com</p>
                        <p className='text-md'>Họ Tên: </p>
                    </div>
                </div>
                <div className='flex flex-col gap-5 justify-between w-full'>
                    <div className='flex justify-between w-full border-b border-gray-400 pb-4'>
                        <p className='font-bold'>Số Điện Thoại:</p>
                        <p>0901234567</p>
                    </div>
                    <div className='flex justify-between w-full border-b border-gray-400 pb-4'>
                        <p className='font-bold'>Vai Trò:</p>
                        <p>Phụ Huynh</p>
                    </div>
                    <div className='flex justify-between w-full border-b border-gray-400 pb-4'>
                        <p className='font-bold'>Địa Chỉ:</p>
                        <p>0901234567</p>
                    </div>
                </div>
            </section>  
        </main>
    )
}

export default page