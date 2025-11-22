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

const BusStopSelectionModal = ({ studentId, onClose, onSave }: any) => {
    const [isLoading, setIsLoading] = useState(false);

    const [routes, setRoutes] = useState<any[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<string | undefined>(undefined);
    const [stops, setStops] = useState<any[]>([]);
    const [selectedStop, setSelectedStop] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const res = await api.get('/routes?type=assigned');
                setRoutes(res.data);
            } catch (error) {
                console.error("Lỗi tải tuyến đường:", error);
                setRoutes([]);
            }
        };
        fetchRoutes();
    }, []);

    useEffect(() => {
        if (!selectedRoute) {
            setStops([]);
            setSelectedStop(undefined); 
            return;
        }

        setSelectedStop(undefined);
        
        const fetchStops = async () => {
            try {
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
        if (!selectedStop || !selectedRoute) {
            alert("Vui lòng chọn đầy đủ tuyến đường và điểm đón.");
            return;
        }
        
        setIsLoading(true);
        try {
            await onSave(selectedStop, selectedRoute); 
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px]"> 
                <DialogHeader>
                    <DialogTitle>Thay đổi điểm đón</DialogTitle>
                    <DialogDescription>
                        Chọn tuyến đường và điểm đón mới.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="route" className="text-right font-semibold">1. Tuyến đường</Label>
                        
                        
                        <Select onValueChange={setSelectedRoute} value={selectedRoute}>
                            <SelectTrigger className="col-span-3 w-full">
                                <span className="truncate text-left w-full block">
                                    <SelectValue placeholder="Chọn tuyến đường" />
                                </span>
                            </SelectTrigger>
                            
                            
                            <SelectContent id="route" className="max-w-[400px]">
                                {routes.map(r => (
                                    <SelectItem key={r.route_id} value={String(r.route_id)}>
                                        <div className="truncate max-w-[350px]">
                                            {`Tuyến ${r.route_stops[0]?.stop?.address} -> ${
                                                r.route_stops[r.route_stops.length - 1]?.stop?.address
                                            }`}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stop" className="text-right font-semibold">2. Điểm đón</Label>
                        
                        
                        <Select onValueChange={setSelectedStop} value={selectedStop} disabled={!selectedRoute || stops.length === 0}>
                            <SelectTrigger className="col-span-3 w-full">
                                <span className="truncate text-left w-full block">
                                    <SelectValue placeholder="Chọn điểm đón cụ thể" />
                                </span>
                            </SelectTrigger>
                            
                            <SelectContent id="stop" className="max-w-[400px]">
                                {stops.map(s => (
                                    <SelectItem key={s.stop_id} value={String(s.stop_id)}>
                                        <div className="truncate max-w-[350px]">
                                            {s.address} (Thứ tự: {s.stop_order})
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>Hủy</Button>
                    <Button onClick={handleSubmit} disabled={!selectedStop || isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                        {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BusStopSelectionModal