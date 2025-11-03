'use client'

import React, {useState} from 'react';
import {Button} from "@/components/ui/button";
import {RefreshCcw} from "lucide-react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import ParentForm from "@/components/admin/parents/ParentForm";
import ParentCard from "@/components/admin/parents/ParentCard";
import {useRouter} from "next/navigation";
import api from "@/lib/axios";
import {toast} from "sonner";

const ParentPage = ({parents} : any) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`users/${id}`)
            toast('Xóa thành công')
            router.refresh()
        }
        catch (err) {
            console.error(err)
            toast("Xóa thất bại, vui lòng thử lại.")
        }
    }

    return (
        <main className='flex flex-col gap-5'>
            <div className='flex gap-5'>
                <h1 className='text-2xl font-bold'>Danh sách tài xế</h1>

                <Button
                    variant="outline"
                    onClick={() => router.refresh()}
                    className="flex items-center gap-2"
                >
                    Làm Mới
                    <RefreshCcw />
                </Button>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button >
                            Thêm Phụ Huynh
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Thêm Phụ Huynh</DialogTitle>
                        </DialogHeader>
                        <ParentForm
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                    <div className="grid grid-cols-[2fr_3fr_3fr_3fr_5fr_2fr] py-6 text-center text-black border-b border-gray-300 font-bold">
                        <span>ID Tài Xế</span>
                        <span>Email</span>
                        <span>Họ Tên</span>
                        <span>Số Điện Thoại</span>
                        <span>Địa Chỉ</span>
                    </div>

                    {parents?.length > 0 ? (
                        parents.map((parent : any) => (
                            <ParentCard
                                key={parent.user_id}
                                parent={parent}
                                handleDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <p className="py-6 text-center text-gray-700">
                            Không có phụ huynh nào.
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ParentPage;