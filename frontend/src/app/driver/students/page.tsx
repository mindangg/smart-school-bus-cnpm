import React from "react"
import StudentCard from "@/components/driver/StudentCard"

const Page = () => {
  // Mock data=
  const students = [
    { id: 1, name: "Trần Thị An", stop: "Điểm Dừng Chính & Đại Lộ Sồi", time: "07:30 AM", status: "Đã Đón" },
    { id: 2, name: "Nguyễn Văn B", stop: "Trạm xe Nguyễn Trãi", time: "07:40 AM", status: "Chưa Đón" },
    { id: 3, name: "Lê Thị C", stop: "Ngã tư Hàng Xanh", time: "07:50 AM", status: "Đã Đón" },
     { id: 4, name: "Lê Thị C", stop: "Ngã tư Hàng Xanh", time: "07:50 AM", status: "Đã Đón" },
      { id: 5, name: "Lê Thị C", stop: "Ngã tư Hàng Xanh", time: "07:50 AM", status: "Đã Đón" },
       { id: 6, name: "Lê Thị C", stop: "Ngã tư Hàng Xanh", time: "07:50 AM", status: "Đã Đón" },
        { id: 7, name: "Lê Thị C", stop: "Ngã tư Hàng Xanh", time: "07:50 AM", status: "Đã Đón" },
  ]

  return (
    <div>
      <section className="bg-white p-4 border border-gray-100 shadow-xs rounded-xl">
        <h2 className="text-md font-bold">Đón & Trả Học Sinh</h2> 
        <p className="text-gray-600">
          Quản lý trạng thái học sinh cho tuyến đường hiện tại của bạn.
        </p>
        <div className='overflow-x-auto'>
            <div className="min-w-[900px]">

        <div className="grid grid-cols-[3fr_2fr_4fr_2fr_2fr_1fr] py-6 text-center text-black border-b border-gray-300 font-bold">
          <span>Ảnh Đại Diện</span>
          <span>Tên Học Sinh</span>
          <span>Tên Điểm Dừng</span>
          <span>Thời Gian</span>
          <span>Trạng Thái</span>
          <span>Hành Động</span>
        </div>

        {students.map((student) => (
          <StudentCard key={student.id} data={student} />
        ))}
        </div>
        </div>
      </section>
    </div>
  )
}

export default Page
