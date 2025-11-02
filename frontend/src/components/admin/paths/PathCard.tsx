import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from "lucide-react"
import Link from "next/link";

const PathCard = ({ route }: any) => {
    return (
        <div className='grid grid-cols-[1.5fr_5fr_1.5fr_1.5fr_1.5fr] py-6 text-center text-black border-b border-gray-300'>
            <span>{route.route_id}</span>
            <span>{route.route_stops[0].stop.address} - {route.route_stops[1].stop.address}</span>
            <span>{route.start_time}</span>
            <span>{route.routes_type ? 'Buổi sáng' : 'Buổi chiều'}</span>
            <span>
                <DropdownMenu>
                <DropdownMenuTrigger><Ellipsis /></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Hành Động</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/paths/${route.route_id}`}>
                                 Xem Tuyến Đường
                            </Link>
                            </DropdownMenuItem>
                        <DropdownMenuItem>Chỉnh Sửa</DropdownMenuItem>
                        <DropdownMenuItem>Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </span>
        </div>
    )
}

export default PathCard