// app/students/[id]/page.tsx (ĐÃ SỬA)
import { BellRing, Bus, MapPin } from 'lucide-react'
import { createServerApi } from "@/lib/axiosServer";
import LiveTrackingMap from "@/components/parent/LiveTrackingMap";
import StudentInfoCard from '@/components/parent/StudentInfoCard'; 

const page = async ({ params }: any) => {
    const { id } = params
    const api = await createServerApi()

    // 1. Lấy thông tin học sinh (Giữ nguyên)
    const res = await api.get(`students/${id}`)
    const student = res.data

    // 2. === SỬA Ở ĐÂY ===
    // Gọi API mới để lấy dữ liệu chuyến đi, thay vì 'student_events'
    const res1 = await api.get(`students/${id}/assignment`)
    const assignmentData = res1.data // Đây là object từ 'route_stop_students' (hoặc null)

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
                    {/* 3. === SỬA Ở ĐÂY ===
                        Truyền object 'route' (bao gồm tất cả các trạm) vào bản đồ */}
                    <LiveTrackingMap 
                        pathRoute={assignmentData?.route_stop?.route} 
                    />
                </div>
            </section>

            <section className='w-1/4 mr-10 flex flex-col gap-7'>

                {/* 4. === SỬA Ở ĐÂY ===
                    Truyền prop 'assignment' (thay vì 'studentEvent') */}
                <StudentInfoCard
                    student={student}
                    assignment={assignmentData}
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