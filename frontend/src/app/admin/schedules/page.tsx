'use client';

import {useEffect, useState} from "react";
import api from "@/lib/axios";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Ellipsis} from "lucide-react";
import {useRouter} from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";

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

const Page = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

    const fetchSchedules = async () => {
        try {
            const res = await api.get('route_assignment');
            const data: Schedule[] = res.data;
            setSchedules(data);
        } catch (error) {
            console.error("Failed to fetch schedules", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

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

    const handleViewDetails = (assignmentId: number) => {
        router.push(`/admin/schedules/${assignmentId}`);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await api.delete(`route_assignment/${selectedSchedule?.assignment_id}`);

            if (response.status !== 200 && response.status !== 204) {
                throw new Error('Failed to delete the route');
            }

            toast.success('Xóa lịch trình thành công');

            setShowDeleteDialog(false);
            await fetchSchedules()
        } catch (error) {
            console.error('Error deleting route:', error);
            toast.error('Đã xảy ra lỗi khi xóa lịch trình');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <section className='flex flex-col gap-5'>
            <h1 className='text-2xl font-bold'>Quản Lý Lịch Trình Xe Buýt</h1>

            <section>
                <h2 className='text-lg font-bold'>Danh Sách Phân Công</h2>
                <div className="overflow-x-auto">
                    <div className="min-w-[900px]">
                        <div
                            className="grid grid-cols-[1fr_3fr_3fr_2fr_2fr] py-6 text-center text-black border-b border-gray-300 font-bold">
                            <span>ID Tuyến</span>
                            <span>Điểm Đầu</span>
                            <span>Điểm Cuối</span>
                            <span>Loại Tuyến</span>
                            <span>Hành Động</span>
                        </div>

                        {isLoading && <p className="text-center p-4">Đang tải...</p>}

                        {!isLoading && schedules.map((schedule) => {
                            const endpoints = getRouteEndpoints(schedule.routes.route_stops);

                            return (
                                <div
                                    key={schedule.assignment_id}
                                    className="grid grid-cols-[1fr_3fr_3fr_2fr_2fr] py-4 text-center border-b border-gray-200 hover:bg-gray-50"
                                >
                                    <span className="font-medium">{schedule.routes.route_id}</span>
                                    <span className="text-center px-2">{endpoints.start}</span>
                                    <span className="text-center px-2">{endpoints.end}</span>
                                    <span>
                                        {schedule.routes.route_type === 'MORNING' ? 'Buổi sáng' :
                                            schedule.routes.route_type === 'AFTERNOON' ? 'Buổi chiều' :
                                                schedule.routes.route_type}
                                    </span>
                                    <span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger><Ellipsis/></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() =>
                                                    handleViewDetails(schedule.assignment_id)
                                                }>
                                                    Xem Chi Tiết
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedSchedule(schedule);
                                                        setShowDeleteDialog(true)
                                                    }}
                                                >
                                                    Xóa
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa lịch trình #{selectedSchedule?.assignment_id}?
                            Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="text-amber-600">
                                ⚠️
                            </div>
                            <div className="text-amber-800 text-sm">
                                <p className="font-medium">Lịch trình sẽ bị xóa vĩnh viễn</p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={isDeleting}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Đang xóa...
                                </>
                            ) : (
                                'Xóa lịch trình'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
};

export default Page;