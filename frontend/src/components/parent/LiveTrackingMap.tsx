'use client'

import React, {useContext, useEffect, useRef, useState} from 'react'
import { Bus, BusFront, MapPin, User } from 'lucide-react'
import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl'
import api from "@/lib/axios";
import mapboxgl from "mapbox-gl";
import {useAuth} from "@/contexts/AuthContext";

interface LiveTrackingMapProps {
    pathRoute: any;
    assignedStop: any;
}

const LiveTrackingMap = ({ pathRoute, assignedStop }: LiveTrackingMapProps) => {
    const mapRef = useRef<any>(null)
    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const [route, setRoute] = useState<any>(null)

    const [distance, setDistance] = useState<number>(0)
    const [duration, setDuration] = useState<number>(0)
    const [busPos, setBusPos] = useState<[number, number] | null>(null)

    const routeStops = pathRoute?.route_stops || [];
    const startStop = routeStops.length > 0 ? routeStops[0].stop : null;

    const [segmentEndIndices, setSegmentEndIndices] = useState<number[]>([]);

    const ALMOST_THERE_DISTANCE = 1000; // meters
    const almostThereLoggedRef = useRef(false);

    const { user } = useAuth()

    useEffect(() => {
        const fetchFullRoute = async () => {
            if (!pathRoute || routeStops.length < 2) return;

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
        if (!route || !mapRef.current || !isMapLoaded)
            return;

        let progress = getBusStartProgress(pathRoute.start_time, duration);
        const initialPos = getPositionFromProgress(route.coordinates, progress);
        setBusPos(initialPos);

        const desiredSimTime = duration / 500;
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
                createAlmostNotification().catch(error => console.error(error));
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

    if (!pathRoute || routeStops.length < 2) {
        return (
            <div className='bg-white rounded-lg shadow-lg p-6'>
                <div className='relative w-full h-[450px] bg-gray-200 rounded-md flex items-center justify-center'>
                    <p className='text-gray-500'>Đang tải dữ liệu bản đồ...</p>
                </div>
            </div>
        )
    }

    const initialLng = assignedStop ? Number(assignedStop.longitude) : Number(startStop?.longitude || 105.8);
    const initialLat = assignedStop ? Number(assignedStop.latitude) : Number(startStop?.latitude || 21.0);

    return (
        <div className='bg-white rounded-lg shadow-lg p-6'>
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
                                        SGU-001
                                    </p>
                                </div>
                                <div className='relative bg-white rounded-full p-1 shadow-md border border-yellow-500 z-20'>
                                    <Bus size={24} className='text-yellow-600' />
                                </div>
                            </div>
                        </Marker>
                    )}

                    {routeStops.map((stopItem: any, index: number) => {
                        const stop = stopItem.stop;
                        const isAssigned = assignedStop && stop.stop_id === assignedStop.stop_id;
                        const isStart = index === 0;
                        const isSchool = index === routeStops.length - 1;

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
        </div>
    )
}

export default LiveTrackingMap;