import Image from "next/image"

const Paths = () => {
    return (
        <main className='relative top-20 flex flex-col gap-6 bg-gray-50 p-5'>   
            <h1 className='text-xl font-bold'>Bảng Điều Khiển Tài Xế - Lịch Trình Hôm Nay</h1>
            <p className="text-gray-500">Thứ Ba, ngày 23 tháng 9 năm 2025</p>
            <section className="bg-white">
                <h2 className='text-md font-bold'>Chi Tiết Tuyến Đường Hiện Tại</h2>
                <p>Thông tin chi tiết về tuyến đường được giao của bạn hôm nay.</p>
                <div>
                    
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
        </main>
    )
}

export default Paths