"use client"

import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from "mapbox-gl";
import api from "@/lib/axios";
import Map, {Layer, Marker, NavigationControl, Source} from "react-map-gl";
import {ArrowRight, Bus, MapPin} from "lucide-react";

const DriverTrackingMap = ({pathRoute}: any) => {
    const mapRef = useRef<any>(null)
    console.log(pathRoute.route_stops[0].stop.address)
    console.log(pathRoute.route_stops[6].stop.address)
    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const [route, setRoute] = useState<any>(null)

    const [steps, setSteps] = useState<any[]>([]);
    const [distance, setDistance] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [busPos, setBusPos] = useState<[number, number] | null>(null);

    const start = {
        lng: pathRoute.route_stops[0].stop.longitude,
        lat: pathRoute.route_stops[0].stop.latitude
    }
    const end = {
        lng: pathRoute.route_stops[6].stop.longitude,
        lat: pathRoute.route_stops[6].stop.latitude
    }

    // useEffect(() => {
    //     const fetchRoute = async () => {
    //         try {
    //             const res = await api.get(
    //                 `routes/direction_full`,
    //                 {
    //                     params: {
    //                         start: `${start.lng},${start.lat}`,
    //                         end: `${end.lng},${end.lat}`,
    //                     }
    //                 }
    //             )
    //
    //             const { geometry, steps, distance, duration } = res.data
    //
    //             setRoute(geometry)
    //             setSteps(steps)
    //             setDistance(distance)
    //             setDuration(duration)
    //
    //             if (mapRef.current && geometry.coordinates.length > 0) {
    //                 const bounds = new mapboxgl.LngLatBounds()
    //                 geometry.coordinates.forEach(([lng, lat]: [number, number]) => {
    //                     bounds.extend([lng, lat])
    //                 })
    //                 mapRef.current.fitBounds(bounds, { padding: 50 })
    //             }
    //         }
    //         catch (error) {
    //             console.error('Error fetching route direction:', error)
    //         }
    //     }
    //
    //     fetchRoute()
    // }, [])

    useEffect(() => {
        const fetchFullRoute = async () => {
            try {
                const coordinates: [number, number][] = [];

                for (let i = 0; i < pathRoute.route_stops.length - 1; i++) {
                    const current = pathRoute.route_stops[i].stop;
                    const next = pathRoute.route_stops[i + 1].stop;

                    const res = await api.get("routes/direction_full", {
                        params: {
                            start: `${current.longitude},${current.latitude}`,
                            end: `${next.longitude},${next.latitude}`,
                        },
                    });

                    const { geometry } = res.data;
                    if (geometry?.coordinates?.length > 0) {
                        coordinates.push(...geometry.coordinates);
                    }
                }

                // Gộp tất cả đoạn thành 1 tuyến hoàn chỉnh
                const fullGeometry = {
                    type: "LineString",
                    coordinates,
                };

                setRoute(fullGeometry);

                // Fit map theo toàn tuyến
                if (mapRef.current && coordinates.length > 0) {
                    const bounds = new mapboxgl.LngLatBounds();
                    coordinates.forEach(([lng, lat]) => bounds.extend([lng, lat]));
                    mapRef.current.fitBounds(bounds, { padding: 50 });
                }

                console.log("✅ Route loaded with", coordinates.length, "points");
            } catch (error) {
                console.error("❌ Error fetching full route:", error);
            }
        };

        fetchFullRoute();
    }, [pathRoute]);


    // useEffect(() => {
    //     if (!route || !mapRef.current || !isMapLoaded)
    //         return
    //
    //     const map = mapRef.current.getMap()
    //
    //     const startMovingBus = () => {
    //         let index = 0
    //         const speed = 3000
    //
    //         const moveBus = () => {
    //             if (index >= route.coordinates.length - 1)
    //                 return
    //
    //             const [lng1, lat1] = route.coordinates[index + 1]
    //
    //             setBusPos([lng1, lat1])
    //             index += 1
    //             setTimeout(moveBus, speed)
    //         }
    //
    //         moveBus()
    //     }
    //
    //     map.once('moveend', startMovingBus)
    //
    //     return () => map.off('moveend', startMovingBus)
    // }, [route, isMapLoaded])

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
                                        Xe buýt
                                    </p>
                                    <p className='text-xs text-gray-600'>Bus: 101</p>
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
                                        {stop.stop.address}
                                    </p>
                                </div>
                                <MapPin size={32} className='text-green-500 fill-green-400'  />
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
                <div className="mt-6 border-t pt-4 flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">Hướng dẫn lộ trình</h3>
                    <p className="">
                        Khoảng cách: {(distance / 1000).toFixed(2)} km
                    </p>
                    <p>Thời gian ước tính {(duration / 60).toFixed(1)} phút</p>
                    <div className="max-h-[200px] overflow-y-auto space-y-2">
                        {steps.map((step, i) => (
                            <div
                                key={i}
                                className="flex items-start space-x-2 border-l-4 border-blue-500 pl-3"
                            >
                                <ArrowRight className="w-4 h-4 mt-1 text-blue-500" />
                                <p className="text-sm text-gray-700">{step.maneuver.instruction}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriverTrackingMap;