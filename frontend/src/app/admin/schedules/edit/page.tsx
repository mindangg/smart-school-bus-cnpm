import React from 'react'

const page = () => {
    return (
        <section>
            <h1 className='text-xl font-bold'>Chỉnh Sửa Tuyến Xe Buýt</h1>
            <section className='bg-white p-4 border border-gray-100 shadow-xs rounded-xl'>
                <h2 className='text-md font-bold'>Tổng Quan Chuyến Xe Buýt</h2>
                <div className='flex w-full flex-wrap'>
                    <div className='flex flex-col w-1/2 mt-2'>
                        <p className='text-md font-bold'>Mã Tuyến:</p>
                        <p className='text-md text-gray-600'>RT001</p>
                    </div>
                    <div className='flex flex-col w-1/2 mt-3'>
                        <p className='text-md font-bold'>Tên Tuyến:</p>
                        <p className='text-md text-gray-600'>Tuyến 01: Mỹ Đình - Bờ Hồ</p>
                    </div>
                    <div className='flex flex-col w-1/2 mt-2'>
                        <p className='text-md font-bold'>Tổng Số Điểm Dừng:</p>
                        <p className='text-md text-gray-600'>6</p>
                    </div>
                    <div className='flex flex-col w-1/2 mt-3'>
                        <p className='text-md font-bold'>Khoảng Cách:</p>
                        <p className='text-md text-gray-600'>12.5 km</p>
                    </div>
                </div>
            </section>
        </section>
    )
}

export default page