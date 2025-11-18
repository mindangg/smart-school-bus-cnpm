'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Bus, MapPin } from 'lucide-react'
import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl'
import api from "@/lib/axios"; // <-- Import file axios.ts của bạn
import mapboxgl from "mapbox-gl";

const LiveTrackingMap = ({ pathRoute }: any) => {
    // === BƯỚC 1: GỌI TẤT CẢ HOOK LÊN ĐẦU ===
    const mapRef = useRef<any>(null)
    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const [route, setRoute] = useState<any>(null)
    const [busPos, setBusPos] = useState<[number, number] | null>(null)

    // Hook 'useEffect' TẢI ĐƯỜNG ĐI (LUÔN ĐƯỢC GỌI)
    useEffect(() => {
        // Thêm điều kiện 'if' VÀO BÊN TRONG hook
        if (!pathRoute || !pathRoute.route_stops || pathRoute.route_stops.length < 2) {
            setRoute(null); // Xóa đường đi cũ nếu không có dữ liệu mới
            return; // Không làm gì cả
        }
        
        // Chỉ chạy nếu pathRoute tồn tại
        const start = {
            lng: pathRoute.route_stops[0].stop.longitude,
            lat: pathRoute.route_stops[0].stop.latitude
        }
        const end = {
            lng: pathRoute.route_stops[pathRoute.route_stops.length - 1].stop.longitude, // Lấy điểm cuối cùng
            lat: pathRoute.route_stops[pathRoute.route_stops.length - 1].stop.latitude
        }

        const fetchRoute = async () => {
            try {
                // Sửa lời gọi API: (Dùng file axios.ts, không cần '/api/')
                const res = await api.get(
                    `/routes/direction`, // <-- Phải có dấu '/' ở đầu
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
    }, [pathRoute]) // <-- Phụ thuộc vào pathRoute

    // Hook 'useEffect' DI CHUYỂN XE BUÝT (LUÔN ĐƯỢC GỌI)
    useEffect(() => {
        if (!route || !mapRef.current || !isMapLoaded)
            return

        const map = mapRef.current.getMap()

        const startMovingBus = () => {
            let index = 0
            const speed = 2000

            const moveBus = () => {
                if (index >= route.coordinates.length - 1)
                    return

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
    
    // === BƯỚC 2: KIỂM TRA VÀ RETURN TRẠNG THÁI RỖNG (SAU KHI GỌI HOOK) ===
    if (!pathRoute || !pathRoute.route_stops || pathRoute.route_stops.length < 2) {
        return (
            <div className='bg-white rounded-lg shadow-lg p-6'>
                <div className='relative w-full h-[450px] bg-gray-200 rounded-md overflow-hidden
                                flex items-center justify-center'>
                    <p className='text-gray-700 font-semibold'>
                        Không có dữ liệu theo dõi tuyến đường.
                    </p>
                </div>
            </div>
        )
    }

    // === BƯỚC 3: DỮ LIỆU ĐÃ HỢP LỆ, TRẢ VỀ BẢN ĐỒ ===
    const start = {
        lng: pathRoute.route_stops[0].stop.longitude,
        lat: pathRoute.route_stops[0].stop.latitude
    }
    const end = {
        lng: pathRoute.route_stops[pathRoute.route_stops.length - 1].stop.longitude,
        lat: pathRoute.route_stops[pathRoute.route_stops.length - 1].stop.latitude
    }

    return (
        <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='relative w-full h-[450px] bg-gray-200 rounded-md overflow-hidden'>
                <Map
                    ref={mapRef}
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    initialViewState={{
                        longitude: start.lng,
                        latitude: start.lat,
                    }}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle='mapbox://styles/mapbox/streets-v11'
                    onLoad={() => setIsMapLoaded(true)}
                >
                    <NavigationControl position='top-right' />

                    {route && (
                        <Source
                            id='route'
                            type='geojson'
                            data={{ type: 'Feature', properties: {}, geometry: route }}
                        >
                            <Layer
                                id='route-line'
                                type='line'
                                paint={{ 'line-color': '#007AFF', 'line-width': 5 }}
                            />
                        </Source>
                    )}

                    {busPos && (
                        <Marker longitude={busPos[0]} latitude={busPos[1]} anchor='bottom'>
                            <div className='flex flex-col items-center'>
                                <div className='bg-white p-2 rounded-lg shadow-md mb-1'>
                                    <p className='text-sm font-semibold text-gray-900'>
                                        Xe buýt
                                    </p>
                                </div>
                                <Bus size={32} className='text-yellow-500 fill-yellow-400' />
                            </div>
                        </Marker>
                    )}

                    <Marker longitude={start.lng} latitude={start.lat} anchor='bottom'>
                        <div className='flex flex-col items-center'>
                            <div className='bg-white p-2 rounded-lg shadow-md mb-1'>
                                <p className='text-sm font-semibold text-gray-900'>
                                    {pathRoute.route_stops[0].stop.address}
                                </p>
                            </div>
                            <MapPin size={32} className='text-green-500 fill-green-400' />
                        </div>
                    </Marker>

                    <Marker longitude={end.lng} latitude={end.lat} anchor='bottom'>
                        <div className='flex flex-col items-center'>
                            <div className='bg-white p-2 rounded-lg shadow-md mb-1'>
                                <p className='text-sm font-semibold text-gray-900'>
                                    {pathRoute.route_stops[pathRoute.route_stops.length - 1].stop.address}
                                </p>
                            </div>
                            <MapPin size={32} className='text-red-500 fill-red-400' />
                        </div>
                    </Marker>
                </Map>

                {!isMapLoaded && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black/30 z-10'>
                        <span className='text-white text-lg font-bold bg-black/50 px-4 py-2 rounded'>
                            Đang tải bản đồ...
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LiveTrackingMap;