import {BellRing, Bus, MapPin} from 'lucide-react'
import {createServerApi} from "@/lib/axiosServer";
import LiveTrackingMap from "@/components/parent/LiveTrackingMap";

const page = async ({ params }: any) => {
    const { id }= params
    const api = await createServerApi()

    const res = await api.get(`/students/${id}`)
    const student = res.data

    const res1 = await api.get(`student_events/student/${id}`)
    const student_event = res1.data

    return (
        <main className='flex gap-7 w-full'>
            <section className='w-3/4 border border-gray-200 shadow-xl rounded-2xl'>
                <div className='flex flex-col items-center'>
                    <div className='flex gap-3 items-center mt-2'>
                        <MapPin size={24} className="text-blue-600"  />
                        <h1 className='text-xl font-bold'>Theo Dõi Thời Gian Thực</h1>
                    </div>
                    <p>Điều Khiển</p>
                </div>
                <div className="relative w-full h-full">
                    <LiveTrackingMap pathRoute={student_event[0].route_assignments.routes} />
                </div>
            </section>
            <section className='w-1/4 mr-10 flex flex-col gap-7'>
                <div className='flex flex-col gap-3 bg-white border border-gray-200 shadow-md rounded-xl p-5'>
                    <h2 className='font-bold border-b border-gray-400 pb-3'>Trẻ & Thông tin Xe Buýt</h2>
                    <p>Tên: <span className='font-semibold'>{student.full_name}</span></p>
                    <p>Xe buýt số: <span className='font-semibold'>
                        {student_event[0].route_assignments.buses.bus_number }
                    </span>
                    </p>
                    <p>Địa điểm đón <span className='font-semibold'>
                        {student_event[0].route_assignments.routes.route_stops[0].stop.address}
                    </span>
                    </p>
                    <p>Địa điểm đi: <span className='font-semibold'>
                        {student_event[0].route_assignments.routes.route_stops[1].stop.address}
                    </span>
                    </p>
                </div>

                <div className='flex flex-col items-center gap-3 bg-white border border-gray-200 shadow-md rounded-xl pt-5'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <BellRing />
                            <h2 className='font-bold'>Thông báo</h2>
                        </div>
                        
                        <p className='text-sm text-gray-700 text-center'>Xóa tất cả</p>
                    </div>

                    <div className='flex gap-3 items-center border-t border-gray-300 w-full p-4'>
                        <Bus />
                        <div>
                            <p className='text-xs font-bold text-gray-800'>Bus 101 for Jane is 5 minutes away.</p>
                            <p className='text-xs text-gray-500'>2 minutes ago</p>
                        </div>
                    </div>
                    <div className='flex gap-3 border-t border-gray-300 w-full p-3'>
                        <Bus />
                        <div>
                            <p className='text-xs font-bold text-gray-800'>Bus 101 for Jane is 5 minutes away.</p>
                            <p className='text-xs text-gray-500'>2 minutes ago</p>
                        </div>
                    </div>
                    <div className='flex gap-3 border-t border-gray-300 w-full p-3'>
                        <Bus />
                        <div>
                            <p className='text-xs font-bold text-gray-800'>Bus 101 for Jane is 5 minutes away.</p>
                            <p className='text-xs text-gray-500'>2 minutes ago</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default page