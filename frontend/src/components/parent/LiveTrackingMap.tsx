"use client";

import React, {useState} from 'react';
import {Bus, MapPin} from 'lucide-react';
import Map, {Marker, NavigationControl} from 'react-map-gl';

export default function LiveTrackingMap() {
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const busLocation = {
    longitude: 106.68224,
    latitude: 10.75949
    };

    return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      
      {/* Tiêu đề */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <MapPin size={24} className="text-blue-600" />
          Live Bus Tracking
        </h2>
        {/* "Zoom Controls" sẽ được Mapbox tự thêm */}
      </div>

      {/* Khu vực bản đồ */}
      <div className="relative w-full h-[450px] bg-gray-200 rounded-md overflow-hidden">
        
        <Map
          // Lấy token từ file .env.local
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          
          // Vị trí ban đầu của bản đồ
          initialViewState={{
            longitude: busLocation.longitude,
            latitude: busLocation.latitude,
            zoom: 15
          }}
          
          style={{ width: '100%', height: '100%' }}
          
          // Kiểu bản đồ (streets, satellite, dark, light, v.v.)
          mapStyle="mapbox://styles/mapbox/streets-v11"

          // Sự kiện khi bản đồ đã tải xong
          onLoad={() => setIsMapLoaded(true)}
        >
          {/* Thêm nút Zoom (+/-) */}
          <NavigationControl position="top-right" />

          {/* Marker cho xe bus */}
          <Marker 
            longitude={busLocation.longitude} 
            latitude={busLocation.latitude}
            anchor="bottom" // Đặt tâm marker ở dưới cùng
          >
            {/* Đây là Marker tùy chỉnh của bạn */}
            <div className="flex flex-col items-center">
              {/* Cái "tooltip" giống trong thiết kế */}
              <div className="bg-white p-2 rounded-lg shadow-md mb-1">
                <p className="text-sm font-semibold text-gray-900">Jane Doe's Bus</p>
                <p className="text-xs text-gray-600">Bus: 101</p>
              </div>
              {/* Icon xe bus */}
              <Bus size={32} className="text-yellow-500 fill-yellow-400" />
            </div>
          </Marker>

        </Map>

        {/* Lớp phủ "Loading Map..." (sẽ bị ẩn khi map tải xong) */}
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
            <span className="text-white text-lg font-bold bg-black/50 px-4 py-2 rounded">
              Loading Map...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}