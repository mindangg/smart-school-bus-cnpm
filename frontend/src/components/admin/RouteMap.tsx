'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

// --- QUAN TRỌNG: Thêm Access Token của bạn vào file .env.local ---
// Tạo file .env.local ở thư mục gốc frontend nếu chưa có
// Thêm dòng: NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.YOUR_TOKEN_HERE
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface RouteMapProps {
    pathGeometry: any; // GeoJSON LineString
}

const RouteMap = ({ pathGeometry }: RouteMapProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return; // Khởi tạo 1 lần

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12', // Kiểu bản đồ
            center: [106.682330, 10.759948], // Tọa độ trung tâm (lấy tạm trạm đầu)
            zoom: 13,
        });

        const map = mapRef.current;

        // Sự kiện 'load' đảm bảo bản đồ đã tải xong trước khi thêm layer
        map.on('load', () => {
            // 1. Thêm Source (nguồn dữ liệu) cho lộ trình
            map.addSource('route-path', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: pathGeometry, // <-- Dùng geometry từ props
                },
            });

            // 2. Thêm Layer (lớp hiển thị) để vẽ đường
            map.addLayer({
                id: 'route-path-layer',
                type: 'line',
                source: 'route-path',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                paint: {
                    'line-color': '#3887be', // Màu đường
                    'line-width': 5,
                    'line-opacity': 0.75,
                },
            });

            // 3. Tự động zoom vừa khít với đường đi
            const coordinates = pathGeometry.coordinates;
            const bounds = coordinates.reduce(
                (bounds, coord) => bounds.extend(coord),
                new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
            );
            
            map.fitBounds(bounds, {
                padding: 40 // Thêm 40px padding
            });
        });

        // Dọn dẹp khi component unmount
        return () => {
            map.remove();
            mapRef.current = null;
        };
        
    }, [pathGeometry]); // Chỉ chạy lại khi geometry thay đổi

    return (
        <div ref={mapContainerRef} className="w-full h-full" />
    );
};

export default RouteMap;