import React from 'react';
import {X} from "lucide-react";
import StudentCard from "@/components/driver/StudentCard";

const StudentPopup = ({students, studentPickup, setOpen}: any) => {
    return (
        <div className="fixed left-0 top-0 w-full h-full bg-black/50 z-40">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-white w-[90%] text-white rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
            >
                <X className='absolute text-black right-5' onClick={() => setOpen(false)}/>
                <p className="text-lg text-black font-bold">Đón & Trả Học Sinh</p>
                <p className="text-gray-600">
                    Quản lý trạng thái học sinh cho tuyến đường hiện tại.
                </p>
                <div className='overflow-x-auto'>
                    <div className="min-w-[900px]">

                        <div
                            className="grid grid-cols-[3fr_2fr_4fr_2fr_2fr_1fr] items-center py-6 text-center text-black border-b border-gray-300 font-bold">
                            <span>Ảnh Đại Diện</span>
                            <span>Tên Học Sinh</span>
                            <span>Tên Điểm Đón</span>
                            <span>Thời Gian</span>
                            <span>Trạng Thái</span>
                            <span>Hành Động</span>
                        </div>

                        {students.map((student: any) => (
                            <StudentCard key={student.student_id} student={student} studentPickup={studentPickup} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentPopup;