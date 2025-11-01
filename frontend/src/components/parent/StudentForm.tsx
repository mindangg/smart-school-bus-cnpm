import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const StudentForm = ({student}: any) => {
    return (
        <div className='w-[90%] max-w-xl flex flex-col justify-center gap-5
        mx-auto border border-gray-200 p-7 rounded-lg shadow-md mt-5'>
            <h1 className='text-2xl font-bold text-center'>Thông tin</h1>
            <Image
                src={student.profile_photo_url}
                alt={student.full_name}
                width={150}
                height={150}
                className="border border-gray-200 p-2 rounded-lg shadow-sm object-cover w-[150px] h-[150px]"
            />
            <div className='flex flex-col justify-center gap-2'>
                <Label>Họ tên</Label>
                <Input value={student.full_name} readOnly/>
            </div>
            <Button asChild className='w-full bg-blue-500 hover:bg-blue-600 hover:cursor-pointer'>
                <Link href={`students/${student.student_id}`}>
                    Xem chuyến đi
                </Link>
            </Button>
        </div>
    );
};

export default StudentForm;