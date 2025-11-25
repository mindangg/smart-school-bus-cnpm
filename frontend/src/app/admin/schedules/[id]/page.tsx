'use client';

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ArrowLeft, MapPin, Bus, User, Calendar} from "lucide-react";
import RouteMap from "@/components/admin/RouteMap";
import api from "@/lib/axios";
import DriverTrackingMap from "@/components/driver/DriverTrackingMap";
import LiveTrackingMap from "@/components/parent/LiveTrackingMap";
import AdminTrackingMap from "@/components/admin/paths/AdminTrackingMap";
import {useAuth} from "@/contexts/AuthContext";

interface Stop {
    stop_id: number;
    latitude: string;
    longitude: string;
    address: string;
    is_active: boolean;
}

interface RouteStop {
    route_stop_id: number;
    route_id: number;
    stop_id: number;
    stop_order: number;
    stop: Stop;
}

interface Route {
    route_id: number;
    route_type: string;
    start_time: string;
    route_stops: RouteStop[];
}

interface Schedule {
    assignment_id: number;
    route_id: number;
    driver_id: number;
    bus_id: number;
    is_active: boolean;
    created_at: string;
    users: {
        user_id: number;
        full_name: string;
        phone_number: string;
    };
    buses: {
        bus_id: number;
        bus_number: string;
    };
    routes: Route;
}

const ScheduleDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {user} = useAuth()

    const assignmentId = params.id as string;

    useEffect(() => {
        const fetchScheduleDetail = async () => {
            try {
                setIsLoading(true);
                const res = await api.get(`route_assignment/${assignmentId}`);
                setSchedule(res.data);
                console.log(res.data);
            } catch (error) {
                console.error("Failed to fetch schedule details", error);
                setError("Không thể tải thông tin phân công");
            } finally {
                setIsLoading(false);
            }
        };

        if (assignmentId) {
            fetchScheduleDetail();
        }
    }, [assignmentId]);

    const getRouteEndpoints = (routeStops: RouteStop[]) => {
        if (!routeStops || routeStops.length === 0) {
            return {start: 'N/A', end: 'N/A'};
        }

        const startStop = routeStops[0].stop;
        const endStop = routeStops[routeStops.length - 1].stop;

        return {
            start: startStop.address,
            end: endStop.address
        };
    };

    const getRouteTypeText = (routeType: string) => {
        switch (routeType) {
            case 'MORNING':
                return 'Buổi sáng';
            case 'AFTERNOON':
                return 'Buổi chiều';
            default:
                return routeType;
        }
    };

    const getRouteTypeColor = (routeType: string) => {
        switch (routeType) {
            case 'MORNING':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
            case 'AFTERNOON':
                return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
        }
    };

    const getStatusInfo = (isActive: boolean) => {
        return isActive
            ? {text: 'Đang hoạt động', color: 'bg-green-100 text-green-800'}
            : {text: 'Ngừng hoạt động', color: 'bg-red-100 text-red-800'};
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (error || !schedule) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-lg mb-4">⚠️</div>
                    <p className="text-gray-600 mb-4">{error || "Không tìm thấy thông tin phân công"}</p>
                    <Button onClick={() => router.push('/admin/schedules')}>
                        Quay lại danh sách
                    </Button>
                </div>
            </div>
        );
    }

    const endpoints = getRouteEndpoints(schedule.routes.route_stops);
    const statusInfo = getStatusInfo(schedule.is_active);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Chi Tiết Phân Công Tuyến Đường</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className={getRouteTypeColor(schedule.routes.route_type)}>
                                {getRouteTypeText(schedule.routes.route_type)}
                            </Badge>
                            <Badge variant="secondary" className={statusInfo.color}>
                                {statusInfo.text}
                            </Badge>
                            <span className="text-sm text-gray-500">
                                ID: {schedule.assignment_id}
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/admin/schedules')}
                    >
                        Quay Lại
                    </Button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-1 space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Calendar className="h-5 w-5"/>
                                    Thông Tin Tổng Quan
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600">ID Tuyến:</span>
                                        <span className="font-medium">{schedule.routes.route_id}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Giờ bắt đầu:</span>
                                        <span className="font-medium">{schedule.routes.start_time}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Số trạm dừng:</span>
                                        <span className="font-medium">{schedule.routes.route_stops.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">Ngày tạo:</span>
                                        <span className="font-medium">
                                            {new Date(schedule.created_at).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Bus className="h-5 w-5"/>
                                    Thông Tin Xe Buýt
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Biển số xe:</span>
                                        <span className="font-medium text-lg">{schedule.buses.bus_number}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">ID Xe:</span>
                                        <span className="font-medium">{schedule.bus_id}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <User className="h-5 w-5"/>
                                    Thông Tin Tài Xế
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Họ tên:</span>
                                        <span className="font-medium">{schedule.users.full_name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">SĐT:</span>
                                        <span className="font-medium">{schedule.users.phone_number}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">ID Tài xế:</span>
                                        <span className="font-medium">{schedule.driver_id}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <MapPin className="h-5 w-5"/>
                                    Lộ Trình
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                        <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Điểm đầu</p>
                                            <p className="font-medium text-gray-900">{endpoints.start}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                                        <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Điểm cuối</p>
                                            <p className="font-medium text-gray-900">{endpoints.end}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="xl:col-span-2 space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">Bản Đồ Tuyến Đường</h2>
                                </div>
                                {/*<RouteMap*/}
                                {/*    routeStops={schedule.routes.route_stops}*/}
                                {/*    routeType={schedule.routes.route_type}*/}
                                {/*/>*/}
                                <AdminTrackingMap pathRoute={schedule.routes} assignmentId={schedule.assignment_id} adminId={user.user_id} bus={String(schedule.bus_id)}/>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">Danh Sách Trạm Dừng</h2>
                                    <Badge variant="outline">
                                        {schedule.routes.route_stops.length} trạm
                                    </Badge>
                                </div>

                                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                                    <div className="divide-y divide-gray-100">
                                        {schedule.routes.route_stops
                                            .sort((a, b) => a.stop_order - b.stop_order)
                                            .map((rs, index) => (
                                                <div key={rs.route_stop_id}
                                                     className="p-4 hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-shrink-0">
                                                            <div
                                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                                                    index === 0 ? 'bg-green-500' :
                                                                        index === schedule.routes.route_stops.length - 1 ? 'bg-red-500' :
                                                                            'bg-blue-500'
                                                                }`}>
                                                                {rs.stop_order}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">{rs.stop.address}</p>
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                <Badge variant="outline" className="text-xs">
                                                                    ID: {rs.stop_id}
                                                                </Badge>
                                                                <Badge variant="outline" className="text-xs">
                                                                    Lat: {rs.stop.latitude}
                                                                </Badge>
                                                                <Badge variant="outline" className="text-xs">
                                                                    Lng: {rs.stop.longitude}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            {index === 0 && (
                                                                <Badge
                                                                    className="bg-green-100 text-green-800 hover:bg-green-100">
                                                                    Điểm đầu
                                                                </Badge>
                                                            )}
                                                            {index === schedule.routes.route_stops.length - 1 && (
                                                                <Badge
                                                                    className="bg-red-100 text-red-800 hover:bg-red-100">
                                                                    Điểm cuối
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleDetailPage;