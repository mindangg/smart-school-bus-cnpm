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

    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(undefined);
    const [stops, setStops] = useState([]);
    const [selectedStop, setSelectedStop] = useState(undefined);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const res = await api.get('/routes');
                setRoutes(res.data);
                console.log(res.data);
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Thay đổi điểm đón</DialogTitle>
                    <DialogDescription>
                        Chọn tuyến đường và điểm đón mới.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="route" className="text-right">1. Tuyến đường</Label>
                        <Select onValueChange={setSelectedRoute} value={selectedRoute}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn tuyến đường" />
                            </SelectTrigger>
                            <SelectContent id="route">
                                {routes.map(r => (
                                    <SelectItem key={r.route_id} value={String(r.route_id)}>
                                        {`Tuyến ${r.route_stops[0]?.stop?.address} -> ${
                                            r.route_stops[r.route_stops.length - 1]?.stop?.address
                                        }`}
                                    </SelectItem>
                                ))}

                            </SelectContent>
                        </Select>
                    </div>

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