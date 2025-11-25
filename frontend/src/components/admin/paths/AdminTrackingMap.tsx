'use client'

import React, {useEffect, useRef, useState} from 'react'
import mapboxgl from 'mapbox-gl'
import api from '@/lib/axios'
import Map, {Layer, Marker, NavigationControl, Source} from 'react-map-gl'
import {Bus, BusFront, Cpu, MapPin, Navigation, Users, Wifi, WifiOff} from 'lucide-react'
import {useBusLocationAdmin} from '@/hooks/useBusLocationAdmin'
import {toast} from "sonner"
import AdminStudentPopup from "@/components/admin/students/AdminStudentPopup";

interface AdminTrackingMapProps {
    pathRoute: any
    assignmentId: number
    adminId: number
    bus: string
}

const AdminTrackingMap = ({ pathRoute, assignmentId, adminId, bus }: AdminTrackingMapProps) => {
    const mapRef = useRef<any>(null)
    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const [routeGeometry, setRouteGeometry] = useState<any>(null)
    const [distance, setDistance] = useState<number>(0)
    const [duration, setDuration] = useState<number>(0)

    const { isConnected, busLocation, trackingMode, allBusLocations } = useBusLocationAdmin({
        assignment_id: assignmentId,
        admin_id: adminId,
        enabled: true
    })

    const [busPos, setBusPos] = useState<[number, number] | null>(null)
    const [open, setOpen] = useState<boolean>(false)
    const [students, setStudents] = useState<any[]>([])
    const [studentPickup, setStudentPickup] = useState<any>(null)
    const [selectedStop, setSelectedStop] = useState<any>(null)
    const [showAllStudents, setShowAllStudents] = useState<boolean>(false)
    const [allRouteStudents, setAllRouteStudents] = useState<any[]>([])

    const routeStops = pathRoute?.route_stops || []
    const startStop = routeStops.length > 0 ? routeStops[0].stop : null
    const schoolStop = routeStops.length > 0 ? routeStops[routeStops.length - 1].stop : null

    // Lấy toàn bộ route
    useEffect(() => {
        const fetchFullRoute = async () => {
            if (!pathRoute || routeStops.length < 2) return

            try {
                const coordinates: [number, number][] = []
                let totalDistance = 0
                let totalDuration = 0

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
                    }

                    totalDistance += distance || 0
                    totalDuration += duration || 0
                }

                const fullGeometry = {
                    type: 'LineString',
                    coordinates,
                }
                setRouteGeometry(fullGeometry)
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

    // Lấy danh sách tất cả học sinh trên tuyến đường
    useEffect(() => {
        const fetchAllRouteStudents = async () => {
            try {
                const allStudents: any[] = []

                for (const stop of routeStops) {
                    const res = await api.get(`route_stop_student/${stop.route_stop_id}`)
                    const studentsAtStop = res.data.map((item: any) => ({
                        ...item.student,
                        stop_name: stop.stop.address,
                        route_stop_id: stop.route_stop_id
                    }))
                    allStudents.push(...studentsAtStop)
                }

                setAllRouteStudents(allStudents)
            } catch (error) {
                console.error('Error fetching all students:', error)
            }
        }

        if (routeStops.length > 0) {
            fetchAllRouteStudents()
        }
    }, [routeStops])

    // Cập nhật vị trí xe buýt
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

    // Lấy danh sách học sinh tại điểm dừng
    const getStudentsAtRouteStop = async (routeStopId: number, stopInfo: any) => {
        try {
            const res = await api.get(`route_stop_student/${routeStopId}`)
            const list = res.data.map((item: any) => item.student)
            setStudents(list)
            setStudentPickup(stopInfo.address)
            setSelectedStop(stopInfo)
            setOpen(true)
        } catch (error) {
            console.error('Error fetching students:', error)
            toast.error('Không thể tải danh sách học sinh')
        }
    }

    // Hiển thị tất cả học sinh
    const showAllStudentsOnRoute = () => {
        setStudents(allRouteStudents)
        setStudentPickup('Tất cả điểm dừng')
        setSelectedStop(null)
        setOpen(true)
    }

    // Tính thời gian còn lại
    const getRemainingTime = () => {
        if (!pathRoute?.start_time) return ''

        const [startHour, startMinute] = pathRoute.start_time.split(':').map(Number)
        const startTime = new Date()
        startTime.setHours(startHour, startMinute, 0, 0)

        const now = new Date()
        const elapsed = (now.getTime() - startTime.getTime()) / 1000
        const remaining = duration - elapsed

        if (remaining <= 0) return 'Đã hoàn thành'

        const hours = Math.floor(remaining / 3600)
        const minutes = Math.floor((remaining % 3600) / 60)

        if (hours > 0) {
            return `${hours} giờ ${minutes} phút`
        } else {
            return `${minutes} phút`
        }
    }

    // Tính phần trăm hoàn thành
    const getCompletionPercentage = () => {
        if (!pathRoute?.start_time) return 0

        const [startHour, startMinute] = pathRoute.start_time.split(':').map(Number)
        const startTime = new Date()
        startTime.setHours(startHour, startMinute, 0, 0)

        const now = new Date()
        const elapsed = (now.getTime() - startTime.getTime()) / 1000

        if (elapsed <= 0) return 0
        if (elapsed >= duration) return 100

        return (elapsed / duration) * 100
    }

    if (!pathRoute || routeStops.length < 2) {
        return (
            <div className='bg-white rounded-lg shadow-lg p-6'>
                <div className='relative w-full h-[450px] bg-gray-200 rounded-md flex items-center justify-center'>
                    <p className='text-gray-500'>Đang tải dữ liệu bản đồ...</p>
                </div>
            </div>
        )
    }

    const initialLng = Number(startStop?.longitude || 105.8)
    const initialLat = Number(startStop?.latitude || 21.0)

    return (
        <div className='bg-white rounded-lg shadow-lg p-6'>
            {/* Header với thông tin kết nối và chế độ */}
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

                <div className='flex items-center gap-2'>
                    {/* Nút hiển thị tất cả học sinh */}
                    <button
                        onClick={showAllStudentsOnRoute}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                            showAllStudents
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <Users size={16} />
                        <span>Tất cả học sinh ({allRouteStudents.length})</span>
                    </button>

                    {/* Hiển thị chế độ theo dõi */}
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
            </div>

            {/* Thông tin hành trình */}
            <div className='mb-4 grid grid-cols-4 gap-4 text-sm'>
                <div className='bg-blue-50 p-3 rounded-lg'>
                    <p className='text-gray-600'>Xe buýt</p>
                    <p className='font-semibold text-gray-900'>{bus}</p>
                </div>
                <div className='bg-green-50 p-3 rounded-lg'>
                    <p className='text-gray-600'>Giờ bắt đầu</p>
                    <p className='font-semibold text-gray-900'>{pathRoute.start_time}</p>
                </div>
                <div className='bg-purple-50 p-3 rounded-lg'>
                    <p className='text-gray-600'>Thời gian còn lại</p>
                    <p className='font-semibold text-gray-900'>{getRemainingTime()}</p>
                </div>
                <div className='bg-orange-50 p-3 rounded-lg'>
                    <p className='text-gray-600'>Quãng đường</p>
                    <p className='font-semibold text-gray-900'>{(distance / 1000).toFixed(2)} km</p>
                </div>
            </div>

            {/* Thanh tiến độ */}
            <div className='mb-4'>
                <div className='flex justify-between text-sm text-gray-600 mb-1'>
                    <span>Tiến độ hành trình</span>
                    <span>{Math.round(getCompletionPercentage())}%</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                        className='bg-blue-600 h-2 rounded-full transition-all duration-500'
                        style={{ width: `${getCompletionPercentage()}%` }}
                    />
                </div>
            </div>

            {/* Thông tin vị trí hiện tại */}
            {busLocation && (
                <div className='mb-4 p-3 bg-gray-50 rounded-lg'>
                    <div className='flex items-center justify-between text-sm'>
                        <div className='flex items-center gap-4'>
                            <span>
                                <strong>Vị trí hiện tại:</strong> {busLocation.latitude.toFixed(6)}, {busLocation.longitude.toFixed(6)}
                            </span>
                        </div>
                        <span className='text-gray-500'>
                            Cập nhật: {new Date(busLocation.timestamp).toLocaleTimeString('vi-VN')}
                        </span>
                    </div>
                </div>
            )}

            {/* Bản đồ */}
            <div className='relative w-full h-[500px] bg-gray-200 rounded-md overflow-hidden'>
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

                    {/* Vẽ tuyến đường */}
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

                    {busPos && (
                        <Marker longitude={busPos[0]} latitude={busPos[1]} anchor='center'>
                            <div className='flex flex-col items-center'>

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

                    {/* Các điểm dừng */}
                    {routeStops.map((stopItem: any, index: number) => {
                        const stop = stopItem.stop
                        const isStart = index === 0
                        const isSchool = index === routeStops.length - 1

                        return (
                            <Marker
                                key={index}
                                longitude={Number(stop.longitude)}
                                latitude={Number(stop.latitude)}
                                anchor='bottom'
                                onClick={() => getStudentsAtRouteStop(stopItem.route_stop_id, stop)}
                            >
                                <div className='flex flex-col items-center group cursor-pointer'>
                                    {/* Tooltip hiển thị thông tin điểm dừng */}
                                    <div className='absolute bottom-12 px-2 py-1 bg-white text-gray-800 rounded shadow-md whitespace-nowrap mb-1 opacity-0 group-hover:opacity-100 transition-opacity z-30'>
                                        <p className='text-xs font-bold'>
                                            {isStart ? "Điểm bắt đầu" : isSchool ? "Trường học" : `Điểm dừng ${index}`}
                                        </p>
                                        <p className='text-xs'>{stop.address}</p>
                                        <p className='text-xs text-blue-600 font-semibold'>
                                            Nhấn để xem học sinh
                                        </p>
                                    </div>

                                    {/* Icon điểm dừng */}
                                    {isStart ? (
                                        <div className="relative flex items-center justify-center">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <div className="relative bg-green-500 text-white p-2 rounded-full border-2 border-white shadow-xl">
                                                <MapPin size={20} />
                                            </div>
                                        </div>
                                    ) : isSchool ? (
                                        <div className="relative flex items-center justify-center">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <div className="relative bg-red-500 text-white p-2 rounded-full border-2 border-white shadow-xl">
                                                <MapPin size={20} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative bg-white p-1.5 rounded-full border-2 border-blue-500 shadow-lg group-hover:scale-110 transition-transform">
                                            <BusFront size={20} className='text-blue-500' />
                                            <div className='absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs'>
                                                {index + 1}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </Marker>
                        )
                    })}
                </Map>

                {!isMapLoaded && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black/30 z-10'>
                        <span className='text-white text-lg font-bold bg-black/50 px-4 py-2 rounded'>
                            Đang tải bản đồ...
                        </span>
                    </div>
                )}
            </div>

            {/* Thống kê tổng quan */}
            <div className='mt-4 grid grid-cols-3 gap-4 text-sm'>
                <div className='bg-blue-50 p-3 rounded-lg'>
                    <p className='text-gray-600'>Tổng số điểm dừng</p>
                    <p className='font-semibold text-gray-900 text-xl'>{routeStops.length}</p>
                </div>
                <div className='bg-green-50 p-3 rounded-lg'>
                    <p className='text-gray-600'>Tổng số học sinh</p>
                    <p className='font-semibold text-gray-900 text-xl'>{allRouteStudents.length}</p>
                </div>
                <div className='bg-purple-50 p-3 rounded-lg'>
                    <p className='text-gray-600'>Trạng thái</p>
                    <p className={`font-semibold text-xl ${
                        isConnected ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {isConnected ? 'Đang hoạt động' : 'Mất kết nối'}
                    </p>
                </div>
            </div>

            {/* Popup hiển thị danh sách học sinh */}
            {open && (
                <AdminStudentPopup
                    students={students}
                    studentPickup={studentPickup}
                    setOpen={setOpen}
                    isAdminView={true}
                    stopInfo={selectedStop}
                />
            )}
        </div>
    )
}

export default AdminTrackingMap