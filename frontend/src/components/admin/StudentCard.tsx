import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from "lucide-react"

const StudentCard = () => {
    return (
        <div className='grid grid-cols-[4fr_5fr_4fr_3fr_2fr] py-6 text-center text-black border-b border-gray-300'>
            <span>Trần Thị An</span>
            <span>Điểm Dừng Chính & Đại Lộ Sồi</span>
            <span>07:30 AM</span>
            <span>Đã Đón</span>
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

export default StudentCard