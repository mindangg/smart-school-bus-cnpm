import SideBar from '@/components/SideBar'
import React from 'react'
import { Bus, BusFront, CarTaxiFront, Eye, MapPin, MessageCircleMore, Users } from 'lucide-react'

const navItems = [
    { label: 'Bảng Điều Khiển', href: '/admin/controls', icon: <BusFront className='w-5 h-5'/> },
    { label: 'Lịch Trình Xe Buýt', href: '/admin/schedules', icon: <Bus className='w-5 h-5'/> },
    { label: 'Tuyến Đường', href: '/admin/paths', icon: <MapPin className='w-5 h-5'/> },
    { label: 'Tài Xế', href: '/admin/drivers', icon: <CarTaxiFront className='w-5 h-5'/> },
    { label: 'Học Sinh', href: '/admin/students', icon: <Users className='w-5 h-5'/> },
    { label: 'Tin Nhắn', href: '/admin/chats', icon: <MessageCircleMore className='w-5 h-5'/> },
    { label: 'Theo Dõi Trực Tiếp', href: '/admin/tracking', icon: <Eye className='w-5 h-5'/> }
]

const layout = () => {
    return (
        <SideBar navItems={navItems}/>
    )
}

export default layout