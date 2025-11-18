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
import api from '@/lib/axios'

const BusStopSelectionModal = ({ studentId, onClose, onSave }) => {
    const [isLoading, setIsLoading] = useState(false);

    // Dữ liệu cho 2 bước
    const [routes, setRoutes] = useState([]); // Dữ liệu Bước 1
    const [selectedRoute, setSelectedRoute] = useState(undefined); // Bước 1: Tuyến đã chọn
    const [stops, setStops] = useState([]); // Dữ liệu Bước 2
    const [selectedStop, setSelectedStop] = useState(undefined); // Bước 2: Trạm đã chọn

    
    // const fetchApi = async (url) => {
    //     const token = localStorage.getItem('authToken'); // (hoặc nơi bạn lưu token)
        
    //     const res = await fetch(url, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             ...(token && { 'Authorization': `Bearer ${token}` }),
    //         }
    //     });

    //     if (!res.ok) {
    //         const errorBody = await res.text();
    //         console.error(`API Error: ${res.status} ${res.statusText}`, errorBody);
    //         throw new Error(`Failed to fetch data. Status: ${res.status}`);
    //     }
        
    //     return res.json();
    // };

    // BƯỚC 1: Tải tất cả Tuyến đường đang hoạt động
    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                // 3. SỬA LẠI: Gọi bằng api.get (không có /api/)
                const res = await api.get('/routes');
                setRoutes(res.data || []);
            } catch (error) {
                console.error("Lỗi tải tuyến đường:", error);
                setRoutes([]);
            }
        };
        fetchRoutes();
    }, []);

    // BƯỚC 2: Tải Trạm dừng khi Tuyến đường thay đổi
    useEffect(() => {
        if (!selectedRoute) {
            setStops([]);
            setSelectedStop(undefined); // <-- THÊM DÒNG NÀY
            return;
        }

        setSelectedStop(undefined);
        
        const fetchStops = async () => {
            try {
                // 4. SỬA LẠI: Gọi bằng api.get (không có /api/)
                const res = await api.get(`/routes/${selectedRoute}/stops`);
                setStops(res.data || []);
            } catch (error) {
                console.error("Lỗi tải trạm dừng:", error);
                setStops([]);
            }
        };
        fetchStops();
    }, [selectedRoute]);


    const handleSubmit = async () => {
        if (!selectedStop || !selectedRoute) { // Đảm bảo đã chọn cả hai
            alert("Vui lòng chọn đầy đủ tuyến đường và điểm đón.");
            return;
        }
        
        setIsLoading(true);
        try {
            // SỬA Ở ĐÂY: Truyền cả 2 ID
            await onSave(selectedStop, selectedRoute); 
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