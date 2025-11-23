'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";

interface Schedule {
    assignment_id: number;
    route_id: number;
    bus_number: string;
    route_name: string;
    driver_name: string;
    start_time: string;
    status: string;
}

interface ScheduleCardProps {
    schedule: Schedule;
    onViewDetails: (routeId: number) => void;
}

const ScheduleCard = ({ schedule, onViewDetails }: ScheduleCardProps) => {
    return (
        <div className='grid grid-cols-[3fr_4fr_4fr_3fr_2fr_2fr] py-6 text-center text-black border-b border-gray-300 items-center'>
            {/* Dữ liệu động */}
            <span>{schedule.bus_number}</span>
            <span>{schedule.route_name}</span>
            <span>{schedule.driver_name}</span>
            <span>{schedule.start_time}</span>
            <span>{schedule.status}</span>
            
            <span>
                <DropdownMenu>
                <DropdownMenuTrigger><Ellipsis /></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Hành Động</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onViewDetails(schedule.route_id)}>
                            Xem Chi Tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>Chỉnh Sửa</DropdownMenuItem>
                        <DropdownMenuItem>Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </span>
        </div>
    );
};

export default ScheduleCard;