'use client'

import React, {useEffect, useRef, useState} from 'react'
import {Bus, MapPin} from 'lucide-react'
import Map, {Layer, Marker, NavigationControl, Source} from 'react-map-gl'
import mapboxgl from "mapbox-gl";
import api from "@/lib/axios";

const BusRoutesMap = () => {
    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const [route, setRoute] = useState<any>(null)
    const mapRef = useRef<any>(null)
    const busMarkerRef = useRef<mapboxgl.Marker | null>(null)

    const start = { lng: 106.686036, lat: 10.762145 } // Trần Hưng Đạo - Nguyễn Văn Cừ
    const end = { lng: 106.682330, lat: 10.759948 }   // Đại học Sài Gòn (Cổng 1)
    // Fetch route from Mapbox Directions API
    useEffect(() => {
        const fetchRoute = async () => {
            try {
                const res = await api.get(
                    `routes/direction`,
                    {
                        params: {
                            start: `${start.lng},${start.lat}`,
                            end: `${end.lng},${end.lat}`,
                        }
                    }
                )
                setRoute(res.data.routes[0].geometry)
            }
            catch (error) {
                console.error('Error fetching route direction:', error)
            }
        };

        fetchRoute();
    }, [])

    // useEffect(() => {
    //     if (!isMapLoaded || !mapRef.current) return;
    //
    //     const map = mapRef.current.getMap();
    //
    //     // Create the bus marker element
    //     const busContainer = document.createElement('div');
    //     busContainer.style.width = '40px';
    //     busContainer.style.height = '40px';
    //     busContainer.style.display = 'flex';
    //     busContainer.style.alignItems = 'center';
    //     busContainer.style.justifyContent = 'center';
    //     busContainer.style.transition = 'transform 0.1s linear';
    //
    //     const root = createRoot(busContainer);
    //     root.render(<Bus size={32} className="text-yellow-500 fill-yellow-400" />);
    //
    //     const marker = new mapboxgl.Marker({ element: busContainer })
    //         .setLngLat(start)
    //         .addTo(map);
    //
    //     busMarkerRef.current = marker;
    //
    //     // Animation setup
    //     let progress = 0;
    //     const duration = 8000; // ms — full travel time
    //     const startTime = performance.now();
    //
    //     const animate = (time: number) => {
    //         const elapsed = time - startTime;
    //         progress = Math.min(elapsed / duration, 1);
    //
    //         // Linear interpolation between start and end
    //         const lng = start.lng + (end.lng - start.lng) * progress;
    //         const lat = start.lat + (end.lat - start.lat) * progress;
    //
    //         marker.setLngLat({ lng, lat });
    //
    //         // Rotate towards destination
    //         const bearing = Math.atan2(end.lng - start.lng, end.lat - start.lat) * (180 / Math.PI);
    //         busContainer.style.transform = `rotate(${bearing}deg)`;
    //
    //         if (progress < 1) {
    //             requestAnimationFrame(animate);
    //         } else {
    //             console.log('🚌 Reached destination');
    //         }
    //     };
    //
    //     requestAnimationFrame(animate);
    //
    //     return () => {
    //         marker.remove();
    //         queueMicrotask(() => {
    //             try {
    //                 root.unmount();
    //             } catch (err) {
    //                 console.warn('Unmount skipped:', err);
    //             }
    //         });
    //     };
    // }, [isMapLoaded]);

    return (
        <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='relative w-full h-[450px] bg-gray-200 rounded-md overflow-hidden'>
                <Map
                    ref={mapRef}
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    initialViewState={{
                        longitude: start.lng,
                        latitude: start.lat,
                        zoom: 15,
                    }}

                    style={{ width: '100%', height: '100%' }}

                    mapStyle='mapbox://styles/mapbox/streets-v11'

                    onLoad={() => setIsMapLoaded(true)}
                >
                    <NavigationControl position='top-right' />

                    {/* Draw route line */}
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

                    <Marker
                        longitude={start.lng}
                        latitude={start.lat}
                        anchor='bottom'
                    >
                        <div className='flex flex-col items-center'>
                            <div className='bg-white p-2 rounded-lg shadow-md mb-1'>
                                <p className='text-sm font-semibold text-gray-900'>Jane Doe's Bus</p>
                                <p className='text-xs text-gray-600'>Bus: 101</p>
                            </div>
                            <Bus size={32} className='text-yellow-500 fill-yellow-400' />
                        </div>
                    </Marker>

                    <Marker longitude={end.lng} latitude={end.lat} anchor='bottom'>
                        <div className='bg-white p-2 rounded-lg shadow-md mb-1'>
                            <p className='text-sm font-semibold text-gray-900'>Trường Đại Học Sài Gòn</p>
                        </div>
                        <MapPin size={32} className='text-red-500 fill-red-400'  />
                    </Marker>
                </Map>

                {!isMapLoaded && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black/30 z-10'>
                        <span className='text-white text-lg font-bold bg-black/50 px-4 py-2 rounded'>
                          Loading Map...
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusRoutesMap;