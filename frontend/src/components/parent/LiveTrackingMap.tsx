'use client'

import React, {useEffect, useRef, useState} from 'react'
import {Bus, Cpu, MapPin, Navigation, User, Wifi, WifiOff} from 'lucide-react'
import Map, {Layer, Marker, NavigationControl, Source} from 'react-map-gl'
import {useBusLocationParent} from '@/hooks/useBusLocation'
import api from "@/lib/axios";
import mapboxgl from "mapbox-gl";
import {useAuth} from "@/contexts/AuthContext";

interface LiveTrackingMapProps {
    pathRoute: any
    assignedStop: any
    assignmentId: number
    parentId: number
}

const LiveTrackingMap = ({ pathRoute, assignedStop, assignmentId, parentId }: LiveTrackingMapProps) => {
    const mapRef = useRef<any>(null)
    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const [routeGeometry, setRouteGeometry] = useState<any>(null)
    const [route, setRoute] = useState<any>(null)
    const [distance, setDistance] = useState<number>(0)
    const [duration, setDuration] = useState<number>(0)

    const { isConnected, busLocation, trackingMode } = useBusLocationParent({
        assignment_id: assignmentId,
        parent_id: parentId,
        enabled: true
    })

    const [busPos, setBusPos] = useState<[number, number] | null>(null)

    const routeStops = pathRoute?.route_stops || []
    const startStop = routeStops.length > 0 ? routeStops[0].stop : null
    const schoolStop = routeStops.length > 0 ? routeStops[routeStops.length - 1].stop : null
    const [segmentEndIndices, setSegmentEndIndices] = useState<number[]>([]);

    const ALMOST_THERE_DISTANCE = 1000; // meters
    const almostThereLoggedRef = useRef(false);

    const { user } = useAuth()
    useEffect(() => {
        const fetchFullRoute = async () => {
            if (!pathRoute || routeStops.length < 2) return

            try {
                const coordinates: [number, number][] = []
                let totalDistance = 0
                let totalDuration = 0

                const segmentEndIndices: number[] = [];

                for (let i = 0; i < routeStops.length - 1; i++) {
                    const current = routeStops[i].stop
                    const next = routeStops[i + 1].stop

                    const res = await api.get('routes/direction_full', {
                        params: {
                            start: `${current.longitude},${current.latitude}`,
                            end: `${next.longitude},${next.latitude}`,
                        },
                    })

                    const { geometry, distance, duration } = res.data

                    if (geometry?.coordinates?.length > 0) {
                        coordinates.push(...geometry.coordinates)

                        segmentEndIndices.push(coordinates.length - 1);
                    }

                    totalDistance += distance || 0
                    totalDuration += duration || 0
                }

                setSegmentEndIndices(segmentEndIndices);

                const fullGeometry = {
                    type: 'LineString',
                    coordinates,
                }
                setRouteGeometry(fullGeometry)
                setRoute(fullGeometry)
                setDistance(totalDistance)
                setDuration(totalDuration)

                if (mapRef.current && coordinates.length > 0) {
                    const bounds = new mapboxgl.LngLatBounds()
                    coordinates.forEach(([lng, lat]) => bounds.extend([lng, lat]))
                    mapRef.current.fitBounds(bounds, { padding: 50 })
                }
            } catch (error) {
                console.error('Error fetching full route:', error)
            }
        }

        fetchFullRoute()
    }, [pathRoute])


    const createAlmostNotification = async () => {
        try {
            await api.post('notifications', {
                user_id: user?.user_id,
                notification_type: 'STUDENT_EVENT',
                title: 'Con bạn sắp đến nơi',
                message: 'Con bạn sắp đến trường! Chúc bé một ngày học vui vẻ',
            })
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (busLocation) {
            setBusPos([busLocation.longitude, busLocation.latitude])

            if (mapRef.current) {
                mapRef.current.easeTo({
                    center: [busLocation.longitude, busLocation.latitude],
                    duration: 1000
                })
            }
        }
    }, [busLocation])

    if (!pathRoute || routeStops.length < 2) {
        return (
            <div className='bg-white rounded-lg shadow-lg p-6'>
                <div className='relative w-full h-[450px] bg-gray-200 rounded-md flex items-center justify-center'>
                    <p className='text-gray-500'>Đang tải dữ liệu bản đồ...</p>
                </div>
            </div>
        )
    }

    const initialLng = assignedStop ? Number(assignedStop.longitude) : Number(startStop?.longitude || 105.8)
    const initialLat = assignedStop ? Number(assignedStop.latitude) : Number(startStop?.latitude || 21.0)

    return (
        <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='mb-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    {isConnected ? (
                        <>
                            <Wifi className='text-green-500' size={20} />
                            <span className='text-sm text-green-600 font-medium'>
                                Đang theo dõi trực tiếp
                            </span>
                        </>
                    ) : (
                        <>
                            <WifiOff className='text-red-500' size={20} />
                            <span className='text-sm text-red-600 font-medium'>
                                Mất kết nối - Đang thử kết nối lại...
                            </span>
                        </>
                    )}
                </div>

                <div className='flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1'>
                    {trackingMode === 'gps' ? (
                        <>
                            <Navigation size={16} className='text-green-600' />
                            <span className='text-sm text-green-600 font-medium'>GPS Thật</span>
                        </>
                    ) : (
                        <>
                            <Cpu size={16} className='text-blue-600' />
                            <span className='text-sm text-blue-600 font-medium'>Chế độ giả lập</span>
                        </>
                    )}
                </div>
            </div>

            {busLocation && (
                <div className='mb-4 flex items-center gap-4 text-sm text-gray-600'>
                    <span>
                        Cập nhật: {new Date(busLocation.timestamp).toLocaleTimeString('vi-VN')}
                    </span>
                    <span>
                        Vị trí: {busLocation.latitude.toFixed(6)}, {busLocation.longitude.toFixed(6)}
                    </span>
                </div>
            )}

            <div className='relative w-full h-[450px] bg-gray-200 rounded-md overflow-hidden'>
                <Map
                    ref={mapRef}
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    initialViewState={{
                        longitude: initialLng,
                        latitude: initialLat,
                        zoom: 12
                    }}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle='mapbox://styles/mapbox/streets-v11'
                    onLoad={() => setIsMapLoaded(true)}
                >
                    <NavigationControl position='top-right' />

                    {routeGeometry && (
                        <Source id='route' type='geojson' data={{ type: 'Feature', properties: {}, geometry: routeGeometry }}>
                            <Layer
                                id='route-line'
                                type='line'
                                layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                                paint={{ 'line-color': '#3b82f6', 'line-width': 5, 'line-opacity': 0.8 }}
                            />
                        </Source>
                    )}

                    {route && (
                        <Source
                            id='route'
                            type='geojson'
                            data={{
                                type: 'Feature',
                                properties: {},
                                geometry: route,
                            }}>
                            <Layer
                                id='route-line'
                                type='line'
                                paint={{
                                    'line-color': '#007AFF',
                                    'line-width': 5,
                                }}
                            />
                        </Source>
                    )}

                    {busPos && (
                        <Marker longitude={busPos[0]} latitude={busPos[1]} anchor='center'>
                            <div className='flex flex-col items-center'>
                                <div className='bg-white p-2 rounded-lg shadow-md mb-1'>
                                    <p className='text-sm font-semibold text-gray-900'>
                                        {pathRoute.buses?.bus_number || 'SGU-001'}
                                    </p>
                                    <p className='text-xs text-gray-500'>
                                        {trackingMode === 'gps' ? 'GPS Thật' : 'Giả lập'}
                                    </p>
                                </div>
                                <div className='relative'>
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                        trackingMode === 'gps' ? 'bg-green-400' : 'bg-yellow-400'
                                    }`}></span>
                                    <div className={`relative bg-white rounded-full p-1 shadow-md border z-20 ${
                                        trackingMode === 'gps' ? 'border-green-500' : 'border-yellow-500'
                                    }`}>
                                        <Bus
                                            size={24}
                                            className={trackingMode === 'gps' ? 'text-green-600' : 'text-yellow-600'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Marker>
                    )}

                    {routeStops.map((stopItem: any, index: number) => {
                        const stop = stopItem.stop
                        const isAssigned = assignedStop && stop.stop_id === assignedStop.stop_id
                        const isStart = index === 0
                        const isSchool = index === routeStops.length - 1

                        return (
                            <Marker
                                key={index}
                                longitude={Number(stop.longitude)}
                                latitude={Number(stop.latitude)}
                                anchor='bottom'
                            >
                                <div className={`flex flex-col items-center group cursor-pointer ${isAssigned || isSchool ? 'z-30' : 'z-10'}`}>
                                    <div className={`absolute bottom-9 px-2 py-1 rounded shadow-md whitespace-nowrap mb-1 transition-all
                                        ${isAssigned ? 'bg-blue-600 text-white opacity-100' : 'bg-white text-gray-800 opacity-0 group-hover:opacity-100'}
                                    `}>
                                        <p className='text-xs font-bold'>
                                            {isAssigned ? "Điểm đón của con" : isSchool ? "Trường học" : stop.address}
                                        </p>
                                    </div>

                                    {isAssigned ? (
                                        <div className="relative flex items-center justify-center">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                            <div className="relative bg-blue-500 text-white p-2 rounded-full border-2 border-white shadow-xl transform hover:scale-110 transition-transform">
                                                <User size={24} />
                                            </div>
                                        </div>
                                    ) : isSchool ? (
                                        <div className="bg-red-500 text-white p-1.5 rounded-full border-2 border-white shadow-lg">
                                            <MapPin size={28} fill="currentColor" />
                                        </div>
                                    ) : isStart ? (
                                        <div className="bg-green-500 text-white p-1.5 rounded-full border-2 border-white shadow-lg">
                                            <MapPin size={24} />
                                        </div>
                                    ) : (
                                        <div className="bg-white text-gray-500 p-1 rounded-full border border-gray-300 shadow-sm hover:bg-gray-50">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                            </Marker>
                        )
                    })}
                </Map>
            </div>

            {busLocation && distance > 0 && (
                <div className='mt-4 p-4 bg-blue-50 rounded-lg'>
                    <h4 className='font-semibold text-blue-900 mb-2'>Thông tin hành trình</h4>
                    <div className='grid grid-cols-2 gap-3 text-sm'>
                        <div>
                            <p className='text-gray-600'>Tổng quãng đường:</p>
                            <p className='font-semibold text-gray-900'>{(distance / 1000).toFixed(2)} km</p>
                        </div>
                        <div>
                            <p className='text-gray-600'>Thời gian dự kiến:</p>
                            <p className='font-semibold text-gray-900'>
                                {Math.round(duration / 60)} phút
                            </p>
                        </div>
                        <div>
                            <p className='text-gray-600'>Chế độ theo dõi:</p>
                            <p className='font-semibold text-gray-900'>
                                {trackingMode === 'gps' ? 'GPS Thật' : 'Giả lập'}
                            </p>
                        </div>
                        <div>
                            <p className='text-gray-600'>Trạng thái:</p>
                            <p className='font-semibold text-green-900'>
                                {isConnected ? 'Đang kết nối' : 'Mất kết nối'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LiveTrackingMap;