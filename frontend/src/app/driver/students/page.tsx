import React from "react"
import StudentCard from "@/components/admin/StudentCard"

const Page = () => {
  // Mock data
  const students = [
    { id: 1, name: "Trần Thị An", stop: "Điểm Dừng Chính & Đại Lộ Sồi", time: "07:30 AM", status: "Đã Đón" },
    { id: 2, name: "Nguyễn Văn B", stop: "Trạm xe Nguyễn Trãi", time: "07:40 AM", status: "Chưa Đón" },
    { id: 3, name: "Lê Thị C", stop: "Ngã tư Hàng Xanh", time: "07:50 AM", status: "Đã Đón" },
     { id: 3, name: "Lê Thị C", stop: "Ngã tư Hàng Xanh", time: "07:50 AM", status: "Đã Đón" },
      { id: 3, name: "Lê Thị C", stop: "Ngã tư Hàng Xanh", time: "07:50 AM", status: "Đã Đón" },
       { id: 3, name: "Lê Thị C", stop: "Ngã tư Hàng Xanh", time: "07:50 AM", status: "Đã Đón" },
        { id: 3, name: "Lê Thị C", stop: "Ngã tư Hàng Xanh", time: "07:50 AM", status: "Đã Đón" },
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
        {/* Header */}
        <div className="grid grid-cols-[4fr_5fr_4fr_3fr_2fr] py-6 text-center text-black border-b border-gray-300 font-bold">
          <span>Tên Học Sinh</span>
          <span>Tên Điểm Dừng</span>
          <span>Thời Gian</span>
          <span>Trạng Thái</span>
          <span>Hành Động</span>
        </div>

        {/* Render danh sách */}
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
