'use client';

// 1. QUAN TRỌNG: Phải có dòng này
import { useEffect, useState } from "react"; 
import RouteMap from "./RouteMap"; 

interface RouteDetailModalProps {
    routeId: number | null;
    isOpen: boolean;
    onClose: () => void;
}

// 2. Định nghĩa kiểu dữ liệu khớp với dữ liệu trả về từ Prisma (Backend)
interface RouteDetails {
    route_id: number;
    route_type: string;
    // Backend trả về mảng 'route_stops' (tên theo quan hệ DB)
    route_stops: {
        stop_order: number;
        // Thông tin chi tiết trạm nằm trong object 'stop'
        stop: {
            address: string;
            latitude: number;
            longitude: number;
        };
    }[];
    path_geometry: any; 
}

const RouteDetailModal = ({ routeId, isOpen, onClose }: RouteDetailModalProps) => {
    const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Tự động gọi API khi routeId thay đổi
    useEffect(() => {
        if (routeId && isOpen) {
            const fetchRouteDetails = async () => {
                setIsLoading(true);
                try {
                    // Lưu ý: Đảm bảo URL API này đúng với Backend của bạn
                    const res = await fetch(`http://localhost:4000/api/route_assignment/${routeId}`);
                    const data = await res.json();
                    
                    // console.log("Debug API Data:", data); // Bỏ comment để debug nếu cần
                    setRouteDetails(data);
                } catch (error) {
                    console.error("Failed to fetch route details", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchRouteDetails();
        }
    }, [routeId, isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
            onClick={onClose}
        >
            <div 
                className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {isLoading ? 'Đang tải...' : `Chi Tiết Tuyến: ${routeDetails?.route_type || '...'}`}
                    </h2>
                    <button onClick={onClose} className="text-2xl hover:text-red-500">&times;</button>
                </div>

                {/* Phần bản đồ */}
                <div className="h-[400px] w-full bg-gray-200 rounded border border-gray-300">
                    {isLoading && (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            Đang tải bản đồ...
                        </div>
                    )}
                    {!isLoading && routeDetails?.path_geometry && (
                        <RouteMap pathGeometry={routeDetails.path_geometry} />
                    )}
                </div>

                {/* Danh sách trạm dừng */}
                <div className="mt-4">
                    <h3 className="font-bold mb-2">Các trạm dừng:</h3>
                    <ul className="list-decimal list-inside max-h-40 overflow-y-auto bg-gray-50 p-2 rounded border border-gray-200">
                        {!isLoading && routeDetails?.route_stops && routeDetails.route_stops.length > 0 ? (
                            // Sắp xếp theo thứ tự stop_order trước khi map (cho chắc chắn)
                            routeDetails.route_stops
                                .sort((a, b) => a.stop_order - b.stop_order)
                                .map((rs) => (
                                    <li key={rs.stop_order} className="py-1 border-b border-gray-100 last:border-0">
                                        {rs.stop.address}
                                    </li>
                                ))
                        ) : (
                            !isLoading && <li className="text-gray-500 list-none">Không có dữ liệu trạm dừng.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RouteDetailModal;