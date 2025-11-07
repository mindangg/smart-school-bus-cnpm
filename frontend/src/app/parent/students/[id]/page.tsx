// app/students/[id]/page.js
import { BellRing, Bus, MapPin } from 'lucide-react'
import { createServerApi } from "@/lib/axiosServer";
import LiveTrackingMap from "@/components/parent/LiveTrackingMap";
import StudentInfoCard from '@/components/parent/StudentInfoCard'; // <-- 1. Import component mới

const page = async ({ params }) => {
    const { id } = params
    const api = await createServerApi()

    const res = await api.get(`/students/${id}`)
    const student = res.data

    const res1 = await api.get(`/student_events/student/${id}`)
    const student_event = res1.data

    // 2. Lấy sự kiện đầu tiên một cách an toàn
    const firstEvent = student_event?.length > 0 ? student_event[0] : null;

    return (
        <main className='flex gap-7 w-full'>
            <section className='w-3/4 border border-gray-200 shadow-xl rounded-2xl'>
                <div className='flex flex-col items-center'>
                    <div className='flex gap-3 items-center mt-2'>
                        <MapPin size={24} className="text-blue-600" />
                        <h1 className='text-xl font-bold'>Theo Dõi Thời Gian Thực</h1>
                    </div>
                    <p>Điều Khiển</p>
                </div>
                <div className="relative w-full h-full">
                    <LiveTrackingMap pathRoute={firstEvent?.route_assignments.routes} />
                </div>
            </section>

            <section className='w-1/4 mr-10 flex flex-col gap-7'>

                {/* 3. Thay thế toàn bộ <div> cũ bằng component mới */}
                <StudentInfoCard
                    student={student}
                    studentEvent={firstEvent}
                />

                {/* Phần thông báo giữ nguyên */}
                <div className='flex flex-col items-center gap-3 bg-white border border-gray-200 shadow-md rounded-xl pt-5'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <BellRing />
                            <h2 className='font-bold'>Thông báo</h2>
                        </div>
                        <p className='text-sm text-gray-700 text-center'>Xóa tất cả</p>
                    </div>
                    {/* ... (Các thông báo còn lại) ... */}
                    <div className='flex gap-3 items-center border-t border-gray-300 w-full p-4'>
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