'use client'

import React, {useState} from 'react';
import {useRouter} from "next/navigation";
import api from "@/lib/axios";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {RefreshCcw} from "lucide-react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import StudentCard from "@/components/admin/students/StudentCard";
import StudentForm from "@/components/admin/students/StudentForm";

const StudentPage = ({students}: any) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`students/${id}`)
            toast.success('Xóa thành công')
            router.refresh()
        }
        catch (err) {
            console.error(err)
            toast.success("Xóa thất bại, vui lòng thử lại.")
        }
    }

    return (
        <main className='flex flex-col gap-5'>
            <div className='flex gap-5'>
                <h1 className='text-2xl font-bold'>Danh sách học sinh</h1>

                <Button
                    variant="outline"
                    onClick={() => router.refresh()}
                    className="flex items-center gap-2"
                >
                    Làm Mới
                    <RefreshCcw />
                </Button>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button >
                            Thêm học sinh
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Thêm học sinh</DialogTitle>
                        </DialogHeader>
                        <StudentForm
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                    <div className="grid grid-cols-[2fr_3fr_3fr_2fr] py-6 text-center text-black border-b border-gray-300 font-bold">
                        <span>Phụ Huynh</span>
                        <span>Avatar</span>
                        <span>Họ Tên</span>
                        <span>Hành Động</span>
                    </div>

                    {students?.length > 0 ? (
                        students.map((student : any) => (
                            <StudentCard
                                key={student.student_id}
                                student={student}
                                handleDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <p className="py-6 text-center text-gray-700">
                            Không có học sinh nào.
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default StudentPage;