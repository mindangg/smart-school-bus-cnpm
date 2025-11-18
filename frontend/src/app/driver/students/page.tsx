import React from "react"
import StudentCard from "@/components/driver/StudentCard"
import {createServerApi} from "@/lib/axiosServer";

const Page = async () => {
    const api = await createServerApi()
    const res = await api.get("students");
    const students = res.data;

    return (
        <div>
            <section className="bg-white p-4 border border-gray-100 shadow-xs rounded-xl">
                <h2 className="text-md font-bold">Đón & Trả Học Sinh</h2>
                <p className="text-gray-600">
                    Quản lý trạng thái học sinh cho tuyến đường hiện tại của bạn.
                </p>
                <div className='overflow-x-auto'>
                    <div className="min-w-[900px]">

                        <div
                            className="grid grid-cols-[3fr_2fr_4fr_2fr_2fr_1fr] py-6 text-center text-black border-b border-gray-300 font-bold">
                            <span>Ảnh Đại Diện</span>
                            <span>Tên Học Sinh</span>
                            <span>Tên Điểm Dừng</span>
                            <span>Thời Gian</span>
                            <span>Trạng Thái</span>
                            <span>Hành Động</span>
                        </div>

                        {students.map((student: any) => (
                            <StudentCard key={student.student_id} student={student} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Page
