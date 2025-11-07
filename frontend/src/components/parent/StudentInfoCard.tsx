// components/parent/StudentInfoCard.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import BusStopSelectionModal from './BusStopSelectionModal'
// Giả sử bạn có file helper để gọi API từ client
// import { createBrowserApi } from '@/lib/axiosBrowser'

const StudentInfoCard = ({ student, studentEvent }) => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Lấy thông tin một cách an toàn (giống như trong file page.js cũ của bạn)
    const busNumber = studentEvent?.route_assignments?.buses?.bus_number;
    // Đây là trạm dừng HIỆN TẠI HỌC SINH ĐĂNG KÝ (từ bảng students)
    const currentRegisteredStop = student.bus_stops?.address; 
    // Đây là trạm dừng CỦA CHUYẾN ĐI (từ bảng student_events)
    const pickupStop = studentEvent?.route_assignments?.routes?.route_stops[0]?.stop?.address;
    const destinationStop = studentEvent?.route_assignments?.routes?.route_stops[1]?.stop?.address;

    // Ưu tiên hiển thị trạm dừng đã đăng ký
    const displayStop = currentRegisteredStop || pickupStop;

    const handleSaveBusStop = async (newStopId) => {
        // const api = createBrowserApi(); // Khởi tạo API client
        console.log('Đang lưu trạm dừng mới:', newStopId, 'cho học sinh:', student.student_id);

        try {
            // Đây là nơi bạn gọi API PUT (từ backend đã thiết kế)
            const response = await fetch(`/api/students/${student.student_id}/stop`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // (Cần đính kèm token xác thực nếu có)
                    // 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ stopId: newStopId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lỗi khi lưu thay đổi');
            }

            // const updatedStudent = await response.json();
            console.log('Lưu thành công!');

            setIsModalOpen(false); // Đóng modal
            router.refresh(); // Tải lại Server Component để cập nhật dữ liệu mới
        } catch (error) {
            console.error('Lỗi khi lưu trạm dừng:', error);
            // (Hiển thị thông báo lỗi cho người dùng)
        }
    };

    return (
        <>
            <div className='flex flex-col gap-3 bg-white border border-gray-200 shadow-md rounded-xl p-5'>
                <h2 className='font-bold border-b border-gray-400 pb-3'>Trẻ & Thông tin Xe Buýt</h2>

                <p>Tên: <span className='font-semibold'>{student.full_name}</span></p>

                {studentEvent ? (
                    <>
                        <p>Xe buýt số: <span className='font-semibold'>{busNumber || 'N/A'}</span></p>
                        <p>Địa điểm đón: <span className='font-semibold'>{displayStop || 'N/A'}</span></p>
                        <p>Địa điểm đi: <span className='font-semibold'>{destinationStop || 'N/A'}</span></p>
                    </>
                ) : (
                    <p className="text-gray-600">Không tìm thấy thông tin chuyến đi.</p>
                )}

                {/* Nút "Thay đổi" để mở Modal */}
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-3 bg-blue-600 hover:bg-blue-700"
                >
                    Thay đổi điểm đón
                </Button>
            </div>

            {/* Component Modal: Chỉ hiển thị khi isModalOpen là true */}
            {isModalOpen && (
                <BusStopSelectionModal
                    studentId={student.student_id}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveBusStop} // Truyền hàm lưu
                />
            )}
        </>
    );
};

export default StudentInfoCard;