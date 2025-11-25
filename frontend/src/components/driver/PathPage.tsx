import React from 'react';
import DriverTrackingMap from "@/components/driver/DriverTrackingMap";
import {createServerApi} from "@/lib/axiosServer";

const today = new Date()

const day = String(today.getDate()).padStart(2, '0')
const month = String(today.getMonth() + 1).padStart(2, '0')
const year = today.getFullYear();
const weekday = today.toLocaleDateString('vi-VN', { weekday: 'long' })
const formattedDate = `${weekday}, ngày ${day} tháng ${month} năm ${year}`

const PathPage = async ({route_assignment} : any) => {
    const api = await createServerApi()

    const fetchTotalDuration = async (route: any) => {
        const requests = route.route_stops.slice(0, -1).map((stop: any, i: number) => {
            const current = stop.stop;
            const next = route.route_stops[i + 1].stop;
            return api.get("routes/direction_full", {
                params: {
                    start: `${current.longitude},${current.latitude}`,
                    end: `${next.longitude},${next.latitude}`,
                },
            });
        });

        const results = await Promise.all(requests);
        return results.reduce((sum, res) => sum + (res.data.duration || 0), 0);
    }

    const calculateArrivalTime = (startTimeStr: any, durationSeconds: any) => {
        const [h, m] = startTimeStr.split(":").map(Number);
        const date = new Date();

        date.setHours(h, m, 0, 0);
        date.setMinutes(date.getMinutes() + Math.round(durationSeconds / 60));

        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    }

    const formatTimeWithPeriod = (timeStr: string) => {
        if (!timeStr) return "";

        const [hStr, mStr] = timeStr.split(":");
        const h = parseInt(hStr, 10);
        const m = parseInt(mStr || "0", 10);

        if (isNaN(h) || isNaN(m)) return timeStr;

        const period = h >= 12 ? "Chiều" : "Sáng";
        const hour12 = h % 12 === 0 ? 12 : h % 12;

        const hourStr = hour12.toString().padStart(2, "0");
        const minuteStr = m.toString().padStart(2, "0");

        return `${hourStr}:${minuteStr} ${period}`;
    }

    const route = route_assignment[0].routes;
    const totalDuration = await fetchTotalDuration(route);
    const arrivalTime = calculateArrivalTime(route.start_time, totalDuration);

    const currentRoute = [
        { label: "Mã Xe Buýt", value: route_assignment[0]?.buses?.bus_number},
        {
            label: "Tuyến Đường",
            value: `${route_assignment[0]?.routes.route_stops[0]?.stop.address} → ${route_assignment[0]?.routes.route_stops[1]?.stop.address}`
        },
        {
            label: "Thời Gian Bắt Đầu Dự Kiến",
            value: formatTimeWithPeriod(route_assignment[0]?.routes.start_time)
        },
        {
            label: "Thời Gian Kết Thúc Dự Kiến",
            value: formatTimeWithPeriod(arrivalTime)
        }
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
                    {currentRoute.map((item: any, index: number) => (
                        <div key={index} className="flex flex-col w-1/2 mt-2">
                            <p className="text-md text-gray-600">{item.label}:</p>
                            <p className="text-md font-bold line-clamp-1">{item.value}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section className='bg-white p-4 border border-gray-100 shadow-xs rounded-xl cursor-pointer'>
                <h2 className='text-md font-bold mb-2'>Vị Trí Xe Buýt Thời Gian Thực</h2>
                <DriverTrackingMap pathRoute={route} bus={route_assignment[0]?.buses?.bus_number} assignmentId={route_assignment[0].assignment_id} driverId={route_assignment[0].driver_id}/>
            </section>

        </main>
    );
};

export default PathPage;