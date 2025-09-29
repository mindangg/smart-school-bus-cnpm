import ControlCards from '@/components/controls/ControlCard'
import { Bus, Users, UsersRound, MapPin } from 'lucide-react'

const controlItems = [
    { 'title': 'Tổng Số Xe Buýt', 'icon': <Bus /> },
    { 'title': 'Tài Xế', 'icon': <Users /> },
    { 'title': 'Học Sinh', 'icon': <UsersRound /> },
    { 'title': 'Tuyến Đường Đang Hoạt Động', 'icon': <MapPin /> }
]

const Controls = () => {
    return (
        <section>
            <h1 className='text-xl font-bold mb-5'>Tổng Quan Các Chỉ Số Chính</h1>
            <div className='flex items-center justify-between gap-5'>
                {controlItems.map(c => (
                    <ControlCards 
                        key={c.title}
                        { ... c }
                    />
                ))}
            </div>
        </section>
    )
}

export default Controls