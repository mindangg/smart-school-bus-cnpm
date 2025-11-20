// components/LiveTrackingMap.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Bus, MapPin, User } from 'lucide-react' // Thêm icon User nếu muốn
import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl'
import api from "@/lib/axios";
import mapboxgl from "mapbox-gl";

// 1. === THÊM PROP assignedStop ===
// Để map biết học sinh đang đón ở đâu
const LiveTrackingMap = ({ pathRoute, assignedStop }: any) => {
    const mapRef = useRef<any>(null)
    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const [route, setRoute] = useState<any>(null)
    const [busPos, setBusPos] = useState<[number, number] | null>(null)

    useEffect(() => {
        if (!pathRoute || !pathRoute.route_stops || pathRoute.route_stops.length < 2) {
            setRoute(null);
            return;
        }
        
        // 2. === SỬA LOGIC TỌA ĐỘ ===
        // Start: Ưu tiên lấy trạm của học sinh (assignedStop), nếu không có thì lấy trạm đầu (index 0)
        const startStop = assignedStop || pathRoute.route_stops[0].stop;
        
        const start = {
            lng: Number(startStop.longitude),
            lat: Number(startStop.latitude)
        }

        // End: Luôn lấy trạm cuối cùng (Trường học)
        const lastStop = pathRoute.route_stops[pathRoute.route_stops.length - 1].stop;
        const end = {
            lng: Number(lastStop.longitude),
            lat: Number(lastStop.latitude)
        }

        const fetchRoute = async () => {
            try {
                const res = await api.get(
                    `routes/direction`, // <-- Phải có dấu '/' ở đầu
                    {
                        params: {
                            start: `${start.lng},${start.lat}`,
                            end: `${end.lng},${end.lat}`,
                        }
                    }
                )
                const geometry = res.data.routes[0].geometry
                setRoute(geometry)

                if (mapRef.current && geometry.coordinates.length > 0) {
                    const bounds = new mapboxgl.LngLatBounds()
                    geometry.coordinates.forEach(([lng, lat]: [number, number]) => {
                        bounds.extend([lng, lat])
                    })
                    mapRef.current.fitBounds(bounds, { padding: 50 })
                }
            }
            catch (error) {
                console.error('Error fetching route direction:', error)
            }
        }

        fetchRoute()
    }, [pathRoute, assignedStop]) // Thêm assignedStop vào dependency

    // ... (Giữ nguyên phần useEffect di chuyển xe bus) ...
    useEffect(() => {
        if (!route || !mapRef.current || !isMapLoaded) return
        const map = mapRef.current.getMap()
        const startMovingBus = () => {
            let index = 0
            const speed = 2000 // Tốc độ demo
            const moveBus = () => {
                if (index >= route.coordinates.length - 1) return
                const [lng1, lat1] = route.coordinates[index]
                const [lng2, lat2] = route.coordinates[index + 1]
                setBusPos([lng2, lat2])
                index += 1
                setTimeout(moveBus, speed)
            };
            moveBus();
        };
        map.once('moveend', startMovingBus)
        return () => map.off('moveend', startMovingBus)
    }, [route, isMapLoaded])

    
    if (!pathRoute || !pathRoute.route_stops || pathRoute.route_stops.length < 2) {
        return (
            <div className='bg-white rounded-lg shadow-lg p-6'>
                 <p className='text-gray-700 font-semibold'>Chưa có dữ liệu tuyến đường.</p>
            </div>
        )
    }

    // === CHUẨN BỊ DATA HIỂN THỊ MARKER ===
    const userStop = assignedStop || pathRoute.route_stops[0].stop;
    const schoolStop = pathRoute.route_stops[pathRoute.route_stops.length - 1].stop;

    return (
        <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='relative w-full h-[450px] bg-gray-200 rounded-md overflow-hidden'>
                <Map
                    ref={mapRef}
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    initialViewState={{
                        longitude: Number(userStop.longitude),
                        latitude: Number(userStop.latitude),
                        zoom: 14
                    }}
                    style={{ width: '100%', height: '100%' }}   
                    mapStyle='mapbox://styles/mapbox/streets-v11'
                    onLoad={() => setIsMapLoaded(true)}
                >
                    <NavigationControl position='top-right' />

                    {route && (
                        <Source id='route' type='geojson' data={{ type: 'Feature', properties: {}, geometry: route }}>
                            <Layer id='route-line' type='line' paint={{ 'line-color': '#007AFF', 'line-width': 5 }} />
                        </Source>
                    )}

                    {/* Marker Xe Bus */}
                    {busPos && (
                        <Marker longitude={busPos[0]} latitude={busPos[1]} anchor='bottom'>
                            <div className='flex flex-col items-center'>
                                <Bus size={32} className='text-yellow-500 fill-yellow-400' />
                            </div>
                        </Marker>
                    )}

                    {/* 3. === Marker ĐIỂM ĐÓN (Màu Xanh) === */}
                    <Marker longitude={Number(userStop.longitude)} latitude={Number(userStop.latitude)} anchor='bottom'>
                        <div className='flex flex-col items-center'>
                            <div className='bg-white p-2 rounded-lg shadow-md mb-1 max-w-[150px] text-center'>
                                <p className='text-xs font-bold text-green-700'>Điểm đón của bạn</p>
                                <p className='text-xs text-gray-600 truncate'>{userStop.address}</p>
                            </div>
                            <MapPin size={32} className='text-green-500 fill-green-400' />
                        </div>
                    </Marker>

                    {/* 4. === Marker TRƯỜNG HỌC (Màu Đỏ) === */}
                    <Marker longitude={Number(schoolStop.longitude)} latitude={Number(schoolStop.latitude)} anchor='bottom'>
                        <div className='flex flex-col items-center'>
                            <div className='bg-white p-2 rounded-lg shadow-md mb-1 max-w-[150px] text-center'>
                                <p className='text-xs font-bold text-red-700'>Trường học (Đích)</p>
                                <p className='text-xs text-gray-600 truncate'>{schoolStop.address}</p>
                            </div>
                            <MapPin size={32} className='text-red-500 fill-red-400' />
                        </div>
                    </Marker>
                </Map>
            </div>
        </div>
    )
}

export default LiveTrackingMap;