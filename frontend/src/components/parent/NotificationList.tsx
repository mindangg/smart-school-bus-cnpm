'use client'

import React, { useState, useEffect } from 'react'
import { BellRing, Bus, Check, CheckCheck, X, Clock } from 'lucide-react'
import api from '@/lib/axios'
import { toast } from 'sonner'

interface Notification {
    notification_id: number
    title: string
    message: string
    created_at: string
    is_read: boolean
    notification_type: string
    event_id?: number
}

interface NotificationListProps {
    studentId: number
}

export default function NotificationList({ studentId }: NotificationListProps) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [prevCount, setPrevCount] = useState(0)
    const [isOpenModal, setIsOpenModal] = useState(false)

    // Hàm format ngày đẹp cho người Việt
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        const isYesterday = new Date(date.setDate(date.getDate() - 1)).toDateString() === new Date().toDateString();

        const time = date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });

        if (isToday) return `Hôm nay, ${time}`;
        if (isYesterday) return `Hôm qua, ${time}`;

        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) + `, ${time}`;
    };

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications')
            const newNotis: Notification[] = res.data

            if (newNotis.length > prevCount && prevCount !== 0) {
                const latest = newNotis[0]
                if (!latest.is_read) {
                    toast.success(latest.title, {
                        description: latest.message,
                        icon: <Bus className="w-5 h-5" />,
                        duration: 5000,
                    })
                }
            }

            setNotifications(newNotis)
            setPrevCount(newNotis.length)
        } catch (err: any) {
            if (err.response?.status === 401) {
                console.log("Chưa login → dùng fallback test mode")
                try {
                    const res = await api.get('notifications', {
                        params: { user_id: studentId }
                    })
                    setNotifications(res.data)
                } catch (fallbackErr) {
                    console.error("Lỗi cả 2 cách:", fallbackErr)
                }
            }
        }
    }

    const handleMarkAsRead = async (id: number) => {
        try {
            await api.patch(`/notifications/${id}/read`)
            setNotifications(prev => prev.map(n =>
                n.notification_id === id ? { ...n, is_read: true } : n
            ))
            toast.success("Đã đánh dấu đã đọc")
        } catch (error) {
            toast.error("Lỗi khi đánh dấu đã đọc")
        }
    }

    const handleMarkAllRead = async () => {
        try {
            const unreadIds = notifications.filter(n => !n.is_read).map(n => n.notification_id)
            await Promise.all(unreadIds.map(id => api.patch(`/notifications/${id}/read`)))
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
            toast.success("Đã đánh dấu đọc tất cả thông báo")
        } catch (error) {
            toast.error("Lỗi khi đánh dấu tất cả")
        }
    }

    useEffect(() => {
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 5000)
        return () => clearInterval(interval)
    }, [studentId])

    const NotificationItem = ({ item }: { item: Notification }) => (
        <div
            onClick={() => !item.is_read && handleMarkAsRead(item.notification_id)}
            className={`relative flex gap-3 p-4 border-b border-gray-100 transition-all duration-200 cursor-pointer group
                ${!item.is_read ? 'bg-blue-50/80 hover:bg-blue-100/80' : 'bg-white hover:bg-gray-50'}`}
        >
            <div className={`mt-1 shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                ${!item.is_read ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                <Bus size={16} />
            </div>

            <div className='flex-1'>
                <div className='flex justify-between items-start'>
                    <h4 className={`text-sm ${!item.is_read ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                        {item.title}
                    </h4>
                    {!item.is_read && (
                        <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-300 animate-pulse"></span>
                    )}
                </div>

                <p className={`text-xs mt-1 line-clamp-2 ${!item.is_read ? 'text-gray-800' : 'text-gray-500'}`}>
                    {item.message}
                </p>

                <div className='flex items-center justify-between mt-2'>
                    <div className='flex items-center gap-1 text-[10px] text-gray-400'>
                        <Clock size={10} />
                        <span>{formatDateTime(item.created_at)}</span>
                    </div>

                    {!item.is_read && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(item.notification_id)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full hover:bg-blue-200"
                        >
                            <Check size={10} /> Đã hiểu
                        </button>
                    )}
                </div>
            </div>
        </div>
    )

    const unreadCount = notifications.filter(n => !n.is_read).length

    return (
        <>
            <div className='flex flex-col bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden h-full'>
                <div className='bg-white p-4 border-b border-gray-100 flex justify-between items-center'>
                    <div className='flex items-center gap-2'>
                        <div className='relative'>
                            <BellRing size={20} className="text-blue-600" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                            )}
                        </div>
                        <h2 className='text-base font-bold text-gray-800'>Thông báo</h2>
                    </div>
                    {unreadCount > 0 && (
                        <span className='text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full animate-pulse'>
                            {unreadCount} mới
                        </span>
                    )}
                </div>

                <div className='flex-1 overflow-hidden relative'>
                    <div className='absolute inset-0 overflow-y-auto custom-scrollbar'>
                        {notifications.length === 0 ? (
                            <div className='flex flex-col items-center justify-center h-40 text-gray-400'>
                                <BellRing size={32} className="mb-2 opacity-20" />
                                <p className="text-xs">Chưa có thông báo</p>
                            </div>
                        ) : (
                            notifications.slice(0, 5).map((noti) => (
                                <NotificationItem key={noti.notification_id} item={noti} />
                            ))
                        )}
                    </div>
                </div>

                {notifications.length > 5 && (
                    <div className='p-3 border-t border-gray-100 bg-gray-50 text-center'>
                        <button
                            onClick={() => setIsOpenModal(true)}
                            className='text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-all'
                        >
                            Xem tất cả ({notifications.length})
                        </button>
                    </div>
                )}
            </div>

            {/* Modal lịch sử */}
            {isOpenModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-800">Lịch sử thông báo</h3>
                            <div className="flex gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-xs font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                                    >
                                        <CheckCheck size={14} /> Đọc tất cả
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpenModal(false)}
                                    className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto p-0 bg-gray-50/50 flex-1">
                            {notifications.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">Không có thông báo</div>
                            ) : (
                                notifications.map((noti) => (
                                    <NotificationItem key={`modal-${noti.notification_id}`} item={noti} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}