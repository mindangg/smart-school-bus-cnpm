import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from "lucide-react"

type StudentProps = {
  data: {
    id: number
    name: string
    stop: string
    time: string
    status: string
  }
}

const StudentCard = ({ data }: StudentProps) => {
  return (
    <div className="grid grid-cols-[4fr_5fr_4fr_3fr_2fr] py-6 text-center text-black border-b border-gray-300">
      <span>{data.name}</span>
      <span>{data.stop}</span>
      <span>{data.time}</span>
      <span>{data.status}</span>
      <span>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
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
