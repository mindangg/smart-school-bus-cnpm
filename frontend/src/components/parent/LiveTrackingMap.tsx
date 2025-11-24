'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Bus, BusFront, MapPin, User } from 'lucide-react'
import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl'
import api from "@/lib/axios";
import mapboxgl from "mapbox-gl";

interface LiveTrackingMapProps {
    pathRoute: any;
    assignedStop: any;
}

const LiveTrackingMap = ({ pathRoute, assignedStop }: LiveTrackingMapProps) => {
    const mapRef = useRef<any>(null)
    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const [routeGeometry, setRouteGeometry] = useState<any>(null)

    const [distance, setDistance] = useState<number>(0)
    const [duration, setDuration] = useState<number>(0)
    const [busPos, setBusPos] = useState<[number, number] | null>(null)

    const routeStops = pathRoute?.route_stops || [];
    const startStop = routeStops.length > 0 ? routeStops[0].stop : null;
    const schoolStop = routeStops.length > 0 ? routeStops[routeStops.length - 1].stop : null;

    useEffect(() => {
        const fetchFullRoute = async () => {
            if (!pathRoute || routeStops.length < 2) return;

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

    useEffect(() => {
        if (!routeGeometry || !mapRef.current || !isMapLoaded) return;

        const desiredSimTime = duration / 30;
        const map = mapRef.current.getMap();
        let animationFrameId: number;
        let progress = 0;

        const coordinates = routeGeometry.coordinates;
        if (!coordinates || coordinates.length < 2) return;

        const simulatedSpeed = distance / desiredSimTime; 

        const getDistance = (lng1: number, lat1: number, lng2: number, lat2: number) => {
            const R = 6371000;
            const toRad = (deg: number) => (deg * Math.PI) / 180;
            const dLat = toRad(lat2 - lat1);
            const dLng = toRad(lng2 - lng1);
            const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
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
                if (segmentIndex >= coordinates.length - 1) {
                     return;
                }
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
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            map.off("moveend", animateBus);
        };
    }, [routeGeometry, isMapLoaded, distance, duration]);

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