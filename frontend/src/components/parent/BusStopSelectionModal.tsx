// components/parent/BusStopSelectionModal.js
'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const BusStopSelectionModal = ({ studentId, onClose, onSave }) => {
    const [isLoading, setIsLoading] = useState(false);

    // Dữ liệu cho 2 bước
    const [routes, setRoutes] = useState([]); // Dữ liệu Bước 1
    const [selectedRoute, setSelectedRoute] = useState(undefined); // Bước 1: Tuyến đã chọn
    const [stops, setStops] = useState([]); // Dữ liệu Bước 2
    const [selectedStop, setSelectedStop] = useState(undefined); // Bước 2: Trạm đã chọn

    // Hàm gọi API (giữ nguyên)
    const fetchApi = async (url) => {
        const token = localStorage.getItem('authToken'); // (hoặc nơi bạn lưu token)
        
        const res = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            }
        });

        if (!res.ok) {
            const errorBody = await res.text();
            console.error(`API Error: ${res.status} ${res.statusText}`, errorBody);
            throw new Error(`Failed to fetch data. Status: ${res.status}`);
        }
        
        return res.json();
    };

    // BƯỚC 1: Tải tất cả Tuyến đường đang hoạt động
    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                // Gọi API 1: GET /api/routes (Không cần filter)
                const data = await fetchApi(`/api/routes`);
                setRoutes(data || []);
            } catch (error) {
                console.error("Lỗi tải tuyến đường:", error);
                setRoutes([]);
            }
        };
        fetchRoutes();
    }, []); // Chỉ chạy 1 lần khi modal mở

    // BƯỚC 2: Tải Trạm dừng khi Tuyến đường thay đổi
    useEffect(() => {
        if (!selectedRoute) {
            setStops([]);
            setSelectedStop(undefined);
            return;
        }
        const fetchStops = async () => {
            try {
                // Gọi API 2: GET /api/routes/:routeId/stops
                const data = await fetchApi(`/api/routes/${selectedRoute}/stops`);
                setStops(data || []);
            } catch (error) {
                console.error("Lỗi tải trạm dừng:", error);
                setStops([]);
            }
        };
        fetchStops();
    }, [selectedRoute]); // Chạy lại khi selectedRoute thay đổi


    const handleSubmit = async () => {
        if (!selectedStop) return;
        setIsLoading(true);
        try {
            await onSave(selectedStop); 
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Thay đổi điểm đón</DialogTitle>
                    <DialogDescription>
                        Chọn tuyến đường và điểm đón mới.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">

                    {/* BƯỚC 1: Chọn Tuyến đường */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="route" className="text-right">1. Tuyến đường</Label>
                        <Select onValueChange={setSelectedRoute} value={selectedRoute}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn tuyến đường" />
                            </SelectTrigger>
                            <SelectContent id="route">
                                {routes.map(r => (
                                    <SelectItem key={r.route_id} value={String(r.route_id)}>
                                        {r.name || `Tuyến ${r.route_id} (${r.route_type})`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* BƯỚC 2: Chọn Điểm đón */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stop" className="text-right">2. Điểm đón</Label>
                        <Select onValueChange={setSelectedStop} value={selectedStop} disabled={!selectedRoute || stops.length === 0}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn điểm đón cụ thể" />
                            </SelectTrigger>
                            <SelectContent id="stop">
                                {stops.map(s => (
                                    <SelectItem key={s.stop_id} value={String(s.stop_id)}>
                                        {s.address} (Thứ tự: {s.stop_order})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>Hủy</Button>
                    <Button onClick={handleSubmit} disabled={!selectedStop || isLoading}>
                        {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BusStopSelectionModal