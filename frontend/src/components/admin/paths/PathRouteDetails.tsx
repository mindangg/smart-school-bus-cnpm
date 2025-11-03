'use client'

import React, {useEffect, useRef, useState} from 'react'
import Map, {Layer, Marker, NavigationControl, Source} from 'react-map-gl'
import {Bus, MapPin} from 'lucide-react'
import mapboxgl from 'mapbox-gl'
import api from '@/lib/axios'

const PathRouteDetails = ({ pathRoute } : any) => {
    const mapRef = useRef<any>(null)

    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const [route, setRoute] = useState<any>(null)

    const start = {
        lng: pathRoute.route_stops[0].stop.longitude,
        lat: pathRoute.route_stops[0].stop.latitude
    }
    const end = {
        lng: pathRoute.route_stops[1].stop.longitude,
        lat: pathRoute.route_stops[1].stop.latitude
    }

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
    }, [])

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

                    <Marker longitude={start.lng} latitude={start.lat} anchor='bottom'>
                        <div className='flex flex-col items-center'>
                            <div className='bg-white p-2 rounded-lg shadow-md mb-1'>
                                <p className='text-sm font-semibold text-gray-900'>
                                    {pathRoute.route_stops[0].stop.address}
                                </p>
                            </div>
                            <MapPin size={32} className='text-green-500 fill-green-400'  />
                        </div>
                    </Marker>

                    <Marker longitude={end.lng} latitude={end.lat} anchor='bottom'>
                        <div className='bg-white p-2 rounded-lg shadow-md mb-1'>
                            <p className='text-sm font-semibold text-gray-900'>
                                {pathRoute.route_stops[1].stop.address}
                            </p>
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
    )
}

export default PathRouteDetails