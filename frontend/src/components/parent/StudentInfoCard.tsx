// components/parent/StudentInfoCard.tsx (ĐÃ SỬA)
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import BusStopSelectionModal from './BusStopSelectionModal'
import api from '@/lib/axios'

// 1. === SỬA Ở ĐÂY ===
//    Đổi tên prop từ 'studentEvent' thành 'assignment'
const StudentInfoCard = ({ student, assignment }: any) => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 2. === SỬA Ở ĐÂY ===
    //    Cập nhật logic để đọc từ object 'assignment' mới
    const route = assignment?.route_stop?.route;
    const bus = route?.buses; // Lấy xe buýt từ tuyến
    const studentStop = assignment?.route_stop?.stop; // Đây là trạm đón CỦA HỌC SINH
    
    // Lấy trạm cuối cùng (điểm đến) từ danh sách TẤT CẢ các trạm của tuyến
    const destinationStop = route?.route_stops[route.route_stops.length - 1]?.stop;


    // Hàm 'handleSaveBusStop' bạn cung cấp đã chính xác (gửi cả routeId và stopId)
    // nên chúng ta giữ nguyên nó.
    const handleSaveBusStop = async (newStopId: string, newRouteId: string) => {
        console.log('Đang lưu trạm dừng mới:', newStopId, 'cho tuyến:', newRouteId);
        try {
            // 2. SỬA LẠI: Dùng api.put (không có /api/)
            await api.put(`/students/${student.student_id}/stop`, { 
                stopId: newStopId,
                routeId: newRouteId 
            });

            console.log('Lưu thành công!');
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

                {/* 3. === SỬA Ở ĐÂY ===
                    Kiểm tra 'assignment' và dùng các biến mới */}
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