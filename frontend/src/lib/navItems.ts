type NavItem = {
  label: string
  href: string
  icon: string
}

export const adminNav: NavItem[] = [
    { label: 'Bảng Điều Khiển', href: '/admin', icon: 'BusFront' },
    { label: 'Lịch Trình Xe Buýt', href: '/admin/schedules', icon: 'Bus' },
    { label: 'Tuyến Đường', href: '/admin/paths', icon: 'MapPin' },
    // { label: 'Tin Nhắn', href: '/admin/chats', icon: 'MessageCircleMore' },
    // { label: 'Theo Dõi Trực Tiếp', href: '/admin/tracking', icon: 'Eye' }
]

export const driverNav: NavItem[] = [
    { label: 'Thông tin tài xế', href: '/driver', icon: 'CircleUser' },
    { label: 'Thông tin tuyến đường', href: '/driver/paths', icon: 'Map' },
    { label: 'Chat với người quản lý', href: '/driver/chats', icon: 'MessageSquare' }
]

export const userNav: NavItem[] = [
    { label: 'Thông tin phụ huynh', href: '/parent', icon: 'CircleUser' },
    { label: 'Thông tin học sinh', href: '/parent/students', icon: 'Users' },
    { label: 'Chat với người quản lý', href: '/parent/chats', icon: 'MessageSquare' }
]