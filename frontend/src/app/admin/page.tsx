import ControlCards from '@/components/admin/controls/ControlCard'
import { Bus, Users, UsersRound, MapPin } from 'lucide-react'

const controlItems = [
    { 'title': 'Tổng Số Xe Buýt', 'icon': <Bus />, 'href': 'admin/buses' },
    { 'title': 'Tài Xế', 'icon': <Users />, 'href': 'admin/users' },
    { 'title': 'Học Sinh', 'icon': <UsersRound />, 'href': 'admin/students' },
    { 'title': 'Tuyến Đường Đang Hoạt Động', 'icon': <MapPin />, 'href': 'admin/paths' }
]

const page = () => {
    return (
        <section>
            <h1 className='text-2xl sm:text-4xl font-bold mb-5'>Tổng Quan Các Chỉ Số Chính</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 cursor-pointer">
                {controlItems.map((c) => (
                <ControlCards key={c.title} {...c} />
                ))}
            </div>
        </section>
    )
}

export default page