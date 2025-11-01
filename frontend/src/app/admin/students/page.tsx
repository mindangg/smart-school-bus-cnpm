import ScheduleCard from "@/components/admin/ScheduleCard"

const page = () => {
    return (
        <section className='flex flex-col gap-5'>
            <h1 className='text-2xl font-bold'>Danh sách học sinh</h1>
            <section>
                <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                <div className="grid grid-cols-[3fr_4fr_4fr_3fr_2fr] py-6 text-center text-black border-b border-gray-300 font-bold">
                    <span>ID Học Sinh</span>
                    <span>Avatar</span>
                    <span>Họ Tên</span>
                    <span>Tuyến Đường</span>
                    <span>Hành Động</span>
                </div>
                </div>
                </div>
            </section>
        </section>
    )
}

export default page