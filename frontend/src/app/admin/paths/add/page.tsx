'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import api from "@/lib/axios";
import {toast} from "sonner";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'your-mapbox-token';

interface BusStop {
    stop_id: number;
    latitude: number;
    longitude: number;
    address: string;
    is_active: boolean;
}

interface RouteStop {
    stop_id: number;
    stop_order: number;
}

interface NewRouteData {
    start_time: string;
    stops: RouteStop[];
    create_return_route: boolean;
    return_start_time?: string;
}

const AddRoutePage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [startTime, setStartTime] = useState('07:00');
    const [returnStartTime, setReturnStartTime] = useState('16:00');
    const [createReturnRoute, setCreateReturnRoute] = useState(false);
    const [selectedStops, setSelectedStops] = useState<RouteStop[]>([]);
    const [busStops, setBusStops] = useState<BusStop[]>([]);

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        const fetchBusStops = async () => {
            try {
                const response = await api.get('bus_stops');
                setBusStops(response.data);
            } catch (error) {
                console.error('Error fetching bus stops:', error);
            }
        }
        fetchBusStops();
    }, []);

    useEffect(() => {
        if (mapContainer.current && !map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [106.6297, 10.8231],
                zoom: 12
            });

            map.current.on('load', () => {
                setMapLoaded(true);
            });

            return () => {
                if (map.current) {
                    map.current.remove();
                    map.current = null;
                }
            };
        }
    }, []);

    useEffect(() => {
        if (mapLoaded && map.current && selectedStops.length >= 2) {
            updateRoute();
        } else if (map.current) {
            if (map.current.getSource('route')) {
                map.current.removeLayer('route');
                map.current.removeSource('route');
            }
        }
    }, [selectedStops, mapLoaded]);

    useEffect(() => {
        if (createReturnRoute) {
            const calculateReturnTime = (time: string) => {
                const [hours, minutes] = time.split(':').map(Number);
                let newHours = hours + 8;
                if (newHours >= 24) newHours -= 24;
                return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            };

            setReturnStartTime(calculateReturnTime(startTime));
        }
    }, [createReturnRoute, startTime]);

    const updateRoute = async () => {
        if (!map.current || selectedStops.length < 2) return;

        const coordinates = selectedStops
            .sort((a, b) => a.stop_order - b.stop_order)
            .map(stop => {
                const busStop = busStops.find(s => s.stop_id === stop.stop_id);
                return busStop ? [parseFloat(busStop.longitude?.toString() || '0'), parseFloat(busStop.latitude?.toString() || '0')] : null;
            })
            .filter(Boolean) as [number, number][];

        try {
            const response = await axios.get(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.join(';')}`,
                {
                    params: {
                        access_token: mapboxgl.accessToken,
                        geometries: 'geojson',
                        overview: 'full'
                    }
                }
            );

            const route = response.data.routes[0];

            if (map.current.getSource('route')) {
                map.current.removeLayer('route');
                map.current.removeSource('route');
            }

            map.current.addSource('route', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: route.geometry
                }
            });

            map.current.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3b82f6',
                    'line-width': 4,
                    'line-opacity': 0.75
                }
            });

            const bounds = new mapboxgl.LngLatBounds();
            route.geometry.coordinates.forEach((coord: [number, number]) => {
                bounds.extend(coord);
            });
            map.current.fitBounds(bounds, { padding: 50 });

        } catch (error) {
            console.error('Error fetching route:', error);
        }
    };

    const handleAddStop = (stopId: number) => {
        const stop = busStops.find(s => s.stop_id === stopId);
        if (!stop) return;

        const newStop: RouteStop = {
            stop_id: stopId,
            stop_order: selectedStops.length + 1,
        };

        setSelectedStops(prev => [...prev, newStop]);

        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundColor = '#3b82f6';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.color = 'white';
        el.style.fontWeight = 'bold';
        el.style.fontSize = '14px';
        el.innerHTML = `${selectedStops.length + 1}`;

        if (map.current) {
            const marker = new mapboxgl.Marker(el)
                .setLngLat([parseFloat(stop.longitude?.toString() || '0'), parseFloat(stop.latitude?.toString() || '0')])
                .setPopup(new mapboxgl.Popup().setHTML(`
                    <div class="p-2">
                        <h3 class="font-bold">Trạm ${selectedStops.length + 1}</h3>
                        <p>${stop.address}</p>
                    </div>
                `))
                .addTo(map.current);

            markersRef.current.push(marker);
        }
    };

    const handleRemoveStop = (stopId: number) => {
        const markerIndex = markersRef.current.findIndex((marker, index) => {
            const stop = selectedStops[index];
            return stop?.stop_id === stopId;
        });

        if (markerIndex !== -1) {
            markersRef.current[markerIndex].remove();
            markersRef.current.splice(markerIndex, 1);
        }

        setSelectedStops(prev => {
            const newStops = prev.filter(stop => stop.stop_id !== stopId)
                .map((stop, index) => ({ ...stop, stop_order: index + 1 }));
            return newStops;
        });
    };

    const handleSubmit = async () => {
        if (selectedStops.length < 2) {
            toast.error('Vui lòng chọn ít nhất 2 trạm dừng cho tuyến đường');
            return;
        }

        if (createReturnRoute && !returnStartTime) {
            toast.error('Vui lòng chọn giờ khởi hành cho tuyến về');
            return;
        }

        setLoading(true);
        try {
            const routeData: NewRouteData = {
                start_time: startTime,
                stops: selectedStops,
                create_return_route: createReturnRoute,
                ...(createReturnRoute && { return_start_time: returnStartTime })
            };

            console.log('Route data:', routeData);

            await api.post('routes', routeData);

            router.push('/admin/paths');
            router.refresh();

        } catch (error) {
            console.error('Error creating route:', error);
            alert('Có lỗi xảy ra khi tạo tuyến đường');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/admin/paths');
    };

    const handleCreateReturnRouteChange = (checked: boolean) => {
        setCreateReturnRoute(checked);
    };

    return (
        <main className="container mx-auto p-6 pb-30">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Thêm Tuyến Đường Mới</h1>
                    <p className="text-gray-600">Tạo tuyến đường mới với bản đồ và các trạm dừng</p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleCancel}
                >
                    Quay lại
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Giờ khởi hành (tuyến đi)</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Tạo tuyến về</label>
                            <Switch
                                checked={createReturnRoute}
                                onCheckedChange={handleCreateReturnRouteChange}
                            />
                        </div>

                        {createReturnRoute && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Giờ khởi hành (tuyến về)</label>
                                <input
                                    type="time"
                                    value={returnStartTime}
                                    onChange={(e) => setReturnStartTime(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Thời gian khởi hành cho tuyến đường về
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <h3 className="font-medium mb-3">Danh sách trạm đã chọn ({selectedStops.length})</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {selectedStops
                                .sort((a, b) => a.stop_order - b.stop_order)
                                .map((stop) => {
                                    const busStop = busStops.find(s => s.stop_id === stop.stop_id);
                                    return (
                                        <div key={stop.stop_id} className="flex items-center justify-between p-2 border rounded">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">#{stop.stop_order}</span>
                                                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                                                        Trạm
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 truncate">{busStop?.address}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveStop(stop.stop_id)}
                                                className="text-red-500 hover:text-red-700 ml-2"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="font-medium mb-3">Chọn trạm dừng</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {busStops
                                .filter(stop => stop.is_active)
                                .filter(stop => !selectedStops.some(s => s.stop_id === stop.stop_id))
                                .map((stop) => (
                                    <button
                                        key={stop.stop_id}
                                        onClick={() => handleAddStop(stop.stop_id)}
                                        className="w-full text-left p-2 border rounded hover:bg-gray-50 transition-colors"
                                    >
                                        <p className="font-medium text-sm">Trạm #{stop.stop_id}</p>
                                        <p className="text-xs text-gray-600 truncate">{stop.address}</p>
                                    </button>
                                ))}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={handleCancel}
                            variant="outline"
                            className="flex-1"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || selectedStops.length < 2}
                            className="flex-1 bg-blue-500 hover:bg-blue-600"
                        >
                            {loading ? 'Đang tạo...' : 'Tạo Tuyến Đường'}
                        </Button>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div ref={mapContainer} className="w-full h-full rounded-lg border" />
                </div>
            </div>
        </main>
    );
};

export default AddRoutePage;