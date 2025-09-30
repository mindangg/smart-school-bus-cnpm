import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from "lucide-react"

const PathCard = () => {
    return (
        <div className='grid grid-cols-[2fr_4fr_5fr_3fr_2fr] py-6 text-center text-black border-b border-gray-300'>
            <span>1</span>
            <span>Bến Xe Mỹ Đình</span>
            <span>Số 20 Phạm Hùng, Mỹ Đình 2, Nam Từ Liêm, Hà Nội</span>
            <span>07:30 AM</span>
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

export default PathCard