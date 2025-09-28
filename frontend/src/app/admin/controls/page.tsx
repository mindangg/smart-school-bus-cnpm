import ControlCards from '@/components/controls/ControlCard'
import { Bus, Users, UsersRound, MapPin } from 'lucide-react'

const controlItems = [
    {
        "title": "Tổng Số Xe Buýt",
        "icon": <Bus />
    },
    {
        "title": "Tài Xế",
        "icon": <Users />
    },
    {
        "title": "Học Sinh",
        "icon": <UsersRound />
    },
    {
        "title": "Tuyến Đường Đang Hoạt Động",
        "icon": <MapPin />
    }
]

const Controls = () => {
    return (
        <main className='relative top-18 flex flex-col gap-6 bg-gray-50 p-5'>
            <h1 className='text-xl font-bold'>Tổng Quan Các Chỉ Số Chính</h1>
            <section className='flex items-center justify-between gap-5 w-full'>
                {controlItems.map(c => (
                    <ControlCards 
                        key={c.title}
                        { ... c }
                    />
                ))}
            </section>
        </main>
    )
}

export default Controls