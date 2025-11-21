'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface Stop {
    stop_id: number;
    latitude: string;
    longitude: string;
    address: string;
    is_active: boolean;
}

interface RouteStop {
    route_stop_id: number;
    route_id: number;
    stop_id: number;
    stop_order: number;
    stop: Stop;
}

interface RouteMapProps {
    routeStops: RouteStop[];
    routeType: string;
    busNumber: string;
    driverName: string;
}

const RouteMap = ({ routeStops, routeType }: RouteMapProps) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);
    const [routeLoading, setRouteLoading] = useState(false);

    useEffect(() => {
        if (!mapContainer.current) return;

        try {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [106.6822, 10.7629],
                zoom: 11,
                attributionControl: false
            });

            map.current.addControl(new mapboxgl.AttributionControl(), 'bottom-right');
            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

            map.current.on('load', () => {
                setMapLoaded(true);
                initializeMapFeatures();
            });

            map.current.on('error', (e) => {
                console.error('Mapbox error:', e);
                setMapError('Lỗi tải bản đồ');
            });

        } catch (error) {
            console.error('Error initializing map:', error);
            setMapError('Không thể khởi tạo bản đồ');
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
            // Xóa tất cả markers
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
        };
    }, []);

    useEffect(() => {
        if (mapLoaded && routeStops.length > 0) {
            initializeMapFeatures();
        }
    }, [mapLoaded, routeStops]);

    const calculateRoute = async (coordinates: [number, number][]) => {
        if (coordinates.length < 2) return null;

        try {
            setRouteLoading(true);
            const response = await axios.get(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.join(';')}`,
                {
                    params: {
                        access_token: mapboxgl.accessToken,
                        geometries: 'geojson',
                        overview: 'full',
                        steps: false
                    }
                }
            );

            return response.data.routes[0];
        } catch (error) {
            console.error('Error calculating route:', error);
            return null;
        } finally {
            setRouteLoading(false);
        }
    };

    const initializeMapFeatures = async () => {
        if (!map.current || !mapLoaded) return;

        try {
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];

            const sourcesToRemove = ['route', 'stops', 'stop-labels'];
            const layersToRemove = ['route', 'stops', 'stop-labels'];

            layersToRemove.forEach(layer => {
                if (map.current!.getLayer(layer)) {
                    map.current!.removeLayer(layer);
                }
            });

            sourcesToRemove.forEach(source => {
                if (map.current!.getSource(source)) {
                    map.current!.removeSource(source);
                }
            });

            const sortedStops = routeStops.sort((a, b) => a.stop_order - b.stop_order);
            const coordinates = sortedStops.map(rs => [
                parseFloat(rs.stop.longitude),
                parseFloat(rs.stop.latitude)
            ] as [number, number]);

            const route = await calculateRoute(coordinates);

            if (route) {
                map.current.addSource('route', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: route.geometry
                    }
                });

                map.current.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': routeType === 'MORNING' ? '#3b82f6' : '#f59e0b',
                        'line-width': 4,
                        'line-opacity': 0.8
                    }
                });
            } else {
                map.current.addSource('route', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: coordinates
                        }
                    }
                });

                map.current.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': routeType === 'MORNING' ? '#3b82f6' : '#f59e0b',
                        'line-width': 4,
                        'line-opacity': 0.6,
                        'line-dasharray': [2, 2]
                    }
                });
            }

            sortedStops.forEach((rs, index) => {
                const isFirstStop = index === 0;
                const isLastStop = index === sortedStops.length - 1;

                const el = document.createElement('div');
                el.className = 'custom-marker';
                el.style.backgroundColor = isFirstStop ? '#10b981' : isLastStop ? '#ef4444' : '#3b82f6';
                el.style.width = '30px';
                el.style.height = '30px';
                el.style.borderRadius = '50%';
                el.style.border = '3px solid white';
                el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
                el.style.display = 'flex';
                el.style.alignItems = 'center';
                el.style.justifyContent = 'center';
                el.style.color = 'white';
                el.style.fontWeight = 'bold';
                el.style.fontSize = '12px';
                el.innerHTML = `${rs.stop_order}`;

                const marker = new mapboxgl.Marker({ element: el })
                    .setLngLat([parseFloat(rs.stop.longitude), parseFloat(rs.stop.latitude)])
                    .setPopup(
                        new mapboxgl.Popup({ offset: 25 })
                            .setHTML(`
                                <div class="p-2 min-w-[200px]">
                                    <h3 class="font-bold text-sm">Trạm ${rs.stop_order}</h3>
                                    <p class="text-xs text-gray-600 mt-1">${rs.stop.address}</p>
                                    <div class="flex items-center gap-2 mt-2">
                                        <span class="inline-block w-3 h-3 rounded-full ${
                                isFirstStop ? 'bg-green-500' : isLastStop ? 'bg-red-500' : 'bg-blue-500'
                            }"></span>
                                        <span class="text-xs text-gray-500">
                                            ${isFirstStop ? 'Điểm bắt đầu' : isLastStop ? 'Điểm kết thúc' : 'Điểm dừng'}
                                        </span>
                                    </div>
                                </div>
                            `)
                    )
                    .addTo(map.current!);

                markersRef.current.push(marker);
            });

            if (coordinates.length > 0) {
                const bounds = coordinates.reduce((bounds, coord) => {
                    return bounds.extend(coord);
                }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

                map.current.fitBounds(bounds, {
                    padding: { top: 50, bottom: 50, left: 50, right: 50 },
                    duration: 1000
                });
            }

        } catch (error) {
            console.error('Error adding map features:', error);
            setMapError('Lỗi khi hiển thị tuyến đường');
        }
    };

    if (mapError) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center text-red-600">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="font-medium">{mapError}</p>
                    <p className="text-sm text-gray-600 mt-2">Vui lòng kiểm tra kết nối và Mapbox access token</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full relative">
            <div ref={mapContainer} className="h-full w-full rounded-lg" />

            {(routeLoading || !mapLoaded) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 rounded-lg">
                    <div className="text-center text-gray-600">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="font-medium">
                            {routeLoading ? 'Đang tính toán đường đi...' : 'Đang tải bản đồ...'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RouteMap;