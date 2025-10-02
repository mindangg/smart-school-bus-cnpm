import Image from 'next/image'

const currentRoute = [
    { label: "Mã Xe Buýt", value: "BUS-SSB-007" },
    { label: "Tên Tuyến Đường", value: "Tuyến Số 3: Bến xe Miền Đông → SGU" },
    { label: "Thời Gian Bắt Đầu Dự Kiến", value: "07:30 AM" },
    { label: "Thời Gian Kết Thúc Dự Kiến", value: "08:15 AM" }
];

const page = () => {
    return (
        <main className='relative flex flex-col gap-6 bg-gray-50'>   
            <h1 className='text-2xl sm:text-4xl font-bold'>Bảng Điều Khiển Tài Xế - Lịch Trình Hôm Nay</h1>
            <p className='text-gray-600'>Thứ Ba, ngày 23 tháng 9 năm 2025</p>
            <section className='bg-white p-4 border border-gray-100 shadow-xs rounded-xl'>
                <h2 className='text-md font-bold mb-2'>Chi Tiết Tuyến Đường Hiện Tại</h2>
                <p className='text-[15px] md:text-[17px] text-gray-600 line-clamp-1'>Thông tin chi tiết về tuyến đường được giao của bạn hôm nay.</p>
                <div className="flex w-full flex-wrap">
                {currentRoute.map((item, index) => (
                <div key={index} className="flex flex-col w-1/2 mt-2">
                    <p className="text-md text-gray-600">{item.label}:</p>
                    <p className="text-md font-bold line-clamp-1">{item.value}</p>
                </div>
                ))}
                </div>
            </section>
            <section className='bg-white p-4 border border-gray-100 shadow-xs rounded-xl cursor-pointer'>
                <h2 className='text-md font-bold mb-2'>Vị Trí Xe Buýt Thời Gian Thực</h2> 
                <div className="relative w-full h-[500px] rounded-xl overflow-hidden mt-2">
                <Image
                    src="/images/bus.png"
                    alt="Realtime Bus Location"
                    fill
                    className="object-cover"
                />
                </div>
            </section>
        </main>
    )
}

export default page