'use client';

import { useEffect, useState } from "react";
import RouteMap from "./RouteMap"; 

interface RouteDetailModalProps {
    routeId: number | null;
    isOpen: boolean;
    onClose: () => void;
}

// Định nghĩa kiểu dữ liệu cho chi tiết tuyến (từ API)
interface RouteDetails {
    route_id: number;
    route_type: string;
    stops: {
        address: string;
        order: number;
    }[];
    path_geometry: any; // Đây là GeoJSON
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
                    const res = await fetch(`http://localhost:4000/api/route_assignment/${routeId}`);
                    const data = await res.json();
                    setRouteDetails(data);
                } catch (error) {
                    console.error("Failed to fetch route details", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchRouteDetails();
        }
    }, [routeId, isOpen]); // Chạy lại khi 2 giá trị này thay đổi

    if (!isOpen) return null;

    return (
        // Lớp phủ (overlay)
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
            onClick={onClose} // Đóng khi bấm ra ngoài
        >
            {/* Nội dung Modal */}
            <div 
                className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-2xl"
                onClick={(e) => e.stopPropagation()} // Ngăn click bên trong làm đóng modal
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {isLoading ? 'Đang tải...' : `Chi Tiết Tuyến: ${routeDetails?.route_type}`}
                    </h2>
                    <button onClick={onClose} className="text-2xl">&times;</button>
                </div>

                {/* Phần bản đồ */}
                <div className="h-[400px] w-full bg-gray-200 rounded">
                    {isLoading && <p>Đang tải bản đồ...</p>}
                    {!isLoading && routeDetails?.path_geometry && (
                        <RouteMap pathGeometry={routeDetails.path_geometry} />
                    )}
                </div>

                {/* Danh sách trạm dừng */}
                <div className="mt-4">
                    <h3 className="font-bold">Các trạm dừng:</h3>
                    <ul className="list-decimal list-inside max-h-40 overflow-y-auto">
                        {!isLoading && routeDetails?.stops.map(stop => (
                            <li key={stop.order}>{stop.address}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RouteDetailModal;