import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import Image from "next/image"

const page = () => {
    return (
        <section>    
            <section className='bg-white flex flex-col gap-3'>
                <h1 className='text-xl font-bold'>Bảng Phân Công Tuyến Đường</h1>
                <h2 className='text-md font-bold'>Phân Công Tài Xế và Xe Buýt cho Tuyến Đường</h2>
                <div className='w-full flex items-center justify-between gap-5'>
                    <div className='w-1/3'>
                        <Label htmlFor="path" className='mb-3'>Chọn Tuyến Đường</Label>
                        <Select>
                            <SelectTrigger id="path" className="w-full">
                                <SelectValue placeholder="Chọn một tuyến đường" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='w-1/3'>
                        <Label htmlFor="driver" className='mb-3'>Chọn Tài Xế</Label>
                        <Select>
                            <SelectTrigger id="driver" className="w-full">
                                <SelectValue placeholder="Chọn một tài xế" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='w-1/3'>
                        <Label htmlFor="bus" className='mb-3'>Chọn Xe Buýt</Label>
                        <Select>
                            <SelectTrigger id="bus" className="w-full">
                                <SelectValue placeholder="Chọn một xe buýt" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button className='hover:cursor-pointer bg-blue-500 hover:bg-blue-400'>
                    Phân Công Tuyến
                </Button>
            </section>

            <section className='bg-white'>
                <h1 className='text-xl font-bold'>Chế Độ Xem Bản Đồ Trực Tiếp</h1>
                <h2 className='text-md font-bold'>Vị Trí Xe Buýt Thời Gian Thực</h2>
                <div>
                    <Image 
                        src='/images/bus.png'
                        width={200}
                        height={200}
                        alt="ok"
                    />
                </div>
            </section>
        </section>
    )
}

export default page