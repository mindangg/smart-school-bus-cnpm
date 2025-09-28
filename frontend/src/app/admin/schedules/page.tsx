import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const Schedules = () => {
    return (
        <main className='relative top-20 flex flex-col gap-6 bg-gray-50 p-5'>
            <h1 className='text-xl font-bold'>Quản Lý Lịch Trình Xe Buýt</h1>
            <section>
                <ToggleGroup 
                    type="single"
                    defaultValue="week"
                >
                    <ToggleGroupItem value="week">Xem Hàng Tuần</ToggleGroupItem>
                    <ToggleGroupItem value="month">Xem Hàng Tháng</ToggleGroupItem>
                </ToggleGroup>
            </section>
            <section>
                <h2 className='texttext-lg font-bold'>Lịch Trình Hàng Tuần Sắp Tới</h2>
                
            </section>
        </main>
    )
}

export default Schedules