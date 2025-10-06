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
import { useItem } from '@/context/ItemContext'

const page = async () => {
    const { items, dispatch } = useItem()
    
    const fetchDrivers = async () => {
        try {
            const res = await api.get(`/api/users?role=Driver`)
            dispatch({ type: 'DISPLAY_ITEM', payload: res.data.user })
        } 
        catch (err: any) {
            console.error('Server error:', err)
        }
    }

    return (
        <section className='flex flex-col gap-5'>
            <div className='flex gap-5'>
                <h1 className='text-2xl font-bold'>Danh sách tài xế</h1>
                <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        Thêm Tài Xế
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Thêm Tài Xế</DialogTitle>
                    </DialogHeader>
                    <DriverForm />
                </DialogContent>
                </Dialog>
            </div>
            <section>
                <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                <div className="grid grid-cols-[2fr_3fr_3fr_3fr_5fr_2fr] py-6 text-center text-black border-b border-gray-300 font-bold">
                    <span>ID Tài Xế</span>
                    <span>Email</span>
                    <span>Họ Tên</span>
                    <span>Số Điện Thoại</span>
                    <span>Địa Chỉ</span>
                </div>
                <DriverCard />
                <DriverCard />
                <DriverCard />
                </div>
                </div>
            </section>
        </section>
    )
}

export default page