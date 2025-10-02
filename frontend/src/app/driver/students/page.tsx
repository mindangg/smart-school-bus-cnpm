import React from 'react'
import StudentCard from '@/components/admin/StudentCard'

const page = () => {
  return (
    <div>
      <section className='bg-white p-4 border border-gray-100 shadow-xs rounded-xl'>
                <h2 className='text-md font-bold'>Đón & Trả Học Sinh</h2>
                <p className='text-gray-600'>Quản lý trạng thái học sinh cho tuyến đường hiện tại của bạn.</p>
                <div className='grid grid-cols-[4fr_5fr_4fr_3fr_2fr] py-6 text-center text-black border-b border-gray-300 font-bold'>
                    <span>Tên Học Sinh</span>
                    <span>Tên Điểm Dừng</span>
                    <span>Thời Gian</span>
                    <span>Trạng Thái</span>
                    <span>Hành Động</span>
                </div>
                <StudentCard />
                <StudentCard />
                <StudentCard />
            </section>     
    </div>
  )
}

export default page