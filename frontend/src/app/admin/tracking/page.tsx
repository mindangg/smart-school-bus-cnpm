import Image from "next/image"

const Tracking = () => {
    return (
        <section className='bg-white p-4 border border-gray-100 shadow-xs rounded-xl cursor-pointer'>
            <h1 className='text-xl font-bold mb-2'>Chế Độ Xem Bản Đồ Trực Tiếp</h1>
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
    )
}

export default Tracking