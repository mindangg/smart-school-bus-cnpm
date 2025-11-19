'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PathCard from "@/components/admin/paths/PathCard";
import PathForm from "@/components/admin/paths/PathForm";
import { Button } from '@/components/ui/button';

interface BusStop {
    stop_id: number;
    latitude: number;
    longitude: number;
    address: string;
    is_active: boolean;
}

interface Route {
    route_id: number;
    route_type: string;
    start_time: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    generated_from: number;
    route_stops?: any[];
}

interface Driver {
    driver_id: number;
    name: string;
    // ... other driver fields
}

interface Bus {
    bus_id: number;
    license_plate: string;
    // ... other bus fields
}

interface PathsPageProps {
    routes: Route[];
    drivers: Driver[];
    buses: Bus[];
}

const PathsPage = ({ routes, drivers, buses }: PathsPageProps) => {
    const router = useRouter();
    const [routesData, setRoutesData] = useState<Route[]>(routes);

    const handleRouteAdded = async () => {
        try {
            const response = await fetch('/api/admin/routes');
            const newRoutes = await response.json();
            setRoutesData(newRoutes);
        } catch (error) {
            console.error('Error refreshing routes:', error);
        }
    };

    const handleAddRoute = () => {
        router.push('/admin/paths/add');
    };

    return (
        <main>
            <section className='bg-white flex flex-col gap-3'>
                <h1 className='text-2xl font-bold'>Bảng Phân Công Tuyến Đường</h1>
                <h2 className='text-md font-bold'>Phân Công Tài Xế và Xe Buýt cho Tuyến Đường</h2>
                <PathForm routes={routesData} drivers={drivers} buses={buses} onRouteAdded={handleRouteAdded}/>
            </section>

            <div className="w-full bg-black rounded-full h-[3px] my-10"></div>

            <section>
                <div className="flex justify-between items-center mb-4">
                    <h1 className='text-2xl font-bold'>Danh Sách Tuyến Đường</h1>
                    <Button
                        onClick={handleAddRoute}
                        className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600"
                    >
                        + Thêm Tuyến Đường
                    </Button>
                </div>

                <div className="min-w-[900px]">
                    <div className='grid grid-cols-[1.5fr_5fr_1.5fr_1.5fr_1.5fr] py-6 text-center text-black border-b border-gray-300 font-bold'>
                        <span>ID Tuyến Đường</span>
                        <span>Tuyến Đường</span>
                        <span>Khời Hành</span>
                        <span>Thời Gian</span>
                        <span>Hành Động</span>
                    </div>
                    <div className="overflow-y-auto max-h-[500px]">
                        {routesData.map((route: Route) => (
                            <PathCard key={route.route_id} route={route} onRouteUpdated={handleRouteAdded}/>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default PathsPage;