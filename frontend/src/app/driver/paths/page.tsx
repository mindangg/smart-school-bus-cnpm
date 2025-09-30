import StudentCard from '@/components/admin/StudentCard'
import Image from 'next/image'

const page = () => {
    return (
        <main className='relative top-20 flex flex-col gap-6 bg-gray-50 p-5'>   
            <h1 className='text-xl font-bold'>Bảng Điều Khiển Tài Xế - Lịch Trình Hôm Nay</h1>
            <p className='text-gray-600'>Thứ Ba, ngày 23 tháng 9 năm 2025</p>
            <section className='bg-white p-4 border border-gray-100 shadow-xs rounded-xl'>
                <h2 className='text-md font-bold'>Chi Tiết Tuyến Đường Hiện Tại</h2>
                <p className='text-gray-600'>Thông tin chi tiết về tuyến đường được giao của bạn hôm nay.</p>
                <div className='flex w-full flex-wrap'>
                    <div className='flex flex-col w-1/2 mt-2'>
                        <p className='text-md text-gray-600'>Mã Xe Buýt:</p>
                        <p className='text-md font-bold'>BUS-SSB-007</p>
                    </div>
                    <div className='flex flex-col w-1/2 mt-3'>
                        <p className='text-md text-gray-600'>Tên Tuyến Đường:</p>
                        <p className='text-md font-bold'>BUS-SSB-007</p>
                    </div>
                    <div className='flex flex-col w-1/2 mt-2'>
                        <p className='text-md text-gray-600'>Thời Gian Bắt Đầu Dự Kiến:</p>
                        <p className='text-md font-bold'>BUS-SSB-007</p>
                    </div>
                    <div className='flex flex-col w-1/2 mt-3'>
                        <p className='text-md text-gray-600'>Thời Gian Kết Thúc Dự Kiến:</p>
                        <p className='text-md font-bold'>BUS-SSB-007</p>
                    </div>
                </div>
            </section>
            <section>
                <h2 className='text-md font-bold'>Vị Trí Xe Buýt Thời Gian Thực</h2> 
                <Image 
                    src='/images/bus.png'
                    width={200}
                    height={200}
                    alt='ok'
                />
            </section>
<<<<<<< Updated upstream
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
=======
            
>>>>>>> Stashed changes
        </main>
    )
}

export default page