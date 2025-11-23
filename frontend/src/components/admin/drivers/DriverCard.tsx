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
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Driver {
    user_id: number,
    email: string,
    full_name: string,
    phone_number: string,
    address: string,
}

interface DriverCardProps {
    driver: Driver,
    handleDelete: (user_id: number) => void
}

const DriverCard = ({ driver, handleDelete } : DriverCardProps) => {
    const [open, setOpen] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    
    return (
        <div className='grid grid-cols-[2fr_3fr_3fr_3fr_5fr_2fr] py-6 text-center text-black border-b border-gray-300'>
            <span>TX{driver.user_id}</span>
            <span>{driver.email}</span>
            <span>{driver.full_name}</span>
            <span>{driver.phone_number}</span>
            <span>{driver.address}</span>
            <span>
                <DropdownMenu>
                <DropdownMenuTrigger><Ellipsis /></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setOpen(true)}>Chỉnh Sửa</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpenAlert(true)}>Xóa</DropdownMenuItem>
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
                    <AlertDialogAction onClick={() => handleDelete(driver.user_id)}>Đồng ý</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>

                <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Chỉnh Sửa Tài Xế</DialogTitle>
                    </DialogHeader>
                    <DriverForm
                        mode='update'
                        driver={driver}
                    />
                </DialogContent>
                </Dialog>
            </span>
        </div>
    )
}

export default DriverCard