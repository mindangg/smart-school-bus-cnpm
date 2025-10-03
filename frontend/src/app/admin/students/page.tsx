import ScheduleCard from "@/components/admin/ScheduleCard"

const page = () => {
    return (
        <section className='flex flex-col gap-5'>
            <h1 className='text-2xl font-bold'>Danh sách học sinh</h1>
            <section>
                <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                <div className="grid grid-cols-[3fr_4fr_4fr_3fr_2fr_2fr] py-6 text-center text-black border-b border-gray-300 font-bold">
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
                </div>
                </div>
            </section>
        </section>
    )
}

export default page