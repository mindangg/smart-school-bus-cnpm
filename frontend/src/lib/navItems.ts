type NavItem = {
  label: string
  href: string
  icon: string
}

export const adminNav: NavItem[] = [
    { label: 'Bảng Điều Khiển', href: '/admin', icon: 'BusFront' },
    { label: 'Lịch Trình Xe Buýt', href: '/admin/schedules', icon: 'Bus' },
    { label: 'Tuyến Đường', href: '/admin/paths', icon: 'MapPin' },
    { label: 'Tài Xế', href: '/admin/drivers', icon: 'CarTaxiFront' },
    { label: 'Học Sinh', href: '/admin/students', icon: 'Users' },
    { label: 'Tin Nhắn', href: '/admin/chats', icon: 'MessageCircleMore' },
    { label: 'Theo Dõi Trực Tiếp', href: '/admin/tracking', icon: 'Eye' }
]

export const driverNav: NavItem[] = [
    { label: 'Thông tin tuyến đường', href: '/driver/paths', icon: 'Map' },
    { label: 'Danh sách học sinh', href: '/driver/students', icon: 'Users' },
    { label: 'Chat với người quản lý', href: '/driver/chats', icon: 'MessageSquare' }
]

export const userNav: NavItem[] = [
    { label: 'Thông tin tuyến đường', href: '/users/paths', icon: 'Map' },
    { label: 'Thông tin học sinh', href: '/users/students', icon: 'Users' },
    { label: 'Chat với người quản lý', href: '/users/chats', icon: 'MessageSquare' }
]