'use client'

import { BusFront, Trash, UserRoundPen } from "lucide-react"
import StudentForm from "./StudentForm"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Student {
    student_id: number,
    full_name: string,
}

interface StudentCardProps {
    student: Student,
    handleDelete: (student_id: number) => void
    fetchStudents: () => void
}

const StudentCard = ({ student, handleDelete, fetchStudents } : StudentCardProps) => {
    const [open, setOpen] = useState(false)
        const [openAlert, setOpenAlert] = useState(false)
    
    return (
        <div className='m-5 md:m-10 flex flex-col w-[700px] gap-5 bg-white p-8 border border-gray-200 shadow-sm rounded-2xl'>
            <div className='flex items-center justify-between gap-10 border-b border-gray-400 pb-3'>
                <Image 
                    src='/images/profile.jpg'
                    width={100}
                    height={100}
                    alt="profile"
                />
                <div className='flex flex-col'>
                    <p className='text-md font-bold'>Họ tên: {student.full_name}</p>
                </div>

                <div className="flex gap-5">
                    <BusFront>
                        <Link href='/user/students/1' />
                    </BusFront>
                    <UserRoundPen  onClick={() => setOpen(true)} />
                    <Trash onClick={() => handleDelete(student.student_id)} />
                </div>

                <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc muốn xóa?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Hành động này không thể hoàn tác. Tài khoản này sẽ bị xóa vĩnh viễn.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(student.student_id)}>Đồng ý</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>

                <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Chỉnh Sửa Học Sinh</DialogTitle>
                    </DialogHeader>
                    <StudentForm
                    mode='update'
                    student={student}
                    fetchStudents={fetchStudents}
                    />
                </DialogContent>
                </Dialog>
            </div>
        </div>  
    )
}

export default StudentCard