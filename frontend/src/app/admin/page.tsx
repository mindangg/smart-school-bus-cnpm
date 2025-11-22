import ControlCards from '@/components/admin/controls/ControlCard'
import {User, Users, CarFront, MapPin, BusFront} from 'lucide-react'
import {createServerApi} from "@/lib/axiosServer";

const page = async () => {
    const api =await createServerApi();
    const res = await api.get("admin/dashboard");
    const data = res.data;

    const controlItems = [
        { title: 'Phụ Huynh', icon: <User />, href: 'admin/parents', count: data.totalParents },
        { title: 'Học Sinh', icon: <Users />, href: 'admin/students', count: data.totalStudents },
        { title: 'Tài Xế', icon: <CarFront />, href: 'admin/drivers', count: data.totalDrivers },
        { title: 'Tuyến Đường', icon: <MapPin />, href: 'admin/paths', count: data.totalRoutes },
        { title: 'Xe buýt', icon: <BusFront />, href: 'admin/buses', count: data.totalBuses }
    ];

    return (
        <section>
            <h1 className='text-2xl sm:text-4xl font-bold mb-5'>Tổng Quan Các Chỉ Số Chính</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 cursor-pointer">
                {controlItems.map((c) => (
                    <ControlCards key={c.title} {...c} />
                ))}
            </div>
        </section>
    )
}

export default page