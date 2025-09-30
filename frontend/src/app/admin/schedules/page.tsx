import ScheduleCard from "@/components/admin/ScheduleCard"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const page = () => {
    return (
        <section className='flex flex-col gap-6'>
            <h1 className='text-xl font-bold'>Quản Lý Lịch Trình Xe Buýt</h1>
            <section>
                <ToggleGroup 
                    type="single"
                    defaultValue="week"
                    className="border border-gray-300 shadow-sm"
                >
                    <ToggleGroupItem value="week">Xem Hàng Tuần</ToggleGroupItem>
                    <ToggleGroupItem value="month">Xem Hàng Tháng</ToggleGroupItem>
                </ToggleGroup>
            </section>
            <section>
                <h2 className='texttext-lg font-bold'>Lịch Trình Hàng Tuần Sắp Tới</h2>
                <div className='grid grid-cols-[3fr_4fr_4fr_3fr_2fr_2fr] py-6 text-center text-black border-b border-gray-300 font-bold'>
                    <span>ID Xe Buýt</span>
                    <span>Tuyến</span>
                    <span>Tài Xế</span>
                    <span>Thời Gian</span>
                    <span>Trạng Thái</span>
                    <span>Hành Động</span>
                </div>
                <ScheduleCard />
                <ScheduleCard />
                <ScheduleCard />
            </section>
        </section>
    )
}

export default page