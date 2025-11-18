'use client'

import React, {useState} from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Ellipsis} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import StudentForm from "@/components/admin/students/StudentForm";
import Image from "next/image";

const StudentCard = ({ student, handleDelete }: any) => {
    const [open, setOpen] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)

    return (
        <div className='grid grid-cols-[2fr_3fr_3fr_2fr] items-center py-6 text-center text-black border-b border-gray-300'>
            <span>{student?.users?.full_name}</span>
            <span className="w-50 h-12 relative overflow-hidden rounded-full mx-auto">
                <Image
                    src={student.profile_photo_url}
                    alt={student.full_name}
                    fill
                    style={{ objectFit: 'contain' }}
                />
            </span>
            <span>{student.full_name}</span>
            <span>
                <DropdownMenu>
                <DropdownMenuTrigger><Ellipsis /></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Hành Động</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setOpen(true)}>Chỉnh Sửa</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpenAlert(true)}>Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

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
                    />
                </DialogContent>
                </Dialog>
            </span>
        </div>
    );
};

export default StudentCard;