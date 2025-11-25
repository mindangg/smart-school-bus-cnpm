'use client'

import React, {useEffect, useRef, useState} from 'react'
import mapboxgl from 'mapbox-gl'
import api from '@/lib/axios'
import Map, {Layer, Marker, NavigationControl, Source} from 'react-map-gl'
import {ArrowRight, Bus, BusFront, Cpu, MapPin, Navigation, Wifi, WifiOff} from 'lucide-react'
import StudentPopup from "@/components/driver/StudentPopup"
import {useBusLocationDriver} from '@/hooks/useBusLocation'
import {toast} from "sonner";

interface DriverTrackingMapProps {
    pathRoute: any;
    bus: string;
    assignmentId: number;
    driverId: number;
}

const DriverTrackingMap = ({pathRoute, bus, assignmentId, driverId}: DriverTrackingMapProps) => {
    const mapRef = useRef<any>(null)
    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const [route, setRoute] = useState<any>(null)

    const [steps, setSteps] = useState<any[]>([])
    const [distance, setDistance] = useState<number>(0)
    const [duration, setDuration] = useState<number>(0)
    const [busPos, setBusPos] = useState<[number, number] | null>(null)

    const [open, setOpen] = useState<boolean>(false)
    const [students, setStudents] = useState<any[]>([])
    const [studentPickup, setStudentPickup] = useState<any>(null)

    const [segmentEndIndices, setSegmentEndIndices] = useState<number[]>([])
    const [simulationProgress, setSimulationProgress] = useState<number>(0)

    const { isConnected, sendLocation, trackingMode, updateTrackingMode } = useBusLocationDriver({
        assignment_id: assignmentId,
        driver_id: driverId,
        enabled: true,
        initialTrackingMode: 'simulation'
    })

    const simulationIntervalRef = useRef<NodeJS.Timeout>()
    const gpsWatchIdRef = useRef<number>()
    const animationFrameRef = useRef<number>()

    const ALMOST_THERE_DISTANCE = 1000; // meters
    const almostThereLoggedRef = useRef(false);

    const start = {
        lng: pathRoute?.route_stops[0]?.stop?.longitude,
        lat: pathRoute?.route_stops[0]?.stop?.latitude
    }

    useEffect(() => {
        const fetchFullRoute = async () => {
            try {
                const coordinates: [number, number][] = []
                let totalDistance = 0
                let totalDuration = 0
                const allSteps: any[] = []

                const segmentEndIndices: number[] = [];
                const tempSegmentEndIndices: number[] = []

                for (let i = 0; i < pathRoute.route_stops.length - 1; i++) {
                    const current = pathRoute.route_stops[i].stop;
                    const next = pathRoute.route_stops[i + 1].stop;

                    const res = await api.get('routes/direction_full', {
                        params: {
                            start: `${current.longitude},${current.latitude}`,
                            end: `${next.longitude},${next.latitude}`,
                        },
                    });

                    const { geometry, steps, distance, duration } = res.data;

                    if (geometry?.coordinates?.length > 0) {
                        coordinates.push(...geometry.coordinates)
                        tempSegmentEndIndices.push(coordinates.length - 1)

                        segmentEndIndices.push(coordinates.length - 1);
                    }

                    totalDistance += distance || 0
                    totalDuration += duration || 0

                    if (Array.isArray(steps)) {
                        allSteps.push(...steps)
                    }
                }

                setSegmentEndIndices(tempSegmentEndIndices)

                const fullGeometry = {
                    type: 'LineString',
                    coordinates,
                }

                setRoute(fullGeometry)
                setSteps(allSteps)
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

        if (pathRoute?.route_stops?.length > 1) {
            fetchFullRoute()
        }
    }, [pathRoute])

    const getBusStartProgress = (startTimeStr: string, durationSeconds: number) => {

        const [startHour, startMinute] = startTimeStr.split(':').map(Number)
        const now = new Date()

        const startTime = new Date()
        startTime.setHours(startHour, startMinute, 0, 0)

        const elapsed = (now.getTime() - startTime.getTime()) / 1000
        let progress = elapsed / durationSeconds

        if (progress < 0) progress = 0
        if (progress > 1) progress = 1
        return progress
    }

    const getPositionFromProgress = (coordinates: [number, number][], progress: number) => {
        if (!coordinates || coordinates.length < 2) return coordinates[0]

        const totalDistance = coordinates.reduce((acc, curr, idx) => {
            if (idx === 0) return 0
            const [lng1, lat1] = coordinates[idx - 1]
            const [lng2, lat2] = curr
            const R = 6371000
            const toRad = (deg: number) => (deg * Math.PI) / 180
            const dLat = toRad(lat2 - lat1)
            const dLng = toRad(lng2 - lng1)
            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            return acc + R * c
        }, 0)

        const targetDistance = totalDistance * progress

        let traveled = 0
        for (let i = 1; i < coordinates.length; i++) {
            const [lng1, lat1] = coordinates[i - 1]
            const [lng2, lat2] = coordinates[i]
            const R = 6371000
            const toRad = (deg: number) => (deg * Math.PI) / 180
            const dLat = toRad(lat2 - lat1)
            const dLng = toRad(lng2 - lng1)
            const segmentDistance = 2 * R * Math.atan2(Math.sqrt(Math.sin(dLat / 2) ** 2 +
                    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2),
                Math.sqrt(1 - (Math.sin(dLat / 2) ** 2 +
                    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2))
            )

            if (traveled + segmentDistance >= targetDistance) {
                const remaining = targetDistance - traveled
                const fraction = remaining / segmentDistance
                const lng = lng1 + (lng2 - lng1) * fraction
                const lat = lat1 + (lat2 - lat1) * fraction
                return [lng, lat] as [number, number]
            }

            traveled += segmentDistance
        }

        return coordinates[coordinates.length - 1]
    }

    const startRealTimeSimulation = () => {
        if (!route || !pathRoute?.start_time) return

        let progress = getBusStartProgress(pathRoute.start_time, duration)
        setSimulationProgress(progress)

        const initialPos = getPositionFromProgress(route.coordinates, progress)
        setBusPos(initialPos)

        if (isConnected) {
            sendLocation(initialPos[1], initialPos[0])
        }

        simulationIntervalRef.current = setInterval(() => {
            const newProgress = getBusStartProgress(pathRoute.start_time, duration)
            setSimulationProgress(newProgress)

            const newPos = getPositionFromProgress(route.coordinates, newProgress)
            setBusPos(newPos)

            if (isConnected) {
                sendLocation(newPos[1], newPos[0])
            }
        }, 5000)
    }

    const startAnimatedSimulation = () => {
        if (!route || !pathRoute?.start_time || !mapRef.current || !isMapLoaded) return

        let progress = getBusStartProgress(pathRoute.start_time, duration)
        const initialPos = getPositionFromProgress(route.coordinates, progress)
        setBusPos(initialPos)
        setSimulationProgress(progress)

        if (isConnected) {
            sendLocation(initialPos[1], initialPos[0])
        }

        const map = mapRef.current.getMap()
        let lastTimestamp = 0
        let currentStopIndex = 0
        let isWaiting = false
        let waitTimeout: any = null

        const coordinates = route.coordinates
        if (!coordinates || coordinates.length < 2) return

        const desiredSimTime = duration / 30
        const simulatedSpeed = distance / desiredSimTime

        const getDistance = (lng1: number, lat1: number, lng2: number, lat2: number) => {
            const R = 6371000
            const toRad = (deg: number) => (deg * Math.PI) / 180
            const dLat = toRad(lat2 - lat1)
            const dLng = toRad(lng2 - lng1)
            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            return R * c
        }

        const animateBus = (timestamp: number) => {
            if (!lastTimestamp) lastTimestamp = timestamp
            const deltaTime = (timestamp - lastTimestamp) / 1000
            lastTimestamp = timestamp

            if (isWaiting) {
                animationFrameRef.current = requestAnimationFrame(animateBus)
                return
            }

            const currentProgress = getBusStartProgress(pathRoute.start_time, duration)

            if (currentProgress >= 1) {
                progress = 1
                setBusPos(coordinates[coordinates.length - 1])
                setSimulationProgress(1)
                return
            }

            progress += (simulatedSpeed * deltaTime) / distance
            if (progress > currentProgress) {
                progress = currentProgress
            }

            let traveled = 0
            let segmentIndex = 0
            let segmentFraction = 0
            for (let i = 1; i < coordinates.length; i++) {
                const segDist = getDistance(
                    coordinates[i - 1][0],
                    coordinates[i - 1][1],
                    coordinates[i][0],
                    coordinates[i][1]
                )
                if ((traveled + segDist) / distance >= progress) {
                    segmentIndex = i - 1
                    segmentFraction = (progress * distance - traveled) / segDist
                    break
                }
                traveled += segDist
            }

            const [lng1, lat1] = coordinates[segmentIndex]
            const [lng2, lat2] = coordinates[segmentIndex + 1]
            const lng = lng1 + (lng2 - lng1) * segmentFraction
            const lat = lat1 + (lat2 - lat1) * segmentFraction

            const newPos: [number, number] = [lng, lat]
            setBusPos(newPos)
            setSimulationProgress(progress)

            const currentTime = Date.now()
            if (currentTime % 5000 < 16) { // ~5 giây
                if (isConnected) {
                    sendLocation(lat, lng)
                }
            }

            // Calculate how much distance bus has traveled
            let traveledDistance = 0;
            for (let i = 1; i < coordinates.length; i++) {
                const segDist = getDistance(
                    coordinates[i - 1][0],
                    coordinates[i - 1][1],
                    coordinates[i][0],
                    coordinates[i][1]
                );

                if ((traveledDistance + segDist) / distance >= progress) {
                    traveledDistance += (progress * distance - traveledDistance);
                    break;
                }
                traveledDistance += segDist;
            }

            // Calculate remaining distance
            const remainingDistance = distance - traveledDistance;

            // Trigger once when bus is almost there
            if (!almostThereLoggedRef.current && remainingDistance <= ALMOST_THERE_DISTANCE) {
                console.log("Almost there!");
                almostThereLoggedRef.current = true;
            }

            // check if reached a stop
            if (currentStopIndex < segmentEndIndices.length &&
                segmentIndex >= segmentEndIndices[currentStopIndex]) {
                isWaiting = true
                waitTimeout = setTimeout(() => {
                    isWaiting = false
                }, 1200)
                currentStopIndex++
            }

            animationFrameRef.current = requestAnimationFrame(animateBus)
        }

        map.once("moveend", () => {
            animationFrameRef.current = requestAnimationFrame(animateBus)
        })
    }

    const startGPSTracking = () => {
        if (!navigator.geolocation) {
            console.error('Geolocation is not supported by this browser.')
            return
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }

        const checkPermission = async () => {
            try {
                const permission = await navigator.permissions.query({ name: 'geolocation' });
                if (permission.state === 'denied') {
                    alert('Vui lòng cho phép truy cập vị trí trong cài đặt trình duyệt');
                    return false;
                }
                return true;
            } catch (error) {
                console.error('Error checking permission:', error);
                return true;
            }
        }

        checkPermission()

        gpsWatchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                const newPos: [number, number] = [longitude, latitude]
                setBusPos(newPos)

                if (isConnected) {
                    sendLocation(latitude, longitude)
                }
            },
            (error) => {
                console.error('Error getting GPS location:', error)
                toast.error('Lỗi khi lấy vị trí GPS. Vui lòng kiểm tra cài đặt vị trí của bạn.')
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        console.error('User denied the request for Geolocation.');
                        alert('Vui lòng cho phép truy cập vị trí để sử dụng GPS thật');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.error('Location information is unavailable.');
                        break;
                    case error.TIMEOUT:
                        console.error('The request to get user location timed out.');
                        break;
                    default:
                        console.error('An unknown error occurred.');
                        break;
                }
                updateTrackingMode('simulation');
            },
            options
        )
    }

    useEffect(() => {
        if (simulationIntervalRef.current) {
            clearInterval(simulationIntervalRef.current)
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
        }
        if (gpsWatchIdRef.current) {
            navigator.geolocation.clearWatch(gpsWatchIdRef.current)
        }

        if (trackingMode === 'simulation' && route) {
            startAnimatedSimulation()
        } else if (trackingMode === 'gps') {
            startGPSTracking()
        }

        return () => {
            if (simulationIntervalRef.current) {
                clearInterval(simulationIntervalRef.current)
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            if (gpsWatchIdRef.current) {
                navigator.geolocation.clearWatch(gpsWatchIdRef.current)
            }
        }
    }, [trackingMode, route, isConnected, isMapLoaded])

    const getStudentsAtRouteStop = async (routeStopId: number, pickup: any) => {
        const res = await api.get(`route_stop_student/${routeStopId}`)
        const list = res.data.map((item: any) => item.student)
        setStudents(list)
        setStudentPickup(pickup)
        setOpen(true)
    }

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

    return (
        <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='mb-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    {isConnected ? (
                        <>
                            <Wifi className='text-green-500' size={20} />
                            <span className='text-sm text-green-600 font-medium'>
                                Đang phát sóng trực tiếp
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

                <div className='flex items-center gap-2 bg-gray-100 rounded-lg p-1'>
                    <button
                        onClick={() => updateTrackingMode('simulation')}
                        className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
                            trackingMode === 'simulation'
                                ? 'bg-white shadow-sm text-blue-600'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        <Cpu size={16} />
                        <span>Giả lập</span>
                    </button>
                    <button
                        onClick={() => updateTrackingMode('gps')}
                        className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
                            trackingMode === 'gps'
                                ? 'bg-white shadow-sm text-green-600'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        <Navigation size={16} />
                        <span>GPS Thật</span>
                    </button>
                </div>
            </div>

            <div className='mb-4 grid grid-cols-3 gap-4 text-sm'>
                <div className='bg-blue-50 p-3 rounded-lg'>
                    <p className='text-gray-600'>Giờ bắt đầu</p>
                    <p className='font-semibold text-gray-900'>{pathRoute.start_time}</p>
                </div>
                <div className='bg-green-50 p-3 rounded-lg'>
                    <p className='text-gray-600'>Thời gian còn lại</p>
                    <p className='font-semibold text-gray-900'>{getRemainingTime()}</p>
                </div>
                <div className='bg-purple-50 p-3 rounded-lg'>
                    <p className='text-gray-600'>Quãng đường</p>
                    <p className='font-semibold text-gray-900'>{(distance / 1000).toFixed(2)} km</p>
                </div>
            </div>

            {trackingMode === 'simulation' && (
                <div className='mb-4'>
                    <div className='flex justify-between text-sm text-gray-600 mb-1'>
                        <span>Tiến độ hành trình</span>
                        <span>{Math.round(simulationProgress * 100)}%</span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                            className='bg-blue-600 h-2 rounded-full transition-all duration-500'
                            style={{ width: `${simulationProgress * 100}%` }}
                        />
                    </div>
                </div>
            )}

            <div className='relative w-full h-[450px] bg-gray-200 rounded-md overflow-hidden'>
                <Map
                    ref={mapRef}
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    initialViewState={{
                        longitude: start.lng,
                        latitude: start.lat,
                        zoom: 12
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
                        <Marker longitude={busPos[0]} latitude={busPos[1]} anchor='bottom'>
                            <div className='flex flex-col items-center'>
                                <div className='bg-white p-2 rounded-lg shadow-md mb-1'>
                                    <p className='text-sm font-semibold text-gray-900'>
                                        {bus}
                                    </p>
                                    <p className='text-xs text-gray-500'>
                                        {trackingMode === 'gps' ? 'GPS Thật' : 'Giả lập'}
                                    </p>
                                </div>
                                <div className={`relative bg-white rounded-full p-1 shadow-md border z-20 ${
                                    trackingMode === 'gps' ? 'border-green-500' : 'border-yellow-500'
                                }`}>
                                    <Bus
                                        size={24}
                                        className={trackingMode === 'gps' ? 'text-green-600' : 'text-yellow-600'}
                                    />
                                </div>
                            </div>
                        </Marker>
                    )}

                    {pathRoute.route_stops.map((stop: any, index: number) => (
                        <Marker
                            key={index}
                            longitude={stop.stop.longitude}
                            latitude={stop.stop.latitude}
                            anchor='bottom'
                            onClick={() => getStudentsAtRouteStop(stop.route_stop_id, stop.stop.address)}
                        >
                            <div className='flex flex-col items-center'>
                                <div className='bg-white p-2 rounded-lg shadow-md mb-1'>
                                    <p className='text-xs font-semibold text-gray-900'>
                                        {index + 1}. {stop.stop.address}
                                    </p>
                                </div>
                                {
                                    index === 0 ? (
                                        <div className="relative flex items-center justify-center">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <div className="relative bg-green-500 text-white p-2 rounded-full border-2 border-white shadow-xl transform hover:scale-110 transition-transform">
                                                <MapPin size={20} />
                                            </div>
                                        </div>
                                    ) : index === pathRoute.route_stops.length - 1 ? (
                                        <div className="relative flex items-center justify-center">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <div className="relative bg-red-500 text-white p-2 rounded-full border-2 border-white shadow-xl transform hover:scale-110 transition-transform">
                                                <MapPin size={20} />
                                            </div>
                                        </div>
                                    ) : (
                                        <BusFront size={24} className='text-blue-500 fill-blue-400' />
                                    )
                                }
                            </div>
                        </Marker>
                    ))}
                </Map>

                {!isMapLoaded && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black/30 z-10'>
                        <span className='text-white text-lg font-bold bg-black/50 px-4 py-2 rounded'>
                          Loading Map...
                        </span>
                    </div>
                )}
            </div>

            {steps?.length > 0 && (
                <div className='mt-6 border-t pt-4 flex flex-col gap-2'>
                    <h3 className='text-lg font-semibold'>Hướng dẫn lộ trình</h3>
                    <p className=''>
                        Khoảng cách: {(distance / 1000).toFixed(2)} km
                    </p>
                    {(() => {
                        const totalMinutes = Math.round(duration / 60);
                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;
                        return (
                            <p>
                                Thời gian ước tính{" "}
                                {hours > 0
                                    ? `${hours} giờ ${minutes > 0 ? `${minutes} phút` : ""}`
                                    : `${minutes} phút`}
                            </p>
                        );
                    })()}
                    <div className='max-h-[200px] overflow-y-auto space-y-2'>
                        {steps.map((step, i) => (
                            <div
                                key={i}
                                className='flex items-start space-x-2 border-l-4 border-blue-500 pl-3'
                            >
                                <ArrowRight className='w-4 h-4 mt-1 text-blue-500' />
                                <p className='text-sm text-gray-700'>{step.maneuver.instruction}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {open && <StudentPopup students={students} studentPickup={studentPickup} setOpen={setOpen} />}

        </div>
    )
}

export default DriverTrackingMap