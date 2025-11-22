import { BellRing, Bus, MapPin } from 'lucide-react'
import { createServerApi } from "@/lib/axiosServer";
import LiveTrackingMap from "@/components/parent/LiveTrackingMap";
import StudentInfoCard from '@/components/parent/StudentInfoCard'; 
import NotificationList from '@/components/parent/NotificationList';

const page = async ({ params }: any) => {
    const { id } = await params
    const api = await createServerApi()

    const res = await api.get(`students/${id}`)
    const student = res.data

    const res1 = await api.get(`students/${id}/assignment`)
    const assignmentData = res1.data

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
                    <LiveTrackingMap 
                        pathRoute={assignmentData?.route_stop?.route} 
                    />
                </div>
            </section>

            <section className='w-1/4 mr-10 flex flex-col gap-6 h-full'>
              
                <div>
                    <StudentInfoCard
                        student={student}
                        assignment={assignmentData}
                    />
                </div>

                <div className="flex-1 overflow-hidden">
                    <NotificationList studentId={Number(id)} />
                </div>
            </section>
        </main>
    )
}

export default page