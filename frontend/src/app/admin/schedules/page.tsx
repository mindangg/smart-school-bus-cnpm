'use client'; // <-- Biến đây thành Client Component

import ScheduleCard from "@/components/admin/ScheduleCard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react"; // <-- Import useState, useEffect
import RouteDetailModal from "@/components/admin/RouteDetailModal"; // <-- (Sẽ tạo ở Bước 3)

// Định nghĩa kiểu dữ liệu cho lịch trình (nên tạo file riêng)
interface Schedule {
    assignment_id: number;
    route_id: number;
    bus_number: string;
    route_name: string;
    driver_name: string;
    start_time: string;
    status: string;
}

const Page = () => {
    // --- State cho component ---
    const [schedules, setSchedules] = useState<Schedule[]>([]); // State lưu danh sách
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);

    // --- Lấy dữ liệu khi component mount ---
    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                // Giả sử server backend chạy ở port 8000
                const res = await fetch('http://localhost:4000/api/route_assignment'); 
                const data = await res.json();
                setSchedules(data);
            } catch (error) {
                console.error("Failed to fetch schedules", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSchedules();
    }, []); // Chạy 1 lần

    // --- Hàm xử lý mở modal ---
    const handleViewDetails = (routeId: number) => {
        setSelectedRouteId(routeId);
        setIsModalOpen(true);
    };

    return (
        <section className='flex flex-col gap-5'>
            <h1 className='text-2xl font-bold'>Quản Lý Lịch Trình Xe Buýt</h1>
            <section>
                {/* ... ToggleGroup ... */}
            </section>
            <section>
                <h2 className='text-lg font-bold'>Lịch Trình Hàng Tuần Sắp Tới</h2>
                <div className="overflow-x-auto">
                    <div className="min-w-[900px]">
                        <div className="grid grid-cols-[3fr_4fr_4fr_3fr_2fr_2fr] py-6 text-center text-black border-b border-gray-300 font-bold">
                            <span>ID Xe Buýt</span>
                            <span>Tuyến</span>
                            <span>Tài Xế</span>
                            <span>Thời Gian</span>
                            <span>Trạng Thái</span>
                            <span>Hành Động</span>
                        </div>
                        
                        {/* --- Hiển thị dữ liệu động --- */}
                        {isLoading && <p className="text-center p-4">Đang tải...</p>}
                        {!isLoading && schedules.map((schedule) => (
                            <ScheduleCard 
                                key={schedule.assignment_id} 
                                schedule={schedule}
                                onViewDetails={handleViewDetails} // <-- Truyền hàm xử lý
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Component Modal --- */}
            <RouteDetailModal
                routeId={selectedRouteId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </section>
    );
};

export default Page;