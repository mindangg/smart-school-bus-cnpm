import {createServerApi} from "@/lib/axiosServer";
import DriverTrackingMap from "@/components/driver/DriverTrackingMap";


const today = new Date()

const day = String(today.getDate()).padStart(2, '0')
const month = String(today.getMonth() + 1).padStart(2, '0')
const year = today.getFullYear();
const weekday = today.toLocaleDateString('vi-VN', { weekday: 'long' })
const formattedDate = `${weekday}, ngày ${day} tháng ${month} năm ${year}`

const page = async () => {
    const api = await createServerApi()
    const res = await api.get('route_assignment/driver')
    const route_assignment = res.data

    const currentRoute = [
        { label: "Mã Xe Buýt", value: route_assignment[0]?.buses?.bus_number},
        {
            label: "Tuyến Đường",
            value: `${route_assignment[0]?.routes.route_stops[0]?.stop.address} → ${route_assignment[0]?.routes.route_stops[1]?.stop.address}`
        },
        {
            label: "Thời Gian Bắt Đầu Dự Kiến",
            value: `${route_assignment[0]?.routes.start_time} Sáng`
        },
        { label: "Thời Gian Kết Thúc Dự Kiến", value: "08:15 AM" }
    ]

    return (
        <main className='relative flex flex-col gap-6 bg-gray-50'>   
            <h1 className='text-2xl font-bold'>Bảng Điều Khiển Tài Xế - Lịch Trình Hôm Nay</h1>
            <p className='text-gray-700'>{formattedDate}</p>

            <section className='bg-white p-4 border border-gray-100 shadow-xs rounded-xl'>
                <h2 className='text-md font-bold mb-2'>Chi Tiết Tuyến Đường Hiện Tại</h2>
                <p className='text-[15px] md:text-[17px] text-gray-600 line-clamp-1'>
                    Thông tin chi tiết về tuyến đường được giao của bạn hôm nay.
                </p>
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
                <DriverTrackingMap pathRoute={route_assignment[0].routes} bus={route_assignment[0]?.buses?.bus_number}/>
            </section>
        </main>
    )
}

export default page