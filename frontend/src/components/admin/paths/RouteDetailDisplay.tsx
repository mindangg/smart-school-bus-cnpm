'use client'

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface RouteDetailsDisplayProps {
    selectedRoute: any;
    selectedDriver: any;
    selectedBus: any;
}

const RouteDetailsDisplay = ({ selectedRoute, selectedDriver, selectedBus }: RouteDetailsDisplayProps) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const mapInitialized = useRef(false);
    const [routeGeometry, setRouteGeometry] = useState<any>(null);

    useEffect(() => {
        if (!selectedRoute || !mapContainer.current || mapInitialized.current) return;

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
                mapInitialized.current = true;

                if (selectedRoute?.route_stops) {
                    calculateAndDisplayRoute();
                }
            });

            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        }

        return () => {
            // Cleanup khi component unmount
            if (map.current) {
                map.current.remove();
                map.current = null;
                mapInitialized.current = false;
                setMapLoaded(false);
            }
        };
    }, [selectedRoute]);

    useEffect(() => {
        if (mapLoaded && selectedRoute?.route_stops) {
            calculateAndDisplayRoute();
        }
    }, [selectedRoute, mapLoaded]);

    const calculateAndDisplayRoute = async () => {
        if (!map.current || !selectedRoute?.route_stops || selectedRoute.route_stops.length < 2) {
            return;
        }

        try {
            const stops = selectedRoute.route_stops;
            const coordinates = stops.map((routeStop: any) =>
                `${parseFloat(routeStop.stop.longitude)},${parseFloat(routeStop.stop.latitude)}`
            );

            const waypoints = coordinates.join(';');
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                setRouteGeometry(route.geometry);
                updateMapWithRoute(route.geometry);
            } else {
                console.warn('Không tìm thấy tuyến đường, sử dụng đường thẳng');
                const fallbackGeometry = {
                    type: 'LineString',
                    coordinates: stops.map((routeStop: any) => [
                        parseFloat(routeStop.stop.longitude),
                        parseFloat(routeStop.stop.latitude)
                    ])
                };
                setRouteGeometry(fallbackGeometry);
                updateMapWithRoute(fallbackGeometry);
            }
        } catch (error) {
            console.error('Lỗi khi tính toán tuyến đường:', error);
            const stops = selectedRoute.route_stops;
            const fallbackGeometry = {
                type: 'LineString',
                coordinates: stops.map((routeStop: any) => [
                    parseFloat(routeStop.stop.longitude),
                    parseFloat(routeStop.stop.latitude)
                ])
            };
            setRouteGeometry(fallbackGeometry);
            updateMapWithRoute(fallbackGeometry);
        }
    };

    const updateMapWithRoute = (geometry: any) => {
        if (!map.current || !selectedRoute?.route_stops) return;

        if (!map.current.isStyleLoaded()) {
            map.current.once('styledata', () => {
                updateMapWithRoute(geometry);
            });
            return;
        }

        try {
            const markers = document.getElementsByClassName('mapboxgl-marker');
            while (markers[0]) {
                markers[0].remove();
            }

            if (map.current.getLayer('route-line')) {
                map.current.removeLayer('route-line');
            }
            if (map.current.getSource('route')) {
                map.current.removeSource('route');
            }

            const stops = selectedRoute.route_stops;

            stops.forEach((routeStop: any, index: number) => {
                const { latitude, longitude, address } = routeStop.stop;
                const coord: [number, number] = [parseFloat(longitude), parseFloat(latitude)];

                const el = document.createElement('div');
                el.className = 'custom-marker';
                el.style.backgroundColor = index === 0 ? '#22c55e' : index === stops.length - 1 ? '#ef4444' : '#3b82f6';
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
                el.style.fontSize = '14px';
                el.innerHTML = `${index + 1}`;

                const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                    `<div style="padding: 8px;">
                        <strong>Điểm ${index + 1}</strong><br/>
                        ${address}
                    </div>`
                );

                new mapboxgl.Marker(el)
                    .setLngLat(coord)
                    .setPopup(popup)
                    .addTo(map.current!);
            });

            // Thêm route line thực tế
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

            const bounds = new mapboxgl.LngLatBounds();
            stops.forEach((routeStop: any) => {
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

    const getRouteInfo = () => {
        if (!routeGeometry) return null;

        try {
            const coordinates = routeGeometry.coordinates;
            let totalDistance = 0;

            for (let i = 1; i < coordinates.length; i++) {
                const [lon1, lat1] = coordinates[i-1];
                const [lon2, lat2] = coordinates[i];

                // Tính khoảng cách Haversine (đơn giản)
                const R = 6371; // Bán kính Trái đất tính bằng km
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
                duration: totalDistance * 2.5 // Ước tính thời gian (phút)
            };
        } catch (error) {
            return null;
        }
    };

    const routeInfo = getRouteInfo();

    if (!selectedRoute && !selectedDriver && !selectedBus) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">Vui lòng chọn tuyến đường, tài xế hoặc xe buýt để xem thông tin</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {selectedRoute && (
                <div className="lg:col-span-2 space-y-3">
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <span className="text-blue-600">🗺️</span>
                            Bản đồ tuyến đường
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                            <div>
                                <span className="font-medium">Loại:</span>{' '}
                                <span className={`px-2 py-1 rounded ${
                                    selectedRoute.route_type === 'MORNING'
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'bg-purple-100 text-purple-700'
                                }`}>
                                    {selectedRoute.route_type === 'MORNING' ? 'Buổi sáng' : 'Buổi chiều'}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium">Giờ khởi hành:</span> {selectedRoute.start_time}
                            </div>
                            <div>
                                <span className="font-medium">Số điểm dừng:</span> {selectedRoute.route_stops?.length || 0}
                            </div>
                            <div>
                                <span className="font-medium">Trạng thái:</span>{' '}
                                <span className={`px-2 py-1 rounded ${
                                    selectedRoute.is_active
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {selectedRoute.is_active ? 'Hoạt động' : 'Không hoạt động'}
                                </span>
                            </div>
                            {routeInfo && (
                                <>
                                    <div>
                                        <span className="font-medium">Khoảng cách:</span>{' '}
                                        <span className="text-blue-600 font-semibold">
                                            {routeInfo.distance.toFixed(1)} km
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Ước tính thời gian:</span>{' '}
                                        <span className="text-green-600 font-semibold">
                                            {Math.ceil(routeInfo.duration)} phút
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div ref={mapContainer} className="w-full h-96 rounded-lg shadow-md" />

                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h4 className="font-semibold mb-3">Danh sách điểm dừng:</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {selectedRoute.route_stops?.map((routeStop: any, index: number) => (
                                <div
                                    key={routeStop.route_stop_id}
                                    className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded"
                                >
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                                        style={{
                                            backgroundColor: index === 0
                                                ? '#22c55e'
                                                : index === selectedRoute.route_stops.length - 1
                                                    ? '#ef4444'
                                                    : '#3b82f6'
                                        }}
                                    >
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{routeStop.stop.address}</p>
                                        <p className="text-xs text-gray-500">
                                            {routeStop.stop.latitude}, {routeStop.stop.longitude}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className={`space-y-5`}>
                {selectedDriver && (
                    <div className="bg-white rounded-lg shadow-md p-5 h-full flex flex-col">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <span className="text-blue-600">👤</span>
                            Thông tin tài xế
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                                    👤
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">{selectedDriver.full_name}</p>
                                    <p className="text-sm text-gray-500">ID: {selectedDriver.user_id}</p>
                                </div>
                            </div>

                            <div className="border-t pt-3 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">📧 Email:</span>
                                    <span className="font-medium">{selectedDriver.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">📱 Số điện thoại:</span>
                                    <span className="font-medium">{selectedDriver.phone_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">📍 Địa chỉ:</span>
                                    <span className="font-medium text-right max-w-[200px]">{selectedDriver.address}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className={`space-y-5`}>
                {selectedBus && (
                    <div className="bg-white rounded-lg shadow-md p-5 h-full flex flex-col">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <span className="text-blue-600">🚌</span>
                            Thông tin xe buýt
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl">
                                    🚌
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">{selectedBus.bus_number}</p>
                                    <p className="text-sm text-gray-500">{selectedBus.license_plate}</p>
                                </div>
                            </div>

                            <div className="border-t pt-3 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">🏷️ ID:</span>
                                    <span className="font-medium">{selectedBus.bus_id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">🚗 Mẫu xe:</span>
                                    <span className="font-medium">{selectedBus.model}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">👥 Sức chứa:</span>
                                    <span className="font-medium">{selectedBus.capacity} chỗ</span>
                                </div>
                                {selectedBus.year && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">📅 Năm sản xuất:</span>
                                        <span className="font-medium">{selectedBus.year}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-600">📊 Trạng thái:</span>
                                    <span className={`px-2 py-1 rounded text-sm ${
                                        selectedBus.status === 'ACTIVE'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {selectedBus.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                                    </span>
                                </div>
                                {selectedBus.last_maintenance_date && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">🔧 Bảo trì lần cuối:</span>
                                        <span className="font-medium">
                                            {new Date(selectedBus.last_maintenance_date).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RouteDetailsDisplay;