'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from "lucide-react"
import DriverForm from "./DriverForm"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const DriverCard = () => {
    return (
        <div className='grid grid-cols-[2fr_3fr_3fr_3fr_5fr_2fr] py-6 text-center text-black border-b border-gray-300'>
            <span>TX001</span>
            <span>mindang@gmail.com</span>
            <span>Trần Minh Đăng</span>
            <span>0901234567</span>
            <span>123 An Dương Vương p12 quận tân bình tphcm</span>
            <span>
                <DropdownMenu>
                <DropdownMenuTrigger><Ellipsis /></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Hành Động</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Dialog>
                            <DialogTrigger>
                                    Chỉnh Sửa
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                <DialogTitle>Chỉnh Sửa Tài Xế</DialogTitle>
                                </DialogHeader>
                                <DriverForm mode='update'/>
                            </DialogContent>
                            </Dialog>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </span>
        </div>
    )
}

export default DriverCard