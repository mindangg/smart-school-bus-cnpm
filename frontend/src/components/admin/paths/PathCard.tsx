import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Ellipsis } from "lucide-react"
import Link from "next/link";
import {toast} from "sonner";
import api from "@/lib/axios";

const PathCard = ({ route, onDeleteRoute }: any) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await api.delete(`routes/${route.route_id}`);

            if (response.status !== 200 && response.status !== 204) {
                throw new Error('Failed to delete the route');
            }

            toast.success('Xóa tuyến đường thành công');

            setShowDeleteDialog(false);
            onDeleteRoute();
        } catch (error) {
            console.error('Error deleting route:', error);
            toast.error('Đã xảy ra lỗi khi xóa tuyến đường');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className='grid grid-cols-[1.5fr_5fr_1.5fr_1.5fr_1.5fr] py-6 text-center text-black border-b border-gray-300 items-center'>
                <span>{route.route_id}</span>
                <span>
                    {route.route_stops[0].stop.address} → {route.route_stops[route.route_stops.length - 1].stop.address}
                </span>
                <span>{route.start_time}</span>
                <span>{route.route_type === 'MORNING' ? 'Buổi sáng' : 'Buổi chiều'}</span>
                <span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Ellipsis className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/paths/${route.route_id}`} className="cursor-pointer">
                                    Xem Tuyến Đường
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                Xóa
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </span>
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa tuyến đường #{route.route_id}?
                            Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="text-amber-600 mt-0.5">
                                ⚠️
                            </div>
                            <div className="text-amber-800 text-sm">
                                <p className="font-medium">Tuyến đường sẽ bị xóa vĩnh viễn</p>
                                <p className="mt-1">
                                    Tất cả thông tin về tuyến đường này sẽ bị xóa và không thể khôi phục.
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={isDeleting}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Đang xóa...
                                </>
                            ) : (
                                'Xóa tuyến đường'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default PathCard;