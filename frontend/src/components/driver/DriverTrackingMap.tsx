'use client'

import React, {useEffect, useRef, useState} from 'react'
import mapboxgl from 'mapbox-gl'
import api from '@/lib/axios'
import Map, {Layer, Marker, NavigationControl, Source} from 'react-map-gl'
import {ArrowRight, Bus, BusFront, MapPin} from 'lucide-react'
import StudentPopup from "@/components/driver/StudentPopup";

const DriverTrackingMap = ({pathRoute, bus}: any) => {
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

    const [segmentEndIndices, setSegmentEndIndices] = useState<number[]>([]);

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
                        coordinates.push(...geometry.coordinates);

                        segmentEndIndices.push(coordinates.length - 1);
                    }

                    totalDistance += distance || 0;
                    totalDuration += duration || 0;

                    if (Array.isArray(steps)) {
                        allSteps.push(...steps);
                    }
                }

                setSegmentEndIndices(segmentEndIndices);

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
        const [startHour, startMinute] = startTimeStr.split(':').map(Number);
        const now = new Date();
        now.setHours(6, 0, 0, 0); // test

        const startTime = new Date();
        startTime.setHours(startHour, startMinute, 0, 0);

        const elapsed = (now.getTime() - startTime.getTime()) / 1000;
        let progress = elapsed / durationSeconds;

        if (progress < 0) progress = 0;   // bus hasn't started
        if (progress > 1) progress = 1;   // bus already finished
        return progress;
    };

    const getPositionFromProgress = (coordinates: [number, number][], progress: number) => {
        if (!coordinates || coordinates.length < 2) return coordinates[0];

        const totalDistance = coordinates.reduce((acc, curr, idx) => {
            if (idx === 0) return 0;
            const [lng1, lat1] = coordinates[idx - 1];
            const [lng2, lat2] = curr;
            const R = 6371000;
            const toRad = (deg: number) => (deg * Math.PI) / 180;
            const dLat = toRad(lat2 - lat1);
            const dLng = toRad(lng2 - lng1);
            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return acc + R * c;
        }, 0);

        const targetDistance = totalDistance * progress;

        let traveled = 0;
        for (let i = 1; i < coordinates.length; i++) {
            const [lng1, lat1] = coordinates[i - 1];
            const [lng2, lat2] = coordinates[i];
            const R = 6371000;
            const toRad = (deg: number) => (deg * Math.PI) / 180;
            const dLat = toRad(lat2 - lat1);
            const dLng = toRad(lng2 - lng1);
            const segmentDistance = 2 * R * Math.atan2(Math.sqrt(Math.sin(dLat / 2) ** 2 +
                    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2),
                Math.sqrt(1 - (Math.sin(dLat / 2) ** 2 +
                    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2))
            );

            if (traveled + segmentDistance >= targetDistance) {
                const remaining = targetDistance - traveled;
                const fraction = remaining / segmentDistance;
                const lng = lng1 + (lng2 - lng1) * fraction;
                const lat = lat1 + (lat2 - lat1) * fraction;
                return [lng, lat] as [number, number];
            }

            traveled += segmentDistance;
        }

        return coordinates[coordinates.length - 1];
    };

    useEffect(() => {
        if (!route || !mapRef.current || !isMapLoaded)
            return;

        let progress = getBusStartProgress(pathRoute.start_time, duration);
        const initialPos = getPositionFromProgress(route.coordinates, progress);
        setBusPos(initialPos);

        const desiredSimTime = duration / 30;
        const map = mapRef.current.getMap();
        let animationFrameId: number;

        let isWaiting = false;
        let waitTimeout: any = null;
        let currentStopIndex = 0;

        const coordinates = route.coordinates;
        if (!coordinates || coordinates.length < 2) return;

        const simulatedSpeed = distance / desiredSimTime;

        const getDistance = (lng1: number, lat1: number, lng2: number, lat2: number) => {
            const R = 6371000;
            const toRad = (deg: number) => (deg * Math.PI) / 180;
            const dLat = toRad(lat2 - lat1);
            const dLng = toRad(lng2 - lng1);
            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        let lastTimestamp = 0;
        const animateBus = (timestamp: number) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const deltaTime = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            if (isWaiting) {
                animationFrameId = requestAnimationFrame(animateBus);
                return;
            }

            // update progress along the total route
            progress += (simulatedSpeed * deltaTime) / distance; // progress: 0 → 1

            if (progress >= 1) {
                progress = 1; // bus reached the end
                setBusPos(coordinates[coordinates.length - 1]);
                return;
            }

            // find the current segment and local fraction
            let traveled = 0;
            let segmentIndex = 0;
            let segmentFraction = 0;
            for (let i = 1; i < coordinates.length; i++) {
                const segDist = getDistance(
                    coordinates[i - 1][0],
                    coordinates[i - 1][1],
                    coordinates[i][0],
                    coordinates[i][1]
                );
                if ((traveled + segDist) / distance >= progress) {
                    segmentIndex = i - 1;
                    segmentFraction = (progress * distance - traveled) / segDist;
                    break;
                }
                traveled += segDist;
            }

            const [lng1, lat1] = coordinates[segmentIndex];
            const [lng2, lat2] = coordinates[segmentIndex + 1];
            const lng = lng1 + (lng2 - lng1) * segmentFraction;
            const lat = lat1 + (lat2 - lat1) * segmentFraction;
            setBusPos([lng, lat]);

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
                isWaiting = true;
                waitTimeout = setTimeout(() => {
                    isWaiting = false;
                }, 1200);
                currentStopIndex++;
            }

            animationFrameId = requestAnimationFrame(animateBus);
        };

        map.once("moveend", () => {
            animationFrameId = requestAnimationFrame(animateBus);
        });

        return () => {
            if (animationFrameId)
                cancelAnimationFrame(animationFrameId);

            map.off("moveend", animateBus);
        };
    }, [route, isMapLoaded, distance, duration]);

    // useEffect(() => {
    //     if (!busPos)
    //         return;
    //
    //     setInterval(() => {
    //         console.log('Vị trí xe buýt:', busPos);
    //     }, 1000);
    // }, [busPos]);

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

    const getStudentsAtRouteStop = async (routeStopId: number, pickup: any) => {
        const res = await api.get(`route_stop_student/${routeStopId}`)
        const list = res.data.map((item: any) => item.student)
        setStudents(list)
        setStudentPickup(pickup)
        setOpen(true)
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
                                </div>
                                <div className='relative bg-white rounded-full p-1 shadow-md border border-yellow-500 z-20'>
                                    <Bus size={24} className='text-yellow-600' />
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