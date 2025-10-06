'use client'

import api from '@/lib/axios'
import DriverCard from '@/components/admin/drivers/DriverCard'
import DriverForm from '@/components/admin/drivers/DriverForm'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useEffect } from 'react'
import { Loader2, RefreshCcw } from 'lucide-react'

const page = () => {
    const [drivers, setDrivers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [open, setOpen] = useState(false)

    const fetchDrivers = async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await api.get('/api/users?role=Driver')
            setDrivers(res.data)
        } 
        catch (err: any) {
            console.error('Server error:', err)
            setError("Không thể tải danh sách tài xế.")
        }
        finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        fetchDrivers()
    }, [])

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xóa tài xế này không?")) return
        try {
            await api.delete(`/api/users/${id}`)
            fetchDrivers()
        } catch (err) {
        console.error(err)
        alert("Xóa thất bại, vui lòng thử lại.")
        }
    }

    return (
        <section className='flex flex-col gap-5'>
            <div className='flex gap-5'>
                <h1 className='text-2xl font-bold'>Danh sách tài xế</h1>

                <Button
                    variant="outline"
                    onClick={fetchDrivers}
                    disabled={loading}
                    className="flex items-center gap-2"
                >
                    Làm Mới
                    <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
                
                <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button >
                        Thêm Tài Xế
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                    <DialogTitle>Thêm Tài Xế</DialogTitle>
                    </DialogHeader>
                    <DriverForm 
                        fetchDrivers={fetchDrivers}
                    />
                </DialogContent>
                </Dialog>
            </div>

            {loading && (
                <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            )}

            {error && (
                <p className="text-red-500 text-center">{error}</p>
            )}

            {!loading && !error && (
            <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                <div className="grid grid-cols-[2fr_3fr_3fr_3fr_5fr_2fr] py-6 text-center text-black border-b border-gray-300 font-bold">
                    <span>ID Tài Xế</span>
                    <span>Email</span>
                    <span>Họ Tên</span>
                    <span>Số Điện Thoại</span>
                    <span>Địa Chỉ</span>
                </div>

                {drivers?.length > 0 ? (
                    drivers.map(driver => (
                        <DriverCard 
                            key={driver.user_id}
                            driver={driver}
                            handleDelete={handleDelete}
                            fetchDrivers={fetchDrivers}
                        />
                    ))            
                ) : (
                    <p className="py-6 text-center text-gray-700">
                        Không có tài xế nào.
                    </p>
                )}
                </div>
            </div>
            )}
        </section>
    )
}

export default page