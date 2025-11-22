'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Ellipsis} from "lucide-react"
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {useState} from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import ParentForm from "@/components/admin/parents/ParentForm";

interface Parent {
    user_id: number,
    email: string,
    full_name: string,
    phone_number: string,
    address: string,
}

interface ParentCardProps {
    parent: Parent,
    handleDelete: (user_id: number) => void
}

const ParentCard = ({ parent, handleDelete } : ParentCardProps) => {
    const [open, setOpen] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)

    return (
        <div className='grid grid-cols-[3fr_3fr_3fr_5fr_2fr] py-6 text-center text-black border-b border-gray-300'>
            <span>{parent.email}</span>
            <span>{parent.full_name}</span>
            <span>{parent.phone_number}</span>
            <span>{parent.address}</span>
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
                    <AlertDialogAction onClick={() => handleDelete(parent.user_id)}>Đồng ý</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>

                <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Chỉnh Sửa Phụ Huynh</DialogTitle>
                    </DialogHeader>
                    <ParentForm
                        mode='update'
                        parent={parent}
                    />
                </DialogContent>
                </Dialog>
            </span>
        </div>
    );
};

export default ParentCard;