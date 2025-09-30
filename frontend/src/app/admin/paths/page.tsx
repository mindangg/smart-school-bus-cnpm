import PathCard from "@/components/admin/PathCard"

const Paths = () => {
    return (
        <section>
            <h1 className='text-xl font-bold'>Danh Sách Điểm Dừng</h1>
            <div className='grid grid-cols-[2fr_4fr_5fr_3fr_2fr] py-6 text-center text-black border-b border-gray-300 font-bold'>
                <span>ID Điểm Dừng</span>
                <span>Tên Điểm Dừng</span>
                <span>Địa Chỉ</span>
                <span>Thời Gian</span>
                <span>Hành Động</span>
            </div>
            <PathCard />
            <PathCard />
            <PathCard />
        </section>
    )
}

export default Paths