'use client'

import React from 'react';
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Ellipsis} from "lucide-react";
import api from "@/lib/axios";
import {toast} from "sonner";

const StudentCard = ({ student, studentPickup, setOpen }: any) => {
    const handleUpdateEvent = async (event: string) => {
        await api.put(`student_events/stop_student`, {
            student_id: student.student_id,
            event_type: event
        })
        setOpen(false)
        toast.success("Cập nhật thành công")
    }

    return (
        <div className='grid grid-cols-[3fr_2fr_4fr_2fr_2fr_1fr] items-center py-6 text-center text-black border-b border-gray-300'>
            <span className="w-50 h-12 relative overflow-hidden rounded-full mx-auto">
                <Image
                    src={student.profile_photo_url}
                    alt={student.full_name}
                    fill
                    style={{ objectFit: 'contain' }}
                />
            </span>
            <span>{student.full_name}</span>
            <span>{studentPickup}</span>
            <span>6:30</span>
            <span>{
                student.student_events[0]?.event_type == 'PICKED UP' ? 'Đã đón' :
                student.student_events[0]?.event_type == 'DROPPED OFF' ? 'Đã tới nơi' :
                student.student_events[0]?.event_type == 'ABSENT' ? 'Không xuất hiện' : 'Đang đợi'
            }</span>
            <span>
                <DropdownMenu>
                <DropdownMenuTrigger><Ellipsis /></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Hành Động</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleUpdateEvent('PICKED UP')}>Đã đón</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateEvent('DROPPED OFF')}>Đã tới nơi</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateEvent('ABSENT')}>Không xuất hiện</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </span>
        </div>
    );
};

export default StudentCard;