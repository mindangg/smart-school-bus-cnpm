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
        <div className='grid grid-cols-[3fr_5fr_4fr_3fr_2fr_2fr] py-6 text-center text-black border-b border-gray-300'>
            <span>B001</span>
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