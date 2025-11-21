// components/admin/paths/PathRouteDetails.tsx
'use client'

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

interface Route {
    route_id: number;
    route_type: string;
    start_time: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    generated_from: any;
    route_stops: RouteStop[];
}

interface PathRouteDetailsProps {
    pathRoute: Route;
}

const PathRouteDetails = ({ pathRoute }: PathRouteDetailsProps) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [routeGeometry, setRouteGeometry] = useState<any>(null);

    // Initialize map
    useEffect(() => {
        if (!pathRoute || !mapContainer.current) return;

        if (!map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [106.6297, 10.8231],
                zoom: 10
            });

            map.current.on('load', () => {
                console.log('Map loaded successfully');
                setMapLoaded(true);
            });

            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
                setMapLoaded(false);
            }
        };
    }, [pathRoute]);

    // Update map when route data or map loaded state changes
    useEffect(() => {
        if (mapLoaded && pathRoute?.route_stops) {
            calculateAndDisplayRoute();
        }
    }, [mapLoaded, pathRoute]);

    const calculateAndDisplayRoute = async () => {
        if (!map.current || !pathRoute?.route_stops || pathRoute.route_stops.length < 2) {
            return;
        }

        try {
            const stops = pathRoute.route_stops.sort((a, b) => a.stop_order - b.stop_order);
            const coordinates = stops.map(routeStop =>
                `${parseFloat(routeStop.stop.longitude)},${parseFloat(routeStop.stop.latitude)}`
            );

            // Create Directions API URL
            const waypoints = coordinates.join(';');
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                setRouteGeometry(route.geometry);
                updateMapWithRoute(route.geometry);
            } else {
                // Fallback to straight line
                const fallbackGeometry = {
                    type: 'LineString',
                    coordinates: stops.map(routeStop => [
                        parseFloat(routeStop.stop.longitude),
                        parseFloat(routeStop.stop.latitude)
                    ])
                };
                setRouteGeometry(fallbackGeometry);
                updateMapWithRoute(fallbackGeometry);
            }
        } catch (error) {
            console.error('Lỗi khi tính toán tuyến đường:', error);
            // Fallback to straight line
            const stops = pathRoute.route_stops.sort((a, b) => a.stop_order - b.stop_order);
            const fallbackGeometry = {
                type: 'LineString',
                coordinates: stops.map(routeStop => [
                    parseFloat(routeStop.stop.longitude),
                    parseFloat(routeStop.stop.latitude)
                ])
            };
            setRouteGeometry(fallbackGeometry);
            updateMapWithRoute(fallbackGeometry);
        }
    };

    const updateMapWithRoute = (geometry: any) => {
        if (!map.current || !pathRoute?.route_stops) return;

        if (!map.current.isStyleLoaded()) {
            map.current.once('styledata', () => {
                updateMapWithRoute(geometry);
            });
            return;
        }

        try {
            // Clear existing markers
            const markers = document.getElementsByClassName('mapboxgl-marker');
            while (markers[0]) {
                markers[0].remove();
            }

            // Clear existing route
            if (map.current.getLayer('route-line')) {
                map.current.removeLayer('route-line');
            }
            if (map.current.getSource('route')) {
                map.current.removeSource('route');
            }

            const stops = pathRoute.route_stops.sort((a, b) => a.stop_order - b.stop_order);

            // Add markers for each stop
            stops.forEach((routeStop, index) => {
                const { latitude, longitude, address } = routeStop.stop;
                const coord: [number, number] = [parseFloat(longitude), parseFloat(latitude)];

                const el = document.createElement('div');
                el.className = 'custom-marker';
                el.style.backgroundColor = index === 0 ? '#22c55e' : index === stops.length - 1 ? '#ef4444' : '#3b82f6';
                el.style.width = '32px';
                el.style.height = '32px';
                el.style.borderRadius = '50%';
                el.style.border = '3px solid white';
                el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
                el.style.display = 'flex';
                el.style.alignItems = 'center';
                el.style.justifyContent = 'center';
                el.style.color = 'white';
                el.style.fontWeight = 'bold';
                el.style.fontSize = '14px';
                el.innerHTML = `${index + 1}`;

                const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                    `<div style="padding: 8px; min-width: 200px;">
            <strong>Điểm ${index + 1}: ${address}</strong><br/>
            <span style="color: #666; font-size: 12px;">Thứ tự: ${routeStop.stop_order}</span>
          </div>`
                );

                new mapboxgl.Marker(el)
                    .setLngLat(coord)
                    .setPopup(popup)
                    .addTo(map.current!);
            });

            // Add route line
            map.current.addSource('route', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: geometry
                }
            });

            map.current.addLayer({
                id: 'route-line',
                type: 'line',
                source: 'route',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3b82f6',
                    'line-width': 5,
                    'line-opacity': 0.8
                }
            });

            // Fit map to show all stops
            const bounds = new mapboxgl.LngLatBounds();
            stops.forEach(routeStop => {
                bounds.extend([
                    parseFloat(routeStop.stop.longitude),
                    parseFloat(routeStop.stop.latitude)
                ]);
            });
            map.current.fitBounds(bounds, { padding: 50, duration: 1000 });

        } catch (error) {
            console.error('Error updating map:', error);
        }
    };

    // Calculate route information
    const getRouteInfo = () => {
        if (!routeGeometry) return null;

        try {
            const coordinates = routeGeometry.coordinates;
            let totalDistance = 0;

            for (let i = 1; i < coordinates.length; i++) {
                const [lon1, lat1] = coordinates[i-1];
                const [lon2, lat2] = coordinates[i];

                // Haversine distance calculation
                const R = 6371; // Earth radius in km
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLon = (lon2 - lon1) * Math.PI / 180;
                const a =
                    Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                totalDistance += R * c;
            }

            return {
                distance: totalDistance,
                duration: totalDistance * 2.5 // Estimated time in minutes
            };
        } catch (error) {
            return null;
        }
    };

    const routeInfo = getRouteInfo();
    const sortedStops = pathRoute.route_stops.sort((a, b) => a.stop_order - b.stop_order);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Tuyến đường #{pathRoute.route_id}
                            </h1>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className={`px-2 py-1 rounded ${
                    pathRoute.route_type === 'MORNING'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-purple-100 text-purple-700'
                }`}>
                  {pathRoute.route_type === 'MORNING' ? 'Buổi sáng' : 'Buổi chiều'}
                </span>
                                <span>Giờ khởi hành: {pathRoute.start_time}</span>
                                <span className={`px-2 py-1 rounded ${
                                    pathRoute.is_active
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                }`}>
                  {pathRoute.is_active ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            ← Quay lại
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                <span className="text-blue-600">🗺️</span>
                                Bản đồ tuyến đường
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">Số điểm dừng:</span>{' '}
                                    <span className="font-semibold text-blue-600">{sortedStops.length}</span>
                                </div>
                                <div>
                                    <span className="font-medium">Loại tuyến:</span>{' '}
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        pathRoute.route_type === 'MORNING'
                                            ? 'bg-orange-100 text-orange-700'
                                            : 'bg-purple-100 text-purple-700'
                                    }`}>
                    {pathRoute.route_type === 'MORNING' ? 'Buổi sáng' : 'Buổi chiều'}
                  </span>
                                </div>
                                {routeInfo && (
                                    <>
                                        <div>
                                            <span className="font-medium">Khoảng cách:</span>{' '}
                                            <span className="font-semibold text-green-600">
                        {routeInfo.distance.toFixed(1)} km
                      </span>
                                        </div>
                                        <div>
                                            <span className="font-medium">Ước tính thời gian:</span>{' '}
                                            <span className="font-semibold text-purple-600">
                        {Math.ceil(routeInfo.duration)} phút
                      </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div
                            ref={mapContainer}
                            className="w-full h-96 lg:h-[600px] rounded-lg shadow-md border"
                        />
                    </div>

                    {/* Stop List Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <span className="text-green-600">📍</span>
                                Danh sách điểm dừng
                                <span className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full">
                  {sortedStops.length} điểm
                </span>
                            </h2>

                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                {sortedStops.map((routeStop, index) => (
                                    <div
                                        key={routeStop.route_stop_id}
                                        className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors group"
                                    >
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm transition-transform group-hover:scale-110"
                                            style={{
                                                backgroundColor: index === 0
                                                    ? '#22c55e'
                                                    : index === sortedStops.length - 1
                                                        ? '#ef4444'
                                                        : '#3b82f6'
                                            }}
                                        >
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 text-sm leading-tight">
                                                {routeStop.stop.address}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          Thứ tự: {routeStop.stop_order}
                        </span>
                                                <span className="text-xs text-gray-500">
                          ID: {routeStop.stop.stop_id}
                        </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {routeStop.stop.latitude}, {routeStop.stop.longitude}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Legend */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <p className="text-sm font-medium text-gray-700 mb-2">Chú thích:</p>
                                <div className="grid grid-cols-1 gap-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0"></div>
                                        <span className="text-gray-600">Điểm bắt đầu</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-blue-500 flex-shrink-0"></div>
                                        <span className="text-gray-600">Điểm dừng giữa</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0"></div>
                                        <span className="text-gray-600">Điểm kết thúc</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PathRouteDetails;