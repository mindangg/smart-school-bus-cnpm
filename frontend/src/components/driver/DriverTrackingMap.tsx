'use client'

import React, {useEffect, useRef, useState} from 'react'
import mapboxgl from 'mapbox-gl'
import api from '@/lib/axios'
import Map, {Layer, Marker, NavigationControl, Source} from 'react-map-gl'
import {ArrowRight, Bus, BusFront, MapPin} from 'lucide-react'

const DriverTrackingMap = ({pathRoute, bus}: any) => {
    const mapRef = useRef<any>(null)
    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const [route, setRoute] = useState<any>(null)

    const [steps, setSteps] = useState<any[]>([])
    const [distance, setDistance] = useState<number>(0)
    const [duration, setDuration] = useState<number>(0)
    const [busPos, setBusPos] = useState<[number, number] | null>(null)

    const start = {
        lng: pathRoute?.route_stops[0]?.stop?.longitude,
        lat: pathRoute?.route_stops[0]?.stop?.latitude
    }
    const end = {
        lng: pathRoute?.route_stops[6]?.stop?.longitude,
        lat: pathRoute?.route_stops[6]?.stop?.latitude
    }

    useEffect(() => {
        const fetchFullRoute = async () => {
            try {
                const coordinates: [number, number][] = []
                let totalDistance = 0
                let totalDuration = 0
                const allSteps: any[] = []

                for (let i = 0; i < pathRoute.route_stops.length - 1; i++) {
                    const current = pathRoute.route_stops[i].stop
                    const next = pathRoute.route_stops[i + 1].stop

                    const res = await api.get('routes/direction_full', {
                        params: {
                            start: `${current.longitude},${current.latitude}`,
                            end: `${next.longitude},${next.latitude}`,
                        },
                    })

                    const { geometry, steps, distance, duration } = res.data

                    if (geometry?.coordinates?.length > 0) {
                        coordinates.push(...geometry.coordinates)
                    }

                    totalDistance += distance || 0
                    totalDuration += duration || 0

                    if (Array.isArray(steps)) {
                        allSteps.push(...steps)
                    }
                }

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

    useEffect(() => {
        if (!route || !mapRef.current || !isMapLoaded)
            return;

        // const desiredSimTime = 120;
        const desiredSimTime = duration / 30;

        const map = mapRef.current.getMap();
        let animationFrameId: number;
        let progress = 0;

        const coordinates = route.coordinates;
        if (!coordinates || coordinates.length < 2) return;

        const simulatedSpeed = distance / desiredSimTime; // m/s

        // Tính khoảng cách thực (mét)
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

        let segmentIndex = 0;
        let lastTimestamp = 0;

        const animateBus = (timestamp: number) => {
            if (!lastTimestamp) lastTimestamp = timestamp;

            const deltaTime = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            const [lng1, lat1] = coordinates[segmentIndex];
            const [lng2, lat2] = coordinates[segmentIndex + 1];

            const segmentLength = getDistance(lng1, lat1, lng2, lat2);
            const travelFraction = (simulatedSpeed * deltaTime) / segmentLength;
            progress += travelFraction;

            if (progress >= 1) {
                progress = 0;
                segmentIndex++;
                if (segmentIndex >= coordinates.length - 1)
                    return;
            }

            const lng = lng1 + (lng2 - lng1) * progress;
            const lat = lat1 + (lat2 - lat1) * progress;
            setBusPos([lng, lat]);

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
                                <Bus size={32} className='text-yellow-500 fill-yellow-400' />
                            </div>
                        </Marker>
                    )}

                    {pathRoute.route_stops.map((stop: any, index: number) => (
                        <Marker
                            key={index}
                            longitude={stop.stop.longitude}
                            latitude={stop.stop.latitude}
                            anchor='bottom'
                        >
                            <div className='flex flex-col items-center'>
                                <div className='bg-white p-2 rounded-lg shadow-md mb-1'>
                                    <p className='text-sm font-semibold text-gray-900'>
                                        {index + 1}. {stop.stop.address}
                                    </p>
                                </div>
                                {
                                    index == 0 ? <MapPin size={32} className='text-green-500 fill-green-400'  /> :
                                    index == 6 ? <MapPin size={32} className='text-red-500 fill-red-400'  /> :
                                    <BusFront size={25} className='text-blue-500 fill-blue-400' />
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
        </div>
    )
}

export default DriverTrackingMap