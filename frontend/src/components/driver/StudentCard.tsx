'use client'

import React, {useState} from 'react';
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Ellipsis} from "lucide-react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import StudentForm from "@/components/admin/students/StudentForm";

const StudentCard = ({ student, handleDelete }: any) => {
    const [open, setOpen] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)

    return (
        <div className='grid grid-cols-[3fr_2fr_4fr_2fr_2fr_1fr] items-center py-6 text-center text-black border-b border-gray-300'>
            <span className="w-50 h-12 relative overflow-hidden rounded-full mx-auto">
                <Image
                    src={student?.profile_photo_url}
                    alt={student?.full_name}
                    fill
                    style={{ objectFit: 'contain' }}
                />
            </span>
            <span>{student?.full_name}abc</span>
            <span>tuyến đuonwgf</span>
            <span>6:30</span>
            <span>da don</span>
            <span>
                <DropdownMenu>
                <DropdownMenuTrigger><Ellipsis /></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Hành Động</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setOpen(true)}>Đã đón</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpenAlert(true)}>Đã tới nơi</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpenAlert(true)}>Không xuất hiện</DropdownMenuItem>
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