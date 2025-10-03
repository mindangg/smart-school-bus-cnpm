import PathCard from "@/components/admin/PathCard"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Paths = () => {
    return (
        <section>
            <section>    
                <section className='bg-white flex flex-col gap-3 mb-10'>
                    <h1 className='text-2xl font-bold'>Bảng Phân Công Tuyến Đường</h1>
                    <h2 className='text-md font-bold'>Phân Công Tài Xế và Xe Buýt cho Tuyến Đường</h2>
                    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-4">
                        <Label htmlFor="path" className="mb-3">Chọn Tuyến Đường</Label>
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

                    <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-4">
                        <Label htmlFor="driver" className="mb-3">Chọn Tài Xế</Label>
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

                    <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-4">
                        <Label htmlFor="bus" className="mb-3">Chọn Xe Buýt</Label>
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
            </section>


            <section>
                <h1 className='text-2xl font-bold'>Danh Sách Điểm Dừng</h1>
                <div className='overflow-x-auto'>
                <div className="min-w-[900px]">
                <div className='grid grid-cols-[2fr_4fr_5fr_3fr_2fr] py-6 text-center text-black border-b border-gray-300 font-bold'>
                    <span>ID Điểm Dừng</span>
                    <span>Tên Điểm Dừng</span>
                    <span>Địa Chỉ</span>
                    <span>Thời Gian</span>
                    <span>Hành Động</span>
                </div>
                <PathCard />
                <PathCard />
                <PathCard />
                <PathCard />
                <PathCard />
                </div>
                </div>
            </section>
        </section>
        
    )
}

export default Paths