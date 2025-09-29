import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from "lucide-react"

const ScheduleCard = () => {
    return (
        <div className='grid grid-cols-[3_5_4_3_2] py-6 text-center text-black border-b border-gray-300'>
            <span>Điểm Dừng Chính & Đại Lộ Sồi</span>
            <span>Điểm Dừng Chính & Đại Lộ Sồi</span>
            <span>Nguyễn Văn An</span>
            <span>07:30 AM</span>
            <span>Đúng giờ</span>
            <span>
                <DropdownMenu>
                <DropdownMenuTrigger><Ellipsis /></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Hành Động</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Xem Chi Tiết</DropdownMenuItem>
                        <DropdownMenuItem>Chỉnh Sửa</DropdownMenuItem>
                        <DropdownMenuItem>Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </span>
        </div>
    )
}

export default ScheduleCard