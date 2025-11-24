'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import BusStopSelectionModal from './BusStopSelectionModal'
import api from '@/lib/axios'

const StudentInfoCard = ({ student, assignment }: any) => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const route = assignment?.route_stop?.route;
    const bus = route?.buses;
    const studentStop = assignment?.route_stop?.stop;

    const destinationStop = route?.route_stops[route.route_stops.length - 1]?.stop;

    const handleSaveBusStop = async (newStopId: string, newRouteId: string) => {
        try {
            await api.put(`/students/${student.student_id}/stop`, {
                stopId: newStopId,
                routeId: newRouteId
            });

            await api.put(`student_events/stop_student`, {
                student_id: student.student_id,
                event_type: 'PICK UP'
            })

            setIsModalOpen(false);
            router.refresh();

        } catch (error) {
            console.error('Lỗi khi lưu trạm dừng:', error);
        }
    };

    return (
        <>
            <div className='flex flex-col gap-3 bg-white border border-gray-200 shadow-md rounded-xl p-5'>
                <h2 className='font-bold border-b border-gray-400 pb-3'>Trẻ & Thông tin Xe Buýt</h2>

                <p>Tên: <span className='font-semibold'>{student.full_name}</span></p>

                {assignment ? (
                    <>
                        <p>Xe buýt số: <span className='font-semibold'>{bus?.bus_number || 'N/A'}</span></p>
                        <p>Địa điểm đón: <span className='font-semibold'>{studentStop?.address || 'N/A'}</span></p>
                        <p>Địa điểm đi: <span className='font-semibold'>{destinationStop?.address || 'N/A'}</span></p>
                    </>
                ) : (
                    <p className="text-gray-600">Học sinh chưa đăng ký chuyến đi.</p>
                )}

                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-3 bg-blue-600 hover:bg-blue-700"
                >
                    Thay đổi điểm đón
                </Button>
            </div>

            {isModalOpen && (
                <BusStopSelectionModal
                    studentId={student.student_id}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveBusStop}
                />
            )}
        </>
    );
};

export default StudentInfoCard;